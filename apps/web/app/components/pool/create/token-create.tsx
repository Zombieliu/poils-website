'use client';
import { ChevronDown } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@repo/ui/components/ui/select';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { PoolSetupOpen, SelectedPoolTokens } from '@/app/jotai/pool/pool';
import { X } from 'lucide-react';
import { AssetsMetadata } from '@/app/jotai/swap/swap';
import { initPoilsClient } from '@/app/jotai/poils';
import { Transaction, TransactionArgument } from '@0xobelisk/sui-client';
import { ASSETS_ID, DEX_ID } from '@/app/chain/config';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { toast } from 'sonner';

interface TokenCreateProps {
  onClose: () => void;
  onSelectTokens: (base: any, quote: any) => void;
}

export default function TokenCreate({ onClose, onSelectTokens }: TokenCreateProps) {
  const [_, setPoolSetupOpen] = useAtom(PoolSetupOpen);
  const [assetMetadata] = useAtom(AssetsMetadata);
  const [baseToken, setBaseToken] = useState('');
  const [quoteToken, setQuoteToken] = useState('');
  const [selectedTokens, setSelectedTokens] = useAtom(SelectedPoolTokens);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState('');

  const handleSelectTokens = async () => {
    if (baseToken && quoteToken && baseToken !== quoteToken) {
      const baseAsset = assetMetadata.find((asset) => asset.id.toString() === baseToken);
      const quoteAsset = assetMetadata.find((asset) => asset.id.toString() === quoteToken);
      if (baseAsset && quoteAsset) {
        console.log('1');
        const poils = initPoilsClient();
        let tx = new Transaction();
        console.log(baseAsset.id);
        console.log(quoteAsset.id);
        await poils.createPool(tx, baseAsset.id, quoteAsset.id, true);
        await signAndExecuteTransaction(
          {
            transaction: tx.serialize(),
            chain: `sui:testnet`
          },
          {
            onSuccess: (result) => {
              console.log('executed transaction', result);
              toast('Translation Successful', {
                description: new Date().toUTCString(),
                action: {
                  label: 'Check in Explorer',
                  onClick: () =>
                    window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, '_blank')
                }
              });
              setDigest(result.digest);
            },
            onError: (error) => {
              console.log('executed transaction', error);
            }
          }
        );
        // onSelectTokens(baseAsset, quoteAsset);
      }
    } else {
      console.error('Please select different tokens for base and quote');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Step 1: Select tokens</h2>
      </div>
      <p className="text-gray-400 mb-6">Tips: Select different tokens for base and quote.</p>
      <div className="space-y-4">
        <Select onValueChange={setBaseToken}>
          <SelectTrigger className="w-full bg-white border-gray-700">
            <SelectValue placeholder="Select a base token" />
          </SelectTrigger>
          <SelectContent>
            {assetMetadata.map((asset) => (
              <SelectItem key={asset.id} value={asset.id.toString()}>
                <div className="flex items-center">
                  <img
                    src={asset.metadata[4] || '/default-icon.png'}
                    alt={asset.metadata[0] || `Asset ${asset.id}`}
                    className="w-6 h-6 mr-2"
                  />
                  <span className="ml-2">{asset.metadata[0] || `Asset ${asset.id}`}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setQuoteToken}>
          <SelectTrigger className="w-full bg-white border-gray-700">
            <SelectValue placeholder="Select a quote token" />
          </SelectTrigger>
          <SelectContent>
            {assetMetadata.map((asset) => (
              <SelectItem key={asset.id} value={asset.id.toString()}>
                <div className="flex items-center">
                  <img
                    src={asset.metadata[4] || '/default-icon.png'}
                    alt={asset.metadata[0] || `Asset ${asset.id}`}
                    className="w-6 h-6 mr-2"
                  />
                  <span className="ml-2">{asset.metadata[0] || `Asset ${asset.id}`}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleSelectTokens}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
        >
          Select tokens
        </Button>
      </div>
    </div>
  );
}
