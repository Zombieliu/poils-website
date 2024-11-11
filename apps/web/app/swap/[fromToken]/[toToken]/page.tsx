'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' instead of 'next/router';
import { useAtom } from 'jotai';
import { AssetsMetadata, TokenSelectionOpen } from '@/app/jotai/swap/swap';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { ChevronDown, ArrowUpDown, Loader2 } from 'lucide-react';
import TokenSelectionModal from '@/app/components/swap/token-selection-modal';
import { Transaction, TransactionArgument, DevInspectResults } from '@0xobelisk/sui-client';
import { ASSETS_ID, DEX_ID } from '@/app/chain/config';
import debounce from 'lodash/debounce';
import { initMerakClient } from '@/app/jotai/merak';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { fromTokenAtom, toTokenAtom, type Token } from '@/app/jotai/swap/tokens';

// Add this utility function at the top of your file or in a separate utils file
const formatBalance = (balance: string, decimals: number): string => {
  const balanceNum = parseFloat(balance);
  if (isNaN(balanceNum)) return '0.0000';
  console.log('balanceNum', balanceNum);
  console.log('decimals', decimals);
  return (balanceNum / 10 ** decimals).toFixed(4);
  // balance = 1000000000;
  // (decimals = 9), 1;
  // (decimals = 8), 10;
  // (decimals = 7), 100;
  // (decimals = 6), 1000;
  // (decimals = 5), 10000;
  // (decimals = 4), 100000;
  // (decimals = 3), 1000000;
  // (decimals = 2), 10000000;
  // (decimals = 1), 100000000;
  // (decimals = 0), 1000000000;
};

export default function SwapPage({ params }: { params: { fromToken: string; toToken: string } }) {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [isTokenSelectionOpen, setTokenSelectionOpen] = useAtom(TokenSelectionOpen);
  const router = useRouter();
  const [assetMetadata] = useAtom(AssetsMetadata);
  const [filteredAssets, setFilteredAssets] = useState(assetMetadata);

  // 明确指定 useAtom 的类型
  const [fromToken, setFromToken] = useAtom<Token | null>(fromTokenAtom);
  const [toToken, setToToken] = useAtom<Token | null>(toTokenAtom);

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

  const filterTokens = useCallback(
    (term: string) => {
      setIsLoading(true);
      const lowercasedTerm = term.toLowerCase();
      const filtered = assetMetadata.filter((asset) =>
        ['name', 'symbol', 'type', 'decimals', 'icon'].some((field, index) =>
          asset.metadata[index].toLowerCase().includes(lowercasedTerm)
        )
      );
      setFilteredAssets(filtered);
      setIsLoading(false);
    },
    [assetMetadata]
  );

  const handleQueryPath = async () => {
    if (!fromToken?.id || !toToken?.id) {
      console.log('Tokens not ready yet');
      return;
    }

    let merak = initMerakClient();
    console.log('查询路径:', fromToken.id, toToken.id);
    let pool_paths = await merak.querySwapPaths(fromToken.id, toToken.id);
    console.log('pool_paths', pool_paths[0]);
  };

  // Token 准备状态
  const [tokensState, setTokensState] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: true,
    error: null
  });

  // 初始化 Tokens
  useEffect(() => {
    const initializeTokens = async () => {
      setTokensState({ loading: true, error: null });
      try {
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
          const tokenData: Token = {
            id: fromTokenInfo.id,
            name: fromTokenInfo.metadata[0],
            symbol: fromTokenInfo.metadata[1],
            description: fromTokenInfo.metadata[2],
            decimals: decimals,
            icon: fromTokenInfo.metadata[4],
            balance: formattedBalance
          };
          setFromToken(tokenData);
          setFromTokenBalance(formattedBalance);
        }

        if (toTokenInfo) {
          const decimals = parseInt(toTokenInfo.metadata[3], 10);
          const formattedBalance = formatBalance(toTokenInfo.balance?.[0] || '0', decimals);
          const toTokenData: Token = {
            id: toTokenInfo.id as number,
            name: toTokenInfo.metadata[0] as string,
            symbol: toTokenInfo.metadata[1] as string,
            description: toTokenInfo.metadata[2] as string,
            decimals: decimals,
            icon: toTokenInfo.metadata[4] as string,
            balance: formattedBalance
          };
          setToToken(toTokenData);
          setToTokenBalance(formattedBalance);
        }

        setTokensState({ loading: false, error: null });
      } catch (error) {
        setTokensState({
          loading: false,
          error: error instanceof Error ? error.message : '初始化代币失败'
        });
      }
    };

    initializeTokens();
  }, [params.fromToken, params.toToken, filteredAssets]);

  // Token 选择处理
  const handleSelectToken = useCallback(
    (token: Token) => {
      if (currentSelection === 'from') {
        setFromToken(token);
        router.push(`/swap/${token.symbol}/${toToken?.symbol || params.toToken}`);
      } else {
        setToToken(token);
        router.push(`/swap/${fromToken?.symbol || params.fromToken}/${token.symbol}`);
      }
      setTokenSelectionOpen(false);
    },
    [currentSelection, toToken?.symbol, fromToken?.symbol, params.fromToken, params.toToken]
  );

  // Token 交换处理
  const handleChangeTokens = useCallback(() => {
    if (fromToken && toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
      router.push(`/swap/${toToken.symbol}/${fromToken.symbol}`);
    }
  }, [fromToken, toToken]);

  // 获取输出金额
  const getAmountOut = useCallback(
    async (amount: string) => {
      if (!fromToken?.id || !toToken?.id) {
        throw new Error('请先选择代币');
      }

      if (!fromToken.decimals) {
        throw new Error('代币小数位数未定义');
      }

      try {
        const merak = initMerakClient();
        const paths = await merak.querySwapPaths(fromToken.id, toToken.id);
        if (!paths?.length) {
          throw new Error('未找到有效的交换路径');
        }

        const amountWithDecimals = parseFloat(amount) * 10 ** fromToken.decimals;
        return await merak.getAmountOut(paths[0], amountWithDecimals);
      } catch (error) {
        console.error('getAmountOut error:', error);
        throw error;
      }
    },
    [fromToken, toToken]
  );

  // 计算接收金额
  const calculateReceiveAmount = useCallback(
    debounce(async (amount: string) => {
      if (!amount || isNaN(parseFloat(amount))) {
        setReceiveAmount('');
        setDollarValuePay(null);
        setDollarValueReceive(null);
        return;
      }

      setIsCalculating(true);
      try {
        const amountOutResult = await getAmountOut(amount);
        if (!amountOutResult || !toToken?.decimals) {
          throw new Error('计算结果无效');
        }

        const amountOut = BigInt(amountOutResult[0]);
        const calculatedReceiveAmount = (Number(amountOut) / 10 ** toToken.decimals).toFixed(9);

        setReceiveAmount(calculatedReceiveAmount);
        setDollarValuePay(`$${(parseFloat(amount) * 1).toFixed(2)}`);
        setDollarValueReceive(`$${(parseFloat(calculatedReceiveAmount) * 1).toFixed(2)}`);
      } catch (error) {
        console.error('计算输出金额错误:', error);
        toast.error(error instanceof Error ? error.message : '计算失败');
        setReceiveAmount('');
        setDollarValuePay(null);
        setDollarValueReceive(null);
      } finally {
        setIsCalculating(false);
      }
    }, 500),
    [fromToken, toToken]
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

  const handleSwapTokens = async () => {
    console.log('handleSwapTokens 123123');
    const merak = initMerakClient();
    const tx = new Transaction();
    const path = (await merak.querySwapPaths(fromToken?.id, toToken?.id))[0];
    console.log('path', path);
    console.log(path, parseFloat(payAmount) * fromToken?.decimals, 0, account?.address);
    await merak.swapExactTokensForTokens(
      tx,
      path,
      parseFloat(payAmount) * 10 ** fromToken?.decimals,
      0,
      account?.address,
      true
    );
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
        },
        onError: (error) => {
          console.log('executed transaction', error);
        }
      }
    );
  };

  const [isTokensReady, setIsTokensReady] = useState(false);

  useEffect(() => {
    if (fromToken?.id && toToken?.id) {
      setIsTokensReady(true);
    } else {
      setIsTokensReady(false);
    }
  }, [fromToken, toToken]);

  // Loading 状态展示
  if (tokensState.loading) {
    return <div>Loading tokens...</div>;
  }

  // Error 状态展示
  if (tokensState.error) {
    return <div>Error: {tokensState.error}</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <main className="flex flex-col items-center justify-center min-h-screen  p-4">
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
                onClick={handleChangeTokens}
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
          <Button
            className="w-full mt-4 bg-blue-500 text-white"
            disabled={!payAmount}
            onClick={() => handleSwapTokens()}
          >
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
    </div>
  );
}
