'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  SuiTransactionBlockResponse,
  Transaction,
  TransactionArgument,
  isValidSuiAddress
} from '@0xobelisk/sui-client';
import { initPoilsClient, poilsClient } from '@/app/jotai/poils';
import { useAtom } from 'jotai';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import { ASSETS_ID } from '@/app/chain/config';
import { Switch } from '@repo/ui/components/ui/switch';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/ui/alert';

interface BlobInfo {
  status: string;
  blobId: string;
  endEpoch: string;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  blobUrl: string;
  isImage: boolean;
  media_type: string;
}

export default function Create() {
  const [uploadedBlobs, setUploadedBlobs] = useState<BlobInfo[]>([]);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [decimals, setDecimals] = useState('9');
  const [isFormComplete, setIsFormComplete] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [actualSupply, setActualSupply] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [owner, setOwner] = useState('');
  const [isMintable, setIsMintable] = useState(false);
  const [isBurnable, setIsBurnable] = useState(false);
  const [isFreezable, setIsFreezable] = useState(false);
  const [sendToError, setSendToError] = useState('');
  const [ownerError, setOwnerError] = useState('');
  const [useSendToMyAddress, setUseSendToMyAddress] = useState(false);
  const [useOwnerMyAddress, setUseOwnerMyAddress] = useState(false);
  const account = useCurrentAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // const basePubslisherUrl = 'https://publisher-devnet.walrus.space';
  // const Aggregator = 'https://aggregator-devnet.walrus.space';

  const basePubslisherUrl = 'https://publisher.walrus-testnet.walrus.space';
  const Aggregator = 'https://aggregator.walrus-testnet.walrus.space';

  useEffect(() => {
    // Update form completion check
    const isComplete =
      tokenName !== '' &&
      tokenSymbol !== '' &&
      description !== '' &&
      decimals !== '' &&
      initialSupply !== '' &&
      sendTo !== '' &&
      owner !== '' &&
      uploadedBlobs.length > 0 &&
      !sendToError &&
      !ownerError;
    setIsFormComplete(isComplete);
  }, [
    tokenName,
    tokenSymbol,
    description,
    decimals,
    initialSupply,
    sendTo,
    owner,
    uploadedBlobs,
    sendToError,
    ownerError
  ]);

  useEffect(() => {
    if (initialSupply && decimals) {
      const supply = parseFloat(initialSupply);
      const dec = parseInt(decimals);
      if (!isNaN(supply) && !isNaN(dec)) {
        setActualSupply((supply * Math.pow(10, dec)).toString());
      } else {
        setActualSupply('');
      }
    } else {
      setActualSupply('');
    }
  }, [initialSupply, decimals]);

  useEffect(() => {
    if (useSendToMyAddress && account?.address) {
      setSendTo(account.address);
      validateAddress(account.address, setSendToError);
    }
  }, [useSendToMyAddress, account?.address]);

  useEffect(() => {
    if (useOwnerMyAddress && account?.address) {
      setOwner(account.address);
      validateAddress(account.address, setOwnerError);
    }
  }, [useOwnerMyAddress, account?.address]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const numEpochs = 1; // Adjust as needed
      setIsUploading(true);
      setUploadError(null);

      try {
        const response = await fetch(`${basePubslisherUrl}/v1/store?epochs=${numEpochs}`, {
          method: 'PUT',
          body: file
        });

        if (response.status === 200) {
          const storage_info = await response.json();
          const blobInfo = processUploadResponse(storage_info, file.type);
          setUploadedBlobs((prevBlobs) => [blobInfo, ...prevBlobs]);
          closeTokenImageArea();
        } else {
          throw new Error('Something went wrong when storing the blob!');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError('An error occurred while uploading. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const closeTokenImageArea = () => {
    const tokenImageArea = document.getElementById('dropzone-file');
    if (tokenImageArea) {
      tokenImageArea.style.display = 'none';
    }

    // Optionally hide the parent element of the upload area
    const uploadArea = tokenImageArea?.closest('label');
    if (uploadArea) {
      uploadArea.style.display = 'none';
    }
  };

  const processUploadResponse = (storage_info: any, media_type: string): BlobInfo => {
    const SUI_NETWORK = 'testnet';
    const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
    const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

    let info: BlobInfo;
    if ('alreadyCertified' in storage_info) {
      info = {
        status: 'Already certified',
        blobId: storage_info.alreadyCertified.blobId,
        endEpoch: storage_info.alreadyCertified.endEpoch,
        suiRefType: 'Previous Sui Certified Event',
        suiRef: storage_info.alreadyCertified.event.txDigest,
        suiBaseUrl: SUI_VIEW_TX_URL,
        blobUrl: `${Aggregator}/v1/${storage_info.alreadyCertified.blobId}`,
        isImage: media_type.startsWith('image'),
        media_type: media_type
      };
    } else if ('newlyCreated' in storage_info) {
      info = {
        status: 'Newly created',
        blobId: storage_info.newlyCreated.blobObject.blobId,
        endEpoch: storage_info.newlyCreated.blobObject.storage.endEpoch,
        suiRefType: 'Associated Sui Object',
        suiRef: storage_info.newlyCreated.blobObject.id,
        suiBaseUrl: SUI_VIEW_OBJECT_URL,
        blobUrl: `${Aggregator}/v1/${storage_info.newlyCreated.blobObject.blobId}`,
        isImage: media_type.startsWith('image'),
        media_type: media_type
      };
    } else {
      throw Error('Unhandled successful response!');
    }

    return info;
  };

  const validateAddress = (address: string, setError: (error: string) => void) => {
    if (!isValidSuiAddress(address)) {
      setError('Invalid Sui address');
    } else {
      setError('');
    }
  };

  const handleSendToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSendTo(value);
    validateAddress(value, setSendToError);
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOwner(value);
    validateAddress(value, setOwnerError);
  };

  const handleUseSendToMyAddress = (checked: boolean) => {
    setUseSendToMyAddress(checked);
    if (!checked) {
      setSendTo('');
      setSendToError('');
    } else if (account?.address) {
      setSendTo(account.address);
      validateAddress(account.address, setSendToError);
    }
  };

  const handleUseOwnerMyAddress = (checked: boolean) => {
    setUseOwnerMyAddress(checked);
    if (!checked) {
      setOwner('');
      setOwnerError('');
    } else if (account?.address) {
      setOwner(account.address);
      validateAddress(account.address, setOwnerError);
    }
  };

  const handleCreate = async () => {
    try {
      const poils = initPoilsClient();
      const mintInfo = {
        tokenName,
        tokenSymbol,
        description,
        decimals: parseInt(decimals, 10),
        blobUrl: uploadedBlobs[0]?.blobUrl,
        initialSupply: BigInt(parseFloat(initialSupply) * Math.pow(10, parseInt(decimals, 10)))
      };
      let tx = new Transaction();
      
      console.log('ASSETS_ID', ASSETS_ID);
    console.log('tokenSymbol', tokenSymbol);
    console.log('description', description);
    console.log('decimals', mintInfo.decimals);
    console.log('initialSupply', mintInfo.initialSupply);
    console.log('sendTo', sendTo);
    console.log('owner', owner);
    console.log('isMintable', isMintable);
    console.log('isBurnable', isBurnable);
    console.log('isFreezable', isFreezable);

      // await obelisk.tx.assets_system.create(tx, params, undefined, true);
      await poils.create(
        tx,
        tokenName,
        tokenSymbol,
        description,
        mintInfo.decimals,
        mintInfo.blobUrl,
        mintInfo.blobUrl,
        mintInfo.initialSupply, // Use the adjusted initialSupply
        sendTo,
        owner,
        isMintable,
        isBurnable,
        isFreezable,
        true
      );

      const result = await signAndExecuteTransaction({
        transaction: tx.serialize(),
        chain: `sui:testnet`
      });

      console.log('Minting successful:', result);
      // 添加成功提示
    } catch (error) {
      console.error('Minting failed:', error);
      // 添加错误提示
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-pink-100 to-purple-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-12">Create a New Poils Token</h1>

      <div className="max-w-3xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="tokenName">Token Name</Label>
              <Input
                id="tokenName"
                placeholder="Enter token name"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tokenSymbol">Token Symbol</Label>
              <Input
                id="tokenSymbol"
                placeholder="Enter token symbol"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter token description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="decimals">Decimals</Label>
              <Input id="decimals" type="number" placeholder="Enter decimals" />
            </div>
            <div>
              <Label htmlFor="initialSupply">Initial Supply</Label>
              <Input
                id="initialSupply"
                type="number"
                placeholder="Enter initial supply"
                value={initialSupply}
                onChange={(e) => setInitialSupply(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Actual initial supply: {actualSupply} (with {decimals} decimals)
              </p>
            </div>
            <div>
              <Label>Token Properties</Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input type="checkbox" id="mintable" className="mr-2" />
                  <label htmlFor="mintable">Mintable</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="burnable" className="mr-2" />
                  <label htmlFor="burnable">Burnable</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="freezable" className="mr-2" />
                  <label htmlFor="freezable">Freezable</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="sendTo">Send To</Label>
            <div className="flex items-center space-x-2 mb-2">
              <Switch
                id="useSendToMyAddress"
                checked={useSendToMyAddress}
                onCheckedChange={handleUseSendToMyAddress}
              />
              <Label htmlFor="useSendToMyAddress">Use my address</Label>
            </div>
            <Input
              id="sendTo"
              placeholder="Enter recipient address"
              value={sendTo}
              onChange={handleSendToChange}
              disabled={useSendToMyAddress}
            />
            {sendToError && <p className="text-red-500 text-sm mt-1">{sendToError}</p>}
          </div>

          <div>
            <Label htmlFor="owner">Owner</Label>
            <div className="flex items-center space-x-2 mb-2">
              <Switch
                id="useOwnerMyAddress"
                checked={useOwnerMyAddress}
                onCheckedChange={handleUseOwnerMyAddress}
              />
              <Label htmlFor="useOwnerMyAddress">Use my address</Label>
            </div>
            <Input
              id="owner"
              placeholder="Enter owner address"
              value={owner}
              onChange={handleOwnerChange}
              disabled={useOwnerMyAddress}
            />
            {ownerError && <p className="text-red-500 text-sm mt-1">{ownerError}</p>}
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="projectImage">Token Image:</Label>

          <div className="mt-1">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C4.157 4.688 3 4.345 3 5.587V14a1 1 0 0 0 1 1h8Z"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 10MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>

        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Moved uploaded file information display section */}
        <section id="uploaded-blobs" className="space-y-4">
          {uploadedBlobs.map((info, index) => (
            <article key={index} className="border rounded-lg shadow-sm p-4 bg-gray-50">
              <div className="flex">
                {info.isImage && (
                  <object
                    type={info.media_type}
                    data={info.blobUrl}
                    className="w-1/3 h-auto object-cover rounded-lg mr-4"
                  ></object>
                )}
                <dl className="blob-info flex-1">
                  <div className="mb-2">
                    <dt className="font-semibold">Status</dt>
                    <dd>{info.status}</dd>
                  </div>
                  <div className="mb-2">
                    <dt className="font-semibold">Blob ID</dt>
                    <dd className="truncate">
                      <a href={info.blobUrl} className="text-blue-600 hover:underline">
                        {info.blobId}
                      </a>
                    </dd>
                  </div>
                  <div className="mb-2">
                    <dt className="font-semibold">{info.suiRefType}</dt>
                    <dd className="truncate">
                      <a
                        href={`${info.suiBaseUrl}/${info.suiRef}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {info.suiRef}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Stored until epoch</dt>
                    <dd>{info.endEpoch}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </section>

        {/* Conditional rendering for Mint button */}
        {isFormComplete ? (
          <Button className="mt-8" onClick={handleCreate}>
            Create
          </Button>
        ) : (
          <p className="mt-8 text-gray-500">Please complete all fields to enable minting</p>
        )}
      </div>
    </div>
  );
}
