'use client'

import { useEffect, useState } from 'react'
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

  const [coins_metadata, setCoinsMetadata] = useState<any[]>([])

  useEffect(() => {
    const getCoins = async () => {
      const coins = await obelisk.suiInteractor.currentClient.getCoins(
        {
          owner: account?.address,
        }
      )
      let coins_metadata = []
      for (const coin of coins.data) {
        const coin_metadata = await obelisk.suiInteractor.currentClient.getCoinMetadata(
          {
            coinType: coin.coinType
          }
        )
        coins_metadata.push(coin_metadata)
      }
      let tx = new Transaction();
      let params: TransactionArgument[] = [
        tx.object("0xd1c4e6521b16bc8ec7b48c2fd26b75520abaa188094251dddf5c9735a7ac5597"),
      ];
      let query = (await obelisk.query.wrapper_schema.coins(
        tx,
        params
      )) as DevInspectResults;
      console.log(JSON.stringify(query.results![0]));
      // let formatData1 = obelisk.view(query);
      // console.log("formatData1", formatData1);
      setCoinsMetadata(coins_metadata)

  }

  
  getCoins()
  }, [account?.address])

  const internalTokens = [
    { value: "PETH", label: "PETH", logo: <EthLogo /> },
    { value: "PUSDT", label: "PUSDT", logo: <UsdtLogo /> },
    { value: "PDAI", label: "PDAI", logo: <DaiLogo /> },
  ]

  // Update the sourceTokens and targetTokens
  const sourceTokens = coins_metadata.map((coin) => ({
    value: coin.symbol,
    label: coin.name,
    logo: <img src={coin.iconUrl} alt={coin.name} width="20" height="20" />,
  }))

  const targetTokens = internalTokens

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
      <Card className="w-[400px] border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Poils Token Exchange</CardTitle>
          <p className="text-sm text-gray-500">Wrap or unwrap tokens</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="wrap-switch">
                {isWrap ? "Wrap" : "Unwrap"}
              </Label>
              <Switch
                id="wrap-switch"
                checked={isWrap}
                onCheckedChange={setIsWrap}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceToken">Source Token</Label>
              <Select value={sourceToken} onValueChange={setSourceToken}>
                <SelectTrigger id="sourceToken" className="w-full">
                  <SelectValue placeholder="Select source token" />
                </SelectTrigger>
                <SelectContent>
                  {sourceTokens.map((token) => (
                    <SelectItem key={token.value} value={token.value}>
                      <div className="flex items-center">
                        {token.logo}
                        <span className="ml-2">{token.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetToken">Target Token</Label>
              <Select value={targetToken} onValueChange={setTargetToken}>
                <SelectTrigger id="targetToken" className="w-full">
                  <SelectValue placeholder="Select target token" />
                </SelectTrigger>
                <SelectContent>
                  {targetTokens.map((token) => (
                    <SelectItem key={token.value} value={token.value}>
                      <div className="flex items-center">
                        {token.logo}
                        <span className="ml-2">{token.label}</span>
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
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {isWrap ? 'Wrap' : 'Unwrap'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}