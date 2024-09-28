"use client"

import { useState } from "react"
import { Card } from "@repo/ui/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table"
import { Button } from "@repo/ui/components/ui/button"
import { RefreshCw, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { isValidSuiAddress, Transaction, TransactionArgument } from "@0xobelisk/sui-client"
import { toast } from "sonner";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { useAtom } from "jotai"
import { obelisk_client } from "../jotai/obelisk"


const getTokenImage = () => {
  return `https://hop.ag/tokens/SUI.svg`
}

const assets = [
  { id: 1, name: 'Obelisk', symbol: 'OBL', balance: 0.5, value: 15000 },
  { id: 2, name: 'Poils', symbol: 'POL', balance: 5, value: 10000 },
  { id: 3, name: 'Dubei', symbol: 'DUB', balance: 1000, value: 500 },
  { id: 4, name: 'Cyferio', symbol: 'CYF', balance: 100, value: 2000 },
]

export default function AssetViewer() {
  const [selectedAsset, setSelectedAsset] = useState(null)
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [obelisk] = useAtom(obelisk_client)
  const [digest, setDigest] = useState("");
  const [recipientError, setRecipientError] = useState("")

  const handleTransfer = async (amount, recipient) => {
    if (!isValidSuiAddress(recipient)) {
      setRecipientError("Invalid Sui address")
      return
    }
    setRecipientError("")
    console.log(`Transferring ${amount} ${selectedAsset.symbol} to ${recipient}`)
    // Here you would implement the actual transfer logic
    let tx = new Transaction();
    const assets = tx.object("0x2053056ef3a671cbbd3b4ada375aa0fb7543ba4dc7806799988bff7c3bdb28df")
    const asset_id = tx.pure.u32(selectedAsset.id)
    const to = tx.pure.address(recipient)
    const token_amount = tx.pure.u64(amount)
    
    let params: TransactionArgument[] = [
       assets,
       asset_id,
       to,
       token_amount,
      ];

    console.log(selectedAsset.id);
    
    // await obelisk.tx.assets_system.transfer(tx, params, undefined, true);
    // await signAndExecuteTransaction(
    //   {
    //     transaction: tx.serialize(),
    //     chain: `sui:testnet`,
    //   },
    //   {
    //     onSuccess: (result) => {
    //       console.log('executed transaction', result);
    //       toast("Translation Successful", {
    //         description: new Date().toUTCString(),
    //         action: {
    //           label: "Check in Explorer",
    //           onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, "_blank"),
    //         },
    //       });
    //       setDigest(result.digest);
    //     },
    //     onError: error => {
    //       console.log('executed transaction', error);
    //     },
    //   },
    // );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Value</h2>
          <p className="text-4xl font-bold">${totalValue.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Details</h2>
            <Button variant="outline" size="sm" className="text-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token Name</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Value (USD)</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <img src={getTokenImage()} alt={asset.symbol} className="w-6 h-6 mr-2" />
                      {asset.name} ({asset.symbol})
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{asset.balance}</TableCell>
                  <TableCell className="text-right">${asset.value.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          Transfer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Transfer {asset.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          const amount = e.target.amount.value
                          const recipient = e.target.recipient.value
                          handleTransfer(amount, recipient)
                        }}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amount" className="text-right">
                                Amount
                              </Label>
                              <Input
                                id="amount"
                                type="number"
                                className="col-span-3"
                                max={asset.balance}
                                step="0.000001"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="recipient" className="text-right">
                                Recipient
                              </Label>
                              <div className="col-span-3">
                                <Input
                                  id="recipient"
                                  className={recipientError ? "border-red-500" : ""}
                                  required
                                  onChange={(e) => {
                                    if (isValidSuiAddress(e.target.value)) {
                                      setRecipientError("")
                                    }
                                  }}
                                />
                                {recipientError && (
                                  <p className="text-red-500 text-sm mt-1">{recipientError}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">
                              Transfer <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}