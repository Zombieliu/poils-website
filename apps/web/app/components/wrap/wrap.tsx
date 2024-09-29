'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from "@repo/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { Switch } from "@repo/ui/components/ui/switch"
import { useAtom } from 'jotai'
import { obelisk_client } from '../../jotai/obelisk'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { DevInspectResults, Transaction, TransactionArgument } from '@0xobelisk/sui-client'
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { toast } from "sonner";

// Token logo components
const EthLogo = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
        <path d="M16.498 4L9 16.22l7.498-3.35z"/>
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/>
        <path d="M16.498 27.995v-6.028L9 17.616z"/>
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/>
      </g>
    </g>
  </svg>
)

const UsdtLogo = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
      <path fill="#FFF" d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"/>
    </g>
  </svg>
)

const DaiLogo = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#F4B731"/>
      <path d="M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z" fill="#FFF"/>
    </g>
  </svg>
)

export default function TokenWrapper() {
  const account = useCurrentAccount();
  const [isWrap, setIsWrap] = useState(true)
  const [sourceToken, setSourceToken] = useState("")
  const [targetToken, setTargetToken] = useState("")
  const [amount, setAmount] = useState("")
  const [obelisk] = useAtom(obelisk_client)
  const [coins, setCoins] = useState({ data: [] });
  const [coins_metadata, setCoinsMetadata] = useState([]);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState("");

  useEffect(() => {
    const getCoins = async () => {
      try {
        const coinsData = await obelisk.suiInteractor.currentClient.getCoins({
          owner: account?.address,
        });
        console.log("Fetched coins data:", coinsData);
        setCoins(coinsData);

        const uniqueCoinTypes = [...new Set(coinsData.data.map(coin => coin.coinType))];
        const metadataPromises = uniqueCoinTypes.map(coinType => 
          obelisk.suiInteractor.currentClient.getCoinMetadata({ coinType })
        );
        const metadataResults = await Promise.all(metadataPromises);
        console.log("Fetched metadata:", metadataResults);
        setCoinsMetadata(metadataResults);
      } catch (error) {
        console.error("Error fetching coins data:", error);
        toast.error("Failed to fetch coins data");
      }
    }

    if (account?.address) {
      getCoins();
    }
  }, [account?.address]);

  const internalTokens = [
    { value: "PETH", label: "PETH", logo: <EthLogo /> },
    { value: "PUSDT", label: "PUSDT", logo: <UsdtLogo /> },
    { value: "PDAI", label: "PDAI", logo: <DaiLogo /> },
  ]

  // Updated sourceTokens calculation
  const sourceTokens = useMemo(() => {
    const tokenMap = new Map();

    coins.data.forEach((coin) => {
      const metadata = coins_metadata.find(m => m.id === coin.coinType);
      const symbol = metadata?.symbol || coin.coinType.split('::').pop() || 'Unknown';
      
      if (!tokenMap.has(symbol) || BigInt(coin.balance) > BigInt(tokenMap.get(symbol)?.rawBalance || 0)) {
        let iconUrl = metadata?.iconUrl || 'default-icon-url.svg';
        if (symbol === 'SUI') {
          iconUrl = 'https://hop.ag/tokens/SUI.svg';
        }

        const balance = Number(coin.balance) / Math.pow(10, metadata?.decimals || 9);

        tokenMap.set(symbol, {
          value: coin.coinType,
          symbol: symbol,
          balance: balance.toFixed(4), // Limit to 4 decimal places
          logo: <img src={iconUrl} alt={symbol} width="20" height="20" style={{marginRight: '8px'}} />,
          rawBalance: coin.balance
        });
      }
    });

    return Array.from(tokenMap.values());
  }, [coins.data, coins_metadata]);

  // Swap tokens when isWrap changes
  useEffect(() => {
    setSourceToken("");
    setTargetToken("");
  }, [isWrap]);

  const handleWrapToggle = (checked: boolean) => {
    setIsWrap(checked);
  };

  // Determine which tokens to use for source and target based on isWrap
  const currentSourceTokens = isWrap ? sourceTokens : internalTokens;
  const currentTargetTokens = isWrap ? internalTokens : sourceTokens;

  const handleWrap = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("wrap");
    
    // 确保 amount 是一个有效的数字
    const amountToSplit = parseInt(amount);
    if (isNaN(amountToSplit) || amountToSplit <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid positive number.",
      });
      return;
    }

    // 确保用户选择了 Source Token
    if (!sourceToken) {
      toast.error("Source Token not selected", {
        description: "Please select a source token.",
      });
      return;
    }

    try {
      let tx = new Transaction();
      
      // 从 coins 数组中找到用户选择的 coin
      const selectedCoin = coins.data.find(coin => 
        coin.coinType.toLowerCase() === sourceToken.toLowerCase()
      );

      if (!selectedCoin) {
        console.log("All available coins:", coins.data.map(c => c.coinType));
        toast.error("Selected coin not found", {
          description: `Unable to find the selected ${sourceToken} coin.`,
        });
        return;
      }

      // 检查选择的 coin 是否有足够的余额
      if (BigInt(selectedCoin.balance) < BigInt(amountToSplit)) {
        toast.error("Insufficient balance", {
          description: `You don't have enough balance in the selected ${sourceToken} coin.`,
        });
        return;
      }

      // 拆分选定的 coin
      const [coin] = tx.splitCoins(selectedCoin.coinObjectId, [amountToSplit]);
      
      tx.transferObjects([coin], '0xbb3e90c52cb585aeb926edb6fb3d01146d47e96d9692394bd9d691ce1b0bd693');
      
      const result = await signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
          chain: `sui:testnet`,
        },
        {
          onSuccess: (result) => {
            console.log('executed transaction', result);
            toast.success("Transaction Successful", {
              description: `Wrapped ${amountToSplit} ${sourceToken} tokens at ${new Date().toUTCString()}`,
              action: {
                label: "Check in Explorer",
                onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, "_blank"),
              },
            });
            setDigest(result.digest);
          },
        },
      );
    } catch (error) {
      console.error('Error executing transaction:', error);
      toast.error("Transaction Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
              <Label htmlFor="wrap-switch">
                {isWrap ? "Wrap" : "Unwrap"}
              </Label>
              <Switch
                id="wrap-switch"
                checked={isWrap}
                onCheckedChange={handleWrapToggle}
              />
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
                        <span>{token.symbol} ({token.balance} {token.symbol})</span>
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
                        <span>{isWrap ? token.symbol : `${token.symbol} (${token.balance} ${token.symbol})`}</span>
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
            <Button type="button" onClick={handleWrap} className="w-full bg-blue-600 hover:bg-blue-700">
              {isWrap ? 'Wrap' : 'Unwrap'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}