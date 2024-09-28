"use client";

import { WsClient } from 'tsrpc-browser';
import { RefreshCw, User, X } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { Input } from "@repo/ui/components/ui/input"
import { Switch } from "@repo/ui/components/ui/switch"
import { Label } from "@repo/ui/components/ui/label"
import React, { useEffect, useState } from "react"
import { getClient } from '../protocols/getClient';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
// import { DevInspectResults, Transaction, TransactionArgument } from '@0xobelisk/sui-client';



export default function Page() {
  const [useOwnAddress, setUseOwnAddress] = useState(true)
  const [recipientAddress, setRecipientAddress] = useState("0x1234...5678") // Placeholder for user's wallet address
  const [customAddress, setCustomAddress] = useState("")
  const [input, setInput] = useState('');
  const [client] = useState(getClient());



  useEffect(() => {
    const connectClient = async () => {
      let resConnect = await client.connect();
      if (!resConnect.isSucc) {
        console.error('连接失败', resConnect.errMsg);
      }
      console.log("连接成功");
      console.log(resConnect.isSucc);
      
    };
    connectClient();
  }, [])
  
// Send input message
async function send() {
    // let ret = await client.callApi('Send', {
    //     content: input
    // });
    // // Error
    // if (!ret.isSucc) {
    //     alert(ret.err.message);
    //     return;
    // }
    // // Success
    // setInput('');
  // use getFullnodeUrl to define Devnet RPC location
  const rpcUrl = getFullnodeUrl('testnet');
  
  // create a client connected to devnet
  const client = new SuiClient({ url: rpcUrl });
  
  // get coins owned by an address
  // replace <OWNER_ADDRESS> with actual address in the form of 0x123...
  let Coins = await client.getCoins({
    owner: '0x0ca15e20d5041a0d395edfb741f247242c2482b071956a18b8e6ca479e63fb36',
  });
  console.log(Coins);
}

// Send input message
async function test() {
  // const obelisk = await init_obelisk_client();
  // let tx = new Transaction();
  // let params: TransactionArgument[] = [
  //   tx.object("0x2053056ef3a671cbbd3b4ada375aa0fb7543ba4dc7806799988bff7c3bdb28df"),
  //   tx.pure.u32(0),
  //   tx.pure.address("0x0ca15e20d5041a0d395edfb741f247242c2482b071956a18b8e6ca479e63fb36")
  // ];
  // let query1 = (await obelisk.query.assets_system.balance_of(
  //   tx,
  //   params
  // )) as DevInspectResults;
  // let formatData1 = obelisk.view(query1);

  // console.log(formatData1);
}


  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <main className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bridge Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">
                      <div className="flex items-center">
                        <img src="https://hop.ag/tokens/SUI.svg" alt="ETH logo" className="w-5 h-5 mr-2" />
                        Ethereum (ETH)
                      </div>
                    </SelectItem>
                    <SelectItem value="obl">
                      <div className="flex items-center">
                        <img src="https://hop.ag/tokens/SUI.svg" alt="OBL logo" className="w-5 h-5 mr-2" />
                        Obelisk (OBL)
                      </div>
                    </SelectItem>
                    <SelectItem value="pol">
                      <div className="flex items-center">
                        <img src="https://hop.ag/tokens/SUI.svg" alt="POL logo" className="w-5 h-5 mr-2" />
                        Polis (POL)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="0.00" className="w-[180px]" onChange={e => { setInput(e.target.value) }} />
              </div>
              <div className="flex justify-center">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">
                      <div className="flex items-center">
                        <img src="https://hop.ag/tokens/SUI.svg" alt="Ethereum logo" className="w-5 h-5 mr-2" />
                        Ethereum
                      </div>
                    </SelectItem>
                    <SelectItem value="polygon">
                      <div className="flex items-center">
                        <img src="https://hop.ag/tokens/SUI.svg" alt="Polygon logo" className="w-5 h-5 mr-2" />
                        Polygon
                      </div>
                    </SelectItem>
                    <SelectItem value="bsc">
                      <div className="flex items-center">
                        <img src="https://hop.ag/tokens/SUI.svg" alt="BSC logo" className="w-5 h-5 mr-2" />
                        Binance Smart Chain
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-own-address"
                      checked={useOwnAddress}
                      onCheckedChange={setUseOwnAddress}
                    />
                    <Label htmlFor="use-own-address">Use my address</Label>
                  </div>
                  {useOwnAddress ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      {recipientAddress}
                    </div>
                  ) : (
                    <div className="relative w-[180px]">
                      <Input
                        type="text"
                        placeholder="Enter recipient address"
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        className="pr-8"
                      />
                      {customAddress && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setCustomAddress("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Estimated Gas Fee</span>
                <span>0.005 ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Bridge Fee</span>
                <span>0.1%</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>You will receive</span>
                <span>0.00 OBL</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={test} className="w-full">Bridge Assets</Button>
      </main>
    </div>
  )
}