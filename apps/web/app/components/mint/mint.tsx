"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { InfoCircledIcon } from "@radix-ui/react-icons"


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

export default function Mint() {
  const [uploadedBlobs, setUploadedBlobs] = useState<BlobInfo[]>([]);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [decimals, setDecimals] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);

  const basePublisherUrl = "https://publisher-devnet.walrus.space"
  const Aggregator = "https://aggregator-devnet.walrus.space"

  useEffect(() => {
    // 检查所有必填字段是否已填写，且至少上传了一个图片
    const isComplete = tokenName !== "" && 
                       tokenSymbol !== "" && 
                       description !== "" && 
                       decimals !== "" && 
                       uploadedBlobs.length > 0;
    setIsFormComplete(isComplete);
  }, [tokenName, tokenSymbol, description, decimals, uploadedBlobs]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const numEpochs = 1; // Adjust as needed
  
      try {
        const response = await fetch(`${basePublisherUrl}/v1/store?epochs=${numEpochs}`, {
          method: "PUT",
          body: file,
        });
  
        if (response.status === 200) {
          const storage_info = await response.json();
          const blobInfo = processUploadResponse(storage_info, file.type);
          setUploadedBlobs(prevBlobs => [blobInfo, ...prevBlobs]);
          
          // 关闭Token Image上传区域
          closeTokenImageArea();
        } else {
          throw new Error("Something went wrong when storing the blob!");
        }
      } catch (error) {
        console.error("Upload error:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  // 新增函数来关闭Token Image区域
const closeTokenImageArea = () => {
  const tokenImageArea = document.getElementById('dropzone-file');
  if (tokenImageArea) {
    tokenImageArea.style.display = 'none';
  }
  
  // 可选：隐藏整个上传区域的父元素
  const uploadArea = tokenImageArea?.closest('label');
  if (uploadArea) {
    uploadArea.style.display = 'none';
  }
};

  const processUploadResponse = (storage_info: any, media_type: string): BlobInfo => {
    const SUI_NETWORK = "testnet";
    const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
    const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

    let info: BlobInfo;
    if ("alreadyCertified" in storage_info) {
      info = {
        status: "Already certified",
        blobId: storage_info.alreadyCertified.blobId,
        endEpoch: storage_info.alreadyCertified.endEpoch,
        suiRefType: "Previous Sui Certified Event",
        suiRef: storage_info.alreadyCertified.event.txDigest,
        suiBaseUrl: SUI_VIEW_TX_URL,
        blobUrl: `${Aggregator}/v1/${storage_info.alreadyCertified.blobId}`,
        isImage: media_type.startsWith("image"),
        media_type: media_type
      };
    } else if ("newlyCreated" in storage_info) {
      info = {
        status: "Newly created",
        blobId: storage_info.newlyCreated.blobObject.blobId,
        endEpoch: storage_info.newlyCreated.blobObject.storage.endEpoch,
        suiRefType: "Associated Sui Object",
        suiRef: storage_info.newlyCreated.blobObject.id,
        suiBaseUrl: SUI_VIEW_OBJECT_URL,
        blobUrl: `${Aggregator}/v1/${storage_info.newlyCreated.blobObject.blobId}`,
        isImage: media_type.startsWith("image"),
        media_type: media_type
      };
    } else {
      throw Error("Unhandled successful response!");
    }

    return info;
  };

  const handleMint = () => {
    // 在这里添加铸造逻辑
    console.log("Minting token...");
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-12">Create a New Poils Token</h1>
      
      <div className="max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="tokenName">Token Name</Label>
              <Input 
                id="tokenName" 
                placeholder="Enter token name" 
                className="bg-white border-gray-700" 
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tokenSymbol">Token Symbol</Label>
              <Input 
                id="tokenSymbol" 
                placeholder="Enter token symbol" 
                className="bg-white border-gray-700" 
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Description <InfoCircledIcon className="h-4 w-4 text-gray-400" />
                </Label>
                <Textarea 
                  id="description" 
                  placeholder="Set your token description here" 
                  className="bg-white border-gray-700 h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="decimals" className="flex items-center gap-2">
                  Decimals <InfoCircledIcon className="h-4 w-4 " />
                </Label>
                <Input 
                  id="decimals" 
                  placeholder="9" 
                  className="bg-white border-gray-700" 
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                />
              </div>
              {isFormComplete && (
                <div className="flex items-end">
                  <Button onClick={handleMint}>Mint</Button>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="projectImage">Token Image:</Label>

              <div className="mt-1">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
              <p className="text-xs mt-1">Powered by Walrus</p>
            </div>
          </div>
        </section>

        <section id="uploaded-blobs" className="space-y-4">
          {uploadedBlobs.map((info, index) => (
            <article key={index} className="border rounded-lg shadow-sm p-4 bg-gray-50">
              <div className="flex">
                {info.isImage && (
                  <object type={info.media_type} data={info.blobUrl}
                    className="w-1/3 h-auto object-cover rounded-lg mr-4"></object>
                )}
                <dl className="blob-info flex-1">
                  <div className="mb-2">
                    <dt className="font-semibold">Status</dt>
                    <dd>{info.status}</dd>
                  </div>
                  <div className="mb-2">
                    <dt className="font-semibold">Blob ID</dt>
                    <dd className="truncate"><a href={info.blobUrl} className="text-blue-600 hover:underline">{info.blobId}</a></dd>
                  </div>
                  <div className="mb-2">
                    <dt className="font-semibold">{info.suiRefType}</dt>
                    <dd className="truncate">
                      <a href={`${info.suiBaseUrl}/${info.suiRef}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{info.suiRef}</a>
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
      </div>
    </div>
  )
}