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
import { RefreshCw, MoreHorizontal } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table"
import { Skeleton } from "@repo/ui/components/ui/skeleton"
import { Transaction, TransactionArgument } from "@0xobelisk/sui-client"
import { obelisk_client } from "../jotai/obelisk"
import { useAtom } from "jotai"
import { toast } from "sonner"
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { useEffect, useState } from "react"
import { useCurrentWallet } from "@mysten/dapp-kit"
import { useRouter } from 'next/navigation'

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
  const [obelisk] = useAtom(obelisk_client)
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const [digest, setDigest] = useState("")
  const { currentWallet } = useCurrentWallet()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!currentWallet) {
      router.push('/')
    }
  }, [currentWallet, router])

  if (!currentWallet) {
    return null
  }

  const handleTransfer = async() => {
    console.log("Transfer clicked");
    let tx = new Transaction();
    const assets_object = tx.object("0x2053056ef3a671cbbd3b4ada375aa0fb7543ba4dc7806799988bff7c3bdb28df");
    const assets_id = tx.pure.u32(0);
    const to = tx.pure.address("0xbb3e90c52cb585aeb926edb6fb3d01146d47e96d9692394bd9d691ce1b0bd693");
    const amount = tx.pure.u64(1);
    let params: TransactionArgument[] = [
       assets_object,
       assets_id,
       to,
       amount
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
          toast("Translation Successful", {
            description: new Date().toUTCString(),
            action: {
              label: "Check in Explorer",
              onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, "_blank"),
            },
          });
          setDigest(result.digest);
        },
        onError: error => {
          console.log('executed transaction', error);
        },
      },
    );
  }

  const handleTransferAll = async() => {
    console.log("TransferAll clicked");
    let tx = new Transaction();
    const assets_object = tx.object("0x2053056ef3a671cbbd3b4ada375aa0fb7543ba4dc7806799988bff7c3bdb28df");
    const assets_id = tx.pure.u32(0);
    const to = tx.pure.address("0xbb3e90c52cb585aeb926edb6fb3d01146d47e96d9692394bd9d691ce1b0bd693");
    let params: TransactionArgument[] = [
       assets_object,
       assets_id,
       to,
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
        },
        onError: error => {
          console.log('executed transaction', error);
        },
      },
    );
  }

  const handleMint = async() => {
    console.log("Mint clicked");
    let tx = new Transaction();
    const assets_object = tx.object("0x2053056ef3a671cbbd3b4ada375aa0fb7543ba4dc7806799988bff7c3bdb28df");
    const assets_id = tx.pure.u32(0);
    const to = tx.pure.address("0xbb3e90c52cb585aeb926edb6fb3d01146d47e96d9692394bd9d691ce1b0bd693");
    const amount = tx.pure.u64(1);
    let params: TransactionArgument[] = [
       assets_object,
       assets_id,
       to,
       amount
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
        },
        onError: error => {
          console.log('executed transaction', error);
        },
      },
    );
  }
  
  const handleBurn = async() => {
    console.log("Burn clicked");
    let tx = new Transaction();
    const assets_object = tx.object("0x2053056ef3a671cbbd3b4ada375aa0fb7543ba4dc7806799988bff7c3bdb28df");
    const assets_id = tx.pure.u32(0);
    const who = tx.pure.address("0xbb3e90c52cb585aeb926edb6fb3d01146d47e96d9692394bd9d691ce1b0bd693");
    const amount = tx.pure.u64(1);
    let params: TransactionArgument[] = [
       assets_object,
       assets_id,
       who,
       amount
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
        },
        onError: error => {
          console.log('executed transaction', error);
        },
      },
    );
  }

  return (
    <SheetContent className="w-[400px] sm:w-[540px] bg-pink-50">
      <SheetHeader>
        <SheetTitle>Crypto Portfolio</SheetTitle>
        <SheetDescription>Your current poils'token holdings</SheetDescription>
      </SheetHeader>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="py-4">
            <h2 className="text-lg font-semibold">Value</h2>
            <p className="text-4xl font-bold">$27,500</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Details</h3>
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
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
                {tokenData.map((token) => (
                  <TableRow key={token.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <img src={token.icon} alt={token.name} className="w-6 h-6 mr-2" />
                        {token.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{token.balance}</TableCell>
                    <TableCell className="text-right">${token.value.toLocaleString()}</TableCell>
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
                          <DropdownMenuItem onClick={handleTransfer}>Transfer</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleTransferAll}>TransferAll</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleMint}>Mint</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleBurn}>Burn</DropdownMenuItem>
                          <DropdownMenuSeparator />
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
    </SheetContent>
  )
}