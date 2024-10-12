'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@repo/ui/components/ui/select';
import { Switch } from '@repo/ui/components/ui/switch';
import { useAtom } from 'jotai';
import { initObeliskClient } from '@/app/jotai/obelisk';
import { initPoilsClient } from '@/app/jotai/poils';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  CoinBalance,
  CoinMetadata,
  DevInspectResults,
  Transaction,
  TransactionArgument
} from '@0xobelisk/sui-client';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import { ASSETS_ID, WRAPPER_ID } from '@/app/chain/config';
import { CoinStruct } from '@0xobelisk/sui-client';

export default function TokenWrapper() {
  const account = useCurrentAccount();
  const [isWrap, setIsWrap] = useState(true);
  const [sourceToken, setSourceToken] = useState('');
  const [targetToken, setTargetToken] = useState('');
  const [amount, setAmount] = useState('');
  // const [coinsMetadata, setCoinsMetadata] = useState([]);
  const [balances, setBalances] = useState([]);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState('');
  const [assetMetadata, setAssetMetadata] = useState<any[]>([]);

  useEffect(() => {
    const getCoins = async () => {
      try {
        const obelisk = initObeliskClient();

        const allBalances = await obelisk.suiInteractor.currentClient.getAllBalances({
          owner: account?.address
        });
        console.log('allBalances', allBalances);

        const updatedBalances = await Promise.all(
          allBalances.map(async (coinBalance) => {
            const metadata = await obelisk.suiInteractor.currentClient.getCoinMetadata({
              coinType: coinBalance.coinType
            });
            return { ...coinBalance, metadata };
          })
        );

        console.log('Updated balances with metadata:', updatedBalances);
        setBalances(updatedBalances);
        // setCoinsMetadata(updatedBalances.map((balance) => balance.metadata));
      } catch (error) {
        console.error('Error fetching coins data:', error);
        toast.error('Failed to fetch coins data');
      }
    };
    if (account?.address) {
      getCoins();
    }
  }, [account?.address]);

  useEffect(() => {
    const getWrapCoins = async () => {
      const poils = initPoilsClient();
      let wrap_token_list = (await poils.wrappedAssets())[0];
      console.log('=================');
      console.log(wrap_token_list);
      const assetPromises = wrap_token_list.map(async (assetId: number) => {
        let metadata = await poils.metadataOf(assetId);
        let balance = await poils.balanceOf(assetId, account?.address);

        console.log('assetId huifeng', assetId);
        console.log('balance huifeng', balance);

        return {
          id: assetId,
          metadata,
          balance
        };
      });
      const assetResults = await Promise.all(assetPromises);
      setAssetMetadata(assetResults);
      console.log('assetResults', assetResults);
    };
    getWrapCoins();
  }, []);

  // Updated sourceTokens calculation
  const sourceTokens = useMemo(() => {
    const tokenMap = new Map();

    const obelisk = initObeliskClient();

    balances.forEach(async (coinBalance: CoinBalance & { metadata: CoinMetadata }) => {
      const symbol =
        coinBalance.metadata.symbol || coinBalance.coinType.split('::').pop() || 'Unknown';

      if (
        !tokenMap.has(symbol) ||
        BigInt(coinBalance.totalBalance) > BigInt(tokenMap.get(symbol)?.rawBalance || 0)
      ) {
        let iconUrl = coinBalance.metadata?.iconUrl || 'default-icon-url.svg';
        if (symbol === 'SUI') {
          iconUrl = 'https://hop.ag/tokens/SUI.svg';
        }

        // Calculate balance using the correct number of decimal places
        const decimals = coinBalance.metadata.decimals || 9; // Use metadata[4] for decimals, default to 9 if not available
        const rawBalance = BigInt(coinBalance.totalBalance);
        const balance = Number(rawBalance) / Math.pow(10, decimals);

        tokenMap.set(symbol, {
          value: coinBalance.coinType,
          symbol: symbol,
          balance: balance.toFixed(4), // Format to 4 decimal places for display
          logo: (
            <img src={iconUrl} alt={symbol} width="20" height="20" style={{ marginRight: '8px' }} />
          ),
          rawBalance: coinBalance.totalBalance,
          decimals: decimals
        });
      }
    });

    return Array.from(tokenMap.values());
  }, [balances]);

  // Updated targetTokens calculation (for wrapping)
  const targetTokens = useMemo(() => {
    return assetMetadata.map((asset) => {
      console.log(`Processing asset:`, asset);

      const rawBalance = BigInt(asset.balance);
      console.log(`Raw balance:`, rawBalance.toString());

      const decimals = asset.metadata[3];
      console.log(`Decimals:`, decimals);

      const scaleFactor = BigInt(10 ** decimals);
      console.log(`Scale factor:`, scaleFactor.toString());

      const scaledBalance = rawBalance * BigInt(10000);
      console.log(`Scaled balance:`, scaledBalance.toString());

      const dividedBalance = scaledBalance / scaleFactor;
      console.log(`Divided balance:`, dividedBalance.toString());

      const finalBalance = Number(dividedBalance) / 10000;
      console.log(`Final balance:`, finalBalance);

      return {
        value: asset.id.toString(),
        symbol: asset.metadata[1],
        balance: finalBalance.toFixed(4),
        logo: (
          <img
            src={asset.metadata[4]}
            alt={asset.metadata[1]}
            width="20"
            height="20"
            style={{ marginRight: '8px' }}
          />
        )
      };
    });
  }, [assetMetadata]);

  console.log(`Final targetTokens:`, targetTokens);

  // Updated calculation for unwrapping source tokens (with balance)
  const unwrapSourceTokens = useMemo(() => {
    return assetMetadata.map((asset) => ({
      value: asset.id.toString(),
      symbol: asset.metadata[1],
      balance: (Number(BigInt(asset.balance)) / Math.pow(10, asset.metadata[3])).toFixed(4),
      logo: (
        <img
          src={asset.metadata[4]}
          alt={asset.metadata[1]}
          width="20"
          height="20"
          style={{ marginRight: '8px' }}
        />
      )
    }));
  }, [assetMetadata]);

  // Swap tokens when isWrap changes
  useEffect(() => {
    setSourceToken('');
    setTargetToken('');
  }, [isWrap]);

  const handleWrapToggle = (checked: boolean) => {
    setIsWrap(checked);
    // 清空选择，防止用户混淆
    setSourceToken('');
    setTargetToken('');
  };

  // Updated currentSourceTokens and currentTargetTokens
  const currentSourceTokens = useMemo(() => {
    return isWrap ? sourceTokens : unwrapSourceTokens;
  }, [isWrap, sourceTokens, unwrapSourceTokens]);

  const currentTargetTokens = useMemo(() => {
    if (isWrap) {
      return assetMetadata.map((asset) => ({
        value: asset.id.toString(),
        symbol: asset.metadata[1],
        balance: (Number(BigInt(asset.balance)) / Math.pow(10, asset.metadata[3])).toFixed(4),
        logo: (
          <img
            src={asset.metadata[4]}
            alt={asset.metadata[1]}
            width="20"
            height="20"
            style={{ marginRight: '8px' }}
          />
        )
      }));
    } else {
      return sourceTokens.map((token) => ({
        ...token,
        balance: token.balance // Use the original balance from sourceTokens
      }));
    }
  }, [isWrap, assetMetadata, sourceTokens]);

  useEffect(() => {
    if (isWrap) {
      setSourceToken(sourceTokens[0]?.value || '');
      setTargetToken(currentTargetTokens[0]?.value || '');
    } else {
      setSourceToken(currentSourceTokens[0]?.value || '');
      setTargetToken(currentTargetTokens[0]?.value || '');
    }
  }, [isWrap, sourceTokens, currentSourceTokens, currentTargetTokens]);

  const handleWrap = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('wrap');

    const obelisk = initObeliskClient();
    const poils = initPoilsClient();

    // Ensure amount is a valid number
    const amountToWrap = parseFloat(amount);
    if (isNaN(amountToWrap) || amountToWrap <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid positive number.'
      });
      return;
    }

    // Ensure source and target tokens are selected
    if (!sourceToken || !targetToken) {
      toast.error('Tokens not selected', {
        description: 'Please select both source and target tokens.'
      });
      return;
    }

    // Find the selected source and target tokens
    const selectedSourceToken = currentSourceTokens.find((token) => token.value === sourceToken);
    const selectedTargetToken = currentTargetTokens.find((token) => token.value === targetToken);

    if (!selectedSourceToken || !selectedTargetToken) {
      toast.error('Token selection error', {
        description: 'Unable to find the selected tokens.'
      });
      return;
    }
    // Check if the token names are consistent (ignoring the 'P' prefix for wrapped tokens)
    const sourceTokenName = selectedSourceToken.symbol.replace(/^P/, '');
    const targetTokenName = selectedTargetToken.symbol.replace(/^P/, '');

    if (sourceTokenName !== targetTokenName) {
      toast.error('Token mismatch', {
        description: 'Source and target tokens must be the same type for wrapping.'
      });
      return;
    }

    // Check if the user has sufficient balance
    if (parseFloat(selectedSourceToken.balance) < amountToWrap) {
      toast.error('Insufficient balance', {
        description: `You don't have enough balance in the selected ${selectedSourceToken.symbol} token.`
      });
      return;
    }

    try {
      // Implement the actual wrapping logic here
      // This is a placeholder for the actual implementation

      // console.log("sourceToken", sourceToken);
      // let tx = new Transaction();
      // const [coin] = tx.splitCoins(tx.gas,[100]);
      // console.log("coin", coin);

      // Calculate the amount based on the decimals in metadata
      const selectedAssetMetadata = await obelisk.suiInteractor.currentClient.getCoinMetadata({
        coinType: sourceToken
      });
      const decimals = selectedAssetMetadata.decimals;

      let tx = new Transaction();
      tx.setGasBudget(100000000);

      console.log('selectedSourceToken.value', selectedSourceToken.value);

      const amountInSmallestUnit = Math.floor(amountToWrap * 10 ** decimals);
      console.log('amountInSmallestUnit', amountInSmallestUnit);

      const selectCoins = await obelisk.selectCoinsWithAmount(
        amountInSmallestUnit,
        selectedSourceToken.value,
        // '0x2::sui::SUI',
        account?.address
      );
      console.log('account?.address', account?.address);
      console.log('amountToWrap', amountToWrap);
      const bidding_amount = tx.pure.u64(Math.floor(amountToWrap * 10 ** decimals));
      const [coin] = tx.splitCoins(tx.object(selectCoins[0]), [bidding_amount]);
      await poils.wrap(tx, coin, account?.address, sourceToken, true);

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
      // Reset the amount after successful wrap
      setAmount('');
    } catch (error) {
      console.error('Error executing transaction:', error);
      toast.error('Transaction Failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  const handleUnWrap = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // const obelisk =  initObeliskClient();
    const poils = initPoilsClient();

    const amountToUnwrap = parseFloat(amount);
    console.log('amountToUnwrap:', amountToUnwrap);

    if (isNaN(amountToUnwrap) || amountToUnwrap <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid positive number.'
      });
      return;
    }

    // Ensure source and target tokens are selected
    if (!sourceToken || !targetToken) {
      toast.error('Tokens not selected', {
        description: 'Please select both source and target tokens.'
      });
      return;
    }

    // Find the selected source and target tokens
    const selectedSourceToken = currentSourceTokens.find((token) => token.value === sourceToken);
    const selectedTargetToken = currentTargetTokens.find((token) => token.value === targetToken);

    if (!selectedSourceToken || !selectedTargetToken) {
      toast.error('Token selection error', {
        description: 'Unable to find the selected tokens.'
      });
      return;
    }

    // Check if the token names are consistent (ignoring the 'P' prefix for wrapped tokens)
    const sourceTokenName = selectedSourceToken.symbol.replace(/^P/, '');
    const targetTokenName = selectedTargetToken.symbol.replace(/^P/, '');

    if (sourceTokenName !== targetTokenName) {
      toast.error('Token mismatch', {
        description: 'Source and target tokens must be the same type for unwrapping.'
      });
      return;
    }

    // Check if the user has sufficient balance
    if (parseFloat(selectedSourceToken.balance) < amountToUnwrap) {
      toast.error('Insufficient balance', {
        description: `You don't have enough balance in the selected ${selectedSourceToken.symbol} token.`
      });
      return;
    }

    try {
      let tx = new Transaction();
      tx.setGasBudget(100000000);
      let wrapper = tx.object(WRAPPER_ID);
      let assets = tx.object(ASSETS_ID);

      // Ensure we have valid decimal information
      const decimals = selectedSourceToken.decimals || 9; // Default to 9 if no decimal information is available
      console.log('decimals:', decimals); // Debug log

      // Use BigInt to avoid precision issues
      const amountInSmallestUnit = BigInt(Math.floor(amountToUnwrap * 10 ** decimals));
      console.log('amountInSmallestUnit:', amountInSmallestUnit.toString()); // Debug log

      if (amountInSmallestUnit <= 0) {
        throw new Error('Invalid amount calculation');
      }

      await poils.unwrap(tx, amountInSmallestUnit, account?.address, targetToken, true);

      await signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
          chain: `sui:testnet`
        },
        {
          onSuccess: (result) => {
            console.log('executed transaction', result);
            toast('Unwrap Successful', {
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
            console.error('Error executing transaction:', error);
          }
        }
      );
      // Reset the amount after successful unwrap
      setAmount('');
    } catch (error) {
      console.error('Error executing transaction:', error);
      toast.error('Transaction Failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
      <Card className="w-[400px] border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Poils Token Exchange</CardTitle>
          <p className="text-sm text-gray-500">Wrap or unwrap tokens</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center justify-between">
              <Label htmlFor="wrap-switch">{isWrap ? 'Wrap' : 'Unwrap'}</Label>
              <Switch id="wrap-switch" checked={isWrap} onCheckedChange={handleWrapToggle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceToken">Source Token</Label>
              <Select onValueChange={(value) => setSourceToken(value)} value={sourceToken}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source token" />
                </SelectTrigger>
                <SelectContent>
                  {currentSourceTokens.map((token) => (
                    <SelectItem key={token.value} value={token.value}>
                      <div className="flex items-center">
                        {token.logo}
                        <span>
                          {isWrap ? token.symbol : `P${token.symbol}`} ({token.balance}{' '}
                          {isWrap ? token.symbol : `P${token.symbol}`})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetToken">Target Token</Label>
              <Select onValueChange={(value) => setTargetToken(value)} value={targetToken}>
                <SelectTrigger id="targetToken" className="w-full">
                  <SelectValue placeholder="Select target token" />
                </SelectTrigger>
                <SelectContent>
                  {currentTargetTokens.map((token) => (
                    <SelectItem key={token.value} value={token.value}>
                      <div className="flex items-center">
                        {token.logo}
                        <span>
                          {token.symbol} (
                          {parseFloat(token.balance).toLocaleString(undefined, {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4
                          })}{' '}
                          {token.symbol})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder={`Enter ${isWrap ? 'wrap' : 'unwrap'} amount`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button
              type="button"
              onClick={isWrap ? handleWrap : handleUnWrap}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isWrap ? 'Wrap' : 'Unwrap'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
