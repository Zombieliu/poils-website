"use client"

import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@repo/ui/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { RefreshCw, MoreHorizontal, Send, Coins, Flame } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table"
import { Skeleton } from "@repo/ui/components/ui/skeleton"
import { DevInspectResults,Transaction, TransactionArgument } from "@0xobelisk/sui-client"
import { init_obelisk_client, obelisk_client } from "../jotai/obelisk"
import { useAtom } from "jotai"
import { toast } from "sonner"
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { useEffect, useState, useCallback } from "react"
import { useCurrentWallet } from "@mysten/dapp-kit"
import { useRouter } from 'next/navigation'
import { ASSETS_ID, WRAPPER_ID } from "../chain/config"
import {useCurrentAccount } from '@mysten/dapp-kit';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@repo/ui/components/ui/dialog"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { AssetsMetadata } from "../jotai/swap/swap"

const tokenData = [
  { name: "Obelisk (OBL)", balance: 0.5, value: 15000, icon: "https://hop.ag/tokens/SUI.svg" },
  { name: "Poils (POL)", balance: 5, value: 10000, icon: "https://hop.ag/tokens/SUI.svg" },
  { name: "Dubei (DUB)", balance: 1000, value: 500, icon: "https://hop.ag/tokens/SUI.svg" },
  { name: "Cyferio (CYF)", balance: 100, value: 2000, icon: "https://hop.ag/tokens/SUI.svg" },
]

const LoadingAnimation = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-10 w-[200px]" />
    <Skeleton className="h-4 w-[300px]" />
    <Skeleton className="h-20 w-full" />
  </div>
)

export default function Assets() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const [digest, setDigest] = useState("")
  const { currentWallet } = useCurrentWallet()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const account = useCurrentAccount();
  const [assetMetadata, setAssetMetadata] = useAtom(AssetsMetadata)
  const [totalValue, setTotalValue] = useState("N/A");
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const refreshData = useCallback(() => {
    setIsRefreshing(true)
    query_assets().finally(() => {
      setIsRefreshing(false)
    })
  }, [])

  const query_assets = async () => {
    if (!account?.address) {
      console.log("Account address not available yet");
      return;
    }

    const obelisk = await init_obelisk_client()
    let tx = new Transaction();
    const assets = tx.object(ASSETS_ID)
    const owner = tx.pure.address(account?.address)
    let params: TransactionArgument[] = [
      assets,
      owner
    ];
    let query_own_assets_id_list = await obelisk.query.assets_system.owned_assets(tx, params) as DevInspectResults
    let owner_asset_id_list = obelisk.view(query_own_assets_id_list)[0];  
    console.log("owner_asset_id_list", owner_asset_id_list)

    // Fetch metadata and balance for each asset
    const assetPromises = owner_asset_id_list.map(async (assetId: number) => {
      // Create a new Transaction for metadata query
      let tx2 = new Transaction();
      let assets = tx2.object(ASSETS_ID)
      let asset_id = tx2.pure.u32(assetId)
      
      // Fetch metadata
      let metadataParams: TransactionArgument[] = [
        assets,
        asset_id
      ];
      let asset_metadata = await obelisk.query.assets_system.metadata_of(tx2, metadataParams) as DevInspectResults;
      
      // Create a new Transaction for balance query
      let tx3 = new Transaction();
      let assets3 = tx3.object(ASSETS_ID)
      let asset_id3 = tx3.pure.u32(assetId)
      
      // Fetch balance
      let balanceParams: TransactionArgument[] = [
        assets3,
        asset_id3,
        tx3.pure.address(account?.address)
      ];
      let balance_query = await obelisk.query.assets_system.balance_of(tx3, balanceParams) as DevInspectResults;
      
      return {
        id: assetId,
        metadata: obelisk.view(asset_metadata),
        balance: obelisk.view(balance_query)
      };
    });
    const assetResults = await Promise.all(assetPromises);

    setAssetMetadata(assetResults);
    console.log("Asset data:", assetResults);
  }

  useEffect(() => {
    if (!currentWallet) {
      router.push('/')
      return;
    }

    query_assets()
  }, [currentWallet, router, account])

  const handleActionClick = (action: string, assetId: number) => {
    setSelectedAction(action)
    setSelectedAssetId(assetId)
    setActionDialogOpen(true)
  }

  const handleActionConfirm = async () => {
    if (!selectedAction || selectedAssetId === null) return

    switch (selectedAction) {
      case "transfer":
        await handleTransfer(selectedAssetId, recipientAddress, BigInt(parseFloat(quantity) * Math.pow(10, assetMetadata.find(a => a.id === selectedAssetId)?.metadata[3] || 0)))
        break
      case "transferAll":
        await handleTransferAll(selectedAssetId, recipientAddress)
        break
      case "mint":
        await handleMint(selectedAssetId, recipientAddress, BigInt(parseFloat(quantity) * Math.pow(10, assetMetadata.find(a => a.id === selectedAssetId)?.metadata[3] || 0)))
        break
      case "burn":
        await handleBurn(selectedAssetId, recipientAddress, BigInt(parseFloat(quantity) * Math.pow(10, assetMetadata.find(a => a.id === selectedAssetId)?.metadata[3] || 0)))
        break
    }

    setActionDialogOpen(false)
    setQuantity("")
    setRecipientAddress("")
  }

  const handleTransfer = useCallback(async (assetId: number, to: string, amount: bigint) => {
    console.log("Transfer clicked");
    const obelisk = await init_obelisk_client()
    let tx = new Transaction();
    const assets = tx.object(ASSETS_ID);
    const assets_id = tx.pure.u32(assetId);
    const toAddress = tx.pure.address(to);
    const transferAmount = tx.pure.u64(amount);
    let params: TransactionArgument[] = [
       assets,
       assets_id,
       toAddress,
       transferAmount
      ];
    await obelisk.tx.assets_system.transfer(tx, params, undefined, true);
    await signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
        chain: `sui:testnet`,
      },
      {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          toast("Transfer Successful", {
            description: new Date().toUTCString(),
            action: {
              label: "Check in Explorer",
              onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, "_blank"),
            },
          });
          setDigest(result.digest);
          refreshData();
        },
        onError: error => {
          console.log('executed transaction', error);
        },
      },
    );
  }, [signAndExecuteTransaction, setDigest, refreshData])

  const handleTransferAll = useCallback(async (assetId: number, to: string) => {
    console.log("TransferAll clicked");
    const obelisk = await init_obelisk_client()
    let tx = new Transaction();
    const assets = tx.object(ASSETS_ID);
    const assets_id = tx.pure.u32(assetId);
    const toAddress = tx.pure.address(to);
    let params: TransactionArgument[] = [
       assets,
       assets_id,
       toAddress,
      ];
    await obelisk.tx.assets_system.transfer_all(tx, params, undefined, true);
    await signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
        chain: `sui:testnet`,
      },
      {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          toast("Translation Successful", {
            description: new Date().toUTCString(),
            action: {
              label: "Check in Explorer",
              onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, "_blank"),
            },
          });
          setDigest(result.digest);
          refreshData();
        },
        onError: error => {
          console.log('executed transaction', error);
        },
      },
    );
  }, [signAndExecuteTransaction, setDigest, refreshData])

  const handleMint = useCallback(async (assetId: number, to: string, amount: bigint) => {
    console.log("Mint clicked");
    const obelisk = await init_obelisk_client()
    let tx = new Transaction();
    const assets = tx.object(ASSETS_ID);
    const assets_id = tx.pure.u32(assetId);
    const toAddress = tx.pure.address(to);
    const mintAmount = tx.pure.u64(amount);
    let params: TransactionArgument[] = [
       assets,
       assets_id,
       toAddress,
       mintAmount
      ];
    await obelisk.tx.assets_system.mint(tx, params, undefined, true);
    await signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
        chain: `sui:testnet`,
      },
      {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          toast("Translation Successful", {
            description: new Date().toUTCString(),
            action: {
              label: "Check in Explorer",
              onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, "_blank"),
            },
          });
          setDigest(result.digest);
          refreshData();
        },
        onError: error => {
          console.log('executed transaction', error);
        },
      },
    );
  }, [signAndExecuteTransaction, setDigest, refreshData])

  const handleBurn = useCallback(async (assetId: number, who: string, amount: bigint) => {
    console.log("Burn clicked");
    const obelisk = await init_obelisk_client()
    let tx = new Transaction();
    const assets = tx.object(ASSETS_ID);
    const assets_id = tx.pure.u32(assetId);
    const whoAddress = tx.pure.address(who);
    const burnAmount = tx.pure.u64(amount);
    let params: TransactionArgument[] = [
       assets,
       assets_id,
       whoAddress,
       burnAmount
      ];
    await obelisk.tx.assets_system.transfer_all(tx, params, undefined, true);
    await signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
        chain: `sui:testnet`,
      },
      {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          toast("Translation Successful", {
            description: new Date().toUTCString(),
            action: {
              label: "Check in Explorer",
              onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, "_blank"),
            },
          });
          setDigest(result.digest);
          refreshData();
        },
        onError: error => {
          console.log('executed transaction', error);
        },
      },
    );
  }, [signAndExecuteTransaction, setDigest, refreshData])

  if (!currentWallet) {
    return null
  }

  return (
    <SheetContent className="w-[400px] sm:w-[540px] bg-pink-50">
      <SheetHeader>
        <SheetTitle>Crypto Portfolio</SheetTitle>
        <SheetDescription>Your current poils'token holdings</SheetDescription>
      </SheetHeader>
      {isLoading || isRefreshing ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="py-4">
            <h2 className="text-lg font-semibold">Value</h2>
            <p className="text-4xl font-bold">${totalValue}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Details</h3>
              <Button variant="ghost" size="sm" onClick={refreshData} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token Name</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Value (USD)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetMetadata.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <img 
                          src={asset.metadata[4] || "/default-icon.png"} 
                          alt={asset.metadata[0] || `Asset ${asset.id}`} 
                          className="w-6 h-6 mr-2" 
                        />
                        {asset.metadata[0] || `Asset ${asset.id}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {(Number(asset.balance[0]) / Math.pow(10, asset.metadata[3])).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">$N/A</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleActionClick("transfer", asset.id)}>
                            <Send className="mr-2 h-4 w-4" />
                            <span>Transfer</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick("transferAll", asset.id)}>
                            <Send className="mr-2 h-4 w-4" />
                            <span>Transfer All</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleActionClick("mint", asset.id)}>
                            <Coins className="mr-2 h-4 w-4" />
                            <span>Mint</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick("burn", asset.id)}>
                            <Flame className="mr-2 h-4 w-4" />
                            <span>Burn</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {selectedAction === "transferAll"
                ? "Please enter the recipient address for the transfer all action."
                : "Please enter the quantity and recipient address for the selected action."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedAction !== "transferAll" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipientAddress" className="text-right">
                Recipient Address
              </Label>
              <Input
                id="recipientAddress"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleActionConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SheetContent>
  )
}