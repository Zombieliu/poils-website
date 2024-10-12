'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' instead of 'next/router';
import { useAtom } from 'jotai';
import { AssetsMetadata, TokenSelectionOpen } from '@/app/jotai/swap/swap';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { ChevronDown, ArrowUpDown, Loader2 } from 'lucide-react';
import TokenSelectionModal from '@/app/components/swap/token-selection-modal';
import { initObeliskClient } from '@/app/jotai/obelisk';
import { Transaction, TransactionArgument, DevInspectResults } from '@0xobelisk/sui-client';
import { ASSETS_ID, DEX_ID } from '@/app/chain/config';
import debounce from 'lodash/debounce';
import { initPoilsClient } from '@/app/jotai/poils';

// Add this utility function at the top of your file or in a separate utils file
const formatBalance = (balance: string, decimals: number): string => {
  const balanceNum = parseFloat(balance);
  if (isNaN(balanceNum)) return '0.0000';
  return (balanceNum / Math.pow(10, decimals)).toFixed(4);
};

export default function Page({ params }: { params: { fromToken: string; toToken: string } }) {
  const [isTokenSelectionOpen, setTokenSelectionOpen] = useAtom(TokenSelectionOpen);
  const router = useRouter();
  const [assetMetadata] = useAtom(AssetsMetadata);
  const [filteredAssets, setFilteredAssets] = useState(assetMetadata);
  const [fromToken, setFromToken] = useState<any>(null);
  const [toToken, setToToken] = useState<any>(null);
  const [currentSelection, setCurrentSelection] = useState<'from' | 'to'>('from');

  const [exchangeRate, setExchangeRate] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [dollarValue, setDollarValue] = useState<string | null>(null);

  const [fromTokenLoading, setFromTokenLoading] = useState(true);
  const [toTokenLoading, setToTokenLoading] = useState(true);

  const [fromTokenBalance, setFromTokenBalance] = useState<string>('0.00');
  const [toTokenBalance, setToTokenBalance] = useState<string>('0.00');

  const [isLoadingPay, setIsLoadingPay] = useState(false);
  const [isLoadingReceive, setIsLoadingReceive] = useState(false);
  const [dollarValuePay, setDollarValuePay] = useState<string | null>(null);
  const [dollarValueReceive, setDollarValueReceive] = useState<string | null>(null);

  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');

  const [slippage, setSlippage] = useState('1.00');

  const [isCalculating, setIsCalculating] = useState(false);

  const formatAmount = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  console.log('assetMetadata', assetMetadata);

  const filterTokens = useCallback(
    (term: string) => {
      setIsLoading(true);
      const lowercasedTerm = term.toLowerCase();
      const filtered = assetMetadata.filter(
        (asset) =>
          asset.metadata[0].toLowerCase().includes(lowercasedTerm) || // name
          asset.metadata[1].toLowerCase().includes(lowercasedTerm) || // symbol
          asset.metadata[2].toLowerCase().includes(lowercasedTerm) || // type
          asset.metadata[3].toLowerCase().includes(lowercasedTerm) || // decimals
          asset.metadata[4].toLowerCase().includes(lowercasedTerm) // icon
      );
      setFilteredAssets(filtered);
      setIsLoading(false);
    },
    [assetMetadata]
  );

  useEffect(() => {
    const fromTokenSymbol = params.fromToken.toUpperCase();
    const toTokenSymbol = params.toToken.toUpperCase();

    const fromTokenInfo = filteredAssets.find(
      (asset) => asset.metadata[1].toUpperCase() === fromTokenSymbol
    );
    const toTokenInfo = filteredAssets.find(
      (asset) => asset.metadata[1].toUpperCase() === toTokenSymbol
    );

    if (fromTokenInfo) {
      const decimals = parseInt(fromTokenInfo.metadata[3], 10);
      const formattedBalance = formatBalance(fromTokenInfo.balance || '0', decimals);
      setFromToken({
        id: fromTokenInfo.metadata[2],
        symbol: fromTokenInfo.metadata[1],
        icon: fromTokenInfo.metadata[4],
        decimals: decimals,
        name: fromTokenInfo.metadata[0],
        balance: formattedBalance
      });
      setFromTokenBalance(formattedBalance);
    } else {
      setFromTokenBalance('0.0000');
    }

    if (toTokenInfo) {
      const decimals = parseInt(toTokenInfo.metadata[3], 10);
      const formattedBalance = formatBalance(toTokenInfo.balance || '0', decimals);
      setToToken({
        id: toTokenInfo.metadata[2],
        symbol: toTokenInfo.metadata[1],
        decimals: decimals,
        icon: toTokenInfo.metadata[4],
        name: toTokenInfo.metadata[0],
        balance: formattedBalance
      });
      setToTokenBalance(formattedBalance);
    } else {
      setToTokenBalance('0.0000');
    }

    // Calculate and set exchange rate when both tokens are selected
    if (fromToken && toToken) {
      const rate = calculateExchangeRate(fromToken, toToken);
      setExchangeRate(rate);
    } else {
      setExchangeRate(null);
    }
  }, [params.fromToken, params.toToken, filteredAssets]);

  const calculateExchangeRate = (from: any, to: any) => {
    // This is a placeholder. Replace with actual rate calculation logic
    const fromValue = 1;
    const toValue = 0.0003;
    return `1 ${from.symbol} ($0.74) = ${toValue} ${to.symbol} ($2.43k)`;
  };

  const getAmountOut = async (amount: string) => {
    const poils = initPoilsClient();
    const path = [1, 0];
    let amount_out = await poils.getAmountOut(path, parseFloat(amount) * 1e9);
    return amount_out;
  };

  const calculateReceiveAmount = useCallback(
    debounce(async (amount: string) => {
      setIsCalculating(true);
      try {
        const amountOutResult: any[] = await getAmountOut(amount);
        // Assuming the first element of the array is the amount out
        const amountOut = BigInt(amountOutResult[0]);
        const calculatedReceiveAmount = (Number(amountOut) / 1e9).toFixed(9);
        setReceiveAmount(calculatedReceiveAmount);
        setDollarValuePay(`$${(parseFloat(amount) * 1).toFixed(2)}`);
        setDollarValueReceive(`$${(parseFloat(calculatedReceiveAmount) * 1).toFixed(2)}`);
      } catch (error) {
        console.error('Error calculating amount out:', error);
        setReceiveAmount('');
        setDollarValuePay(null);
        setDollarValueReceive(null);
      } finally {
        setIsCalculating(false);
      }
    }, 500),
    []
  );

  const handleInputChangePay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPayAmount(value);
    setIsCalculating(true);
    calculateReceiveAmount(value);
  };

  const handleInputChangeReceive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsLoadingReceive(true);
    setTimeout(() => {
      setDollarValueReceive('$1,835,875,668.29');
      setIsLoadingReceive(false);
    }, 1000);
  };

  const handleSelectToken = (token: any) => {
    if (currentSelection === 'from') {
      setFromToken(token);
      // Update URL to reflect new fromToken
      router.push(`/swap/${token.symbol}/${toToken?.symbol}`);
    } else {
      setToToken(token);
      // Update URL to reflect new toToken
      router.push(`/swap/${fromToken?.symbol}/${token.symbol}`);
    }
    setTokenSelectionOpen(false);
  };

  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      // Swap the tokens in the state
      setFromToken(toToken);
      setToToken(fromToken);

      // Update the URL to reflect the swapped tokens
      router.push(`/swap/${toToken.symbol}/${fromToken.symbol}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Swap</h1>
        {exchangeRate && (
          <div className="text-sm text-center text-gray-500 mb-4">{exchangeRate}</div>
        )}
        {/* Removed the buttons for Swap, Limit, DCA, and Cross-Chain */}
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-1">Sell</label>
            <div className="flex items-center justify-between">
              <Input
                type="text"
                value={payAmount}
                placeholder="0.0"
                className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                onChange={handleInputChangePay}
              />
              <Button
                variant="outline"
                className="ml-2 rounded-full"
                onClick={() => {
                  setCurrentSelection('from');
                  setTokenSelectionOpen(true);
                }}
              >
                {fromToken ? (
                  <>
                    <img src={fromToken.icon} alt={fromToken.symbol} className="w-5 h-5 mr-2" />
                    {fromToken.symbol}
                  </>
                ) : (
                  'Select Token'
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatAmount(payAmount)}</span>
              <span>
                Balance: {fromTokenBalance} {fromToken?.symbol}
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleSwapTokens}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-1">Buy</label>
            <div className="flex items-center justify-between">
              {isCalculating ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-3xl font-bold">Calculating...</span>
                </div>
              ) : (
                <Input
                  type="text"
                  value={receiveAmount}
                  placeholder="0.0"
                  className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                  readOnly
                />
              )}
              <Button
                variant="outline"
                className="ml-2 rounded-full"
                onClick={() => {
                  setCurrentSelection('to');
                  setTokenSelectionOpen(true);
                }}
              >
                {toToken ? (
                  <>
                    <img src={toToken.icon} alt={toToken.symbol} className="w-5 h-5 mr-2" />
                    {toToken.symbol}
                  </>
                ) : (
                  'Select Token'
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatAmount(receiveAmount)}</span>
              <span>
                Balance: {toTokenBalance} {toToken?.symbol}
              </span>
            </div>
          </div>
        </div>
        <Button className="w-full mt-4 bg-blue-500 text-white" disabled={!payAmount}>
          {payAmount ? 'Swap' : 'Enter Amount'}
        </Button>
      </div>
      <TokenSelectionModal
        isOpen={isTokenSelectionOpen}
        onClose={() => setTokenSelectionOpen(false)}
        onSelectToken={handleSelectToken}
        selectionType={currentSelection}
      />
    </main>
  );
}
