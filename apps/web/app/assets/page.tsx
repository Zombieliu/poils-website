'use client';

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@repo/ui/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@repo/ui/components/ui/dropdown-menu';
import { RefreshCw, MoreHorizontal, Send, Coins, Flame } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@repo/ui/components/ui/table';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { DevInspectResults, Transaction, TransactionArgument } from '@0xobelisk/sui-client';
import { initMerakClient, merakClient } from '@/app/jotai/merak';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useEffect, useState, useCallback } from 'react';
import { useCurrentWallet } from '@mysten/dapp-kit';
import { useRouter } from 'next/navigation';
import { ASSETS_ID, WRAPPER_ID } from '@/app/chain/config';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@repo/ui/components/ui/dialog';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { AssetsMetadata } from '@/app/jotai/swap/swap';

const tokenData = [
  { name: 'Dubhe (DUB)', balance: 0.5, value: 15000, icon: 'https://hop.ag/tokens/SUI.svg' },
  { name: 'Merak (POL)', balance: 5, value: 10000, icon: 'https://hop.ag/tokens/SUI.svg' },
  { name: 'Dubei (DUB)', balance: 1000, value: 500, icon: 'https://hop.ag/tokens/SUI.svg' },
  { name: 'Cyferio (CYF)', balance: 100, value: 2000, icon: 'https://hop.ag/tokens/SUI.svg' }
];

const LoadingAnimation = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-10 w-[200px]" />
    <Skeleton className="h-4 w-[300px]" />
    <Skeleton className="h-20 w-full" />
  </div>
);

export default function Assets() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState('');
  const { currentWallet } = useCurrentWallet();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const account = useCurrentAccount();
  const [assetMetadata, setAssetMetadata] = useAtom(AssetsMetadata);
  const [totalValue, setTotalValue] = useState('N/A');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    query_assets().finally(() => {
      setIsRefreshing(false);
    });
  }, []);

  const query_assets = async () => {
    if (!account?.address) {
      console.log('Account address not available yet');
      return;
    }
    console.log('account', account);

    try {
      const merak = initMerakClient();
      let owner_asset_id_list = (await merak.ownedAssets(account?.address))[0];
      console.log('owner_asset_id_list', owner_asset_id_list);

      // Fetch metadata and balance for each asset
      const assetPromises = owner_asset_id_list.map(async (assetId: number) => {
        // Fetch metadata
        let metadata = await merak.metadataOf(assetId);
        // Fetch balance
        let balance = await merak.balanceOf(assetId, account?.address);

        console.log('metadata', metadata);
        console.log('balance', balance);
        return {
          id: assetId,
          metadata,
          balance
        };
      });
      const assetResults = await Promise.all(assetPromises);

      setAssetMetadata(assetResults);
      console.log('Asset data:', assetResults);
    } catch (error) {
      console.error('Error querying assets:', error);
      toast.error('Failed to fetch assets. Please try again.');
    }
  };

  useEffect(() => {
    if (!currentWallet) {
      router.push('/');
      return;
    }

    if (account?.address) {
      query_assets();
    } else {
      console.log('Waiting for account address...');
    }
  }, [currentWallet, router, account]);

  const handleActionClick = (action: string, assetId: number) => {
    setSelectedAction(action);
    setSelectedAssetId(assetId);
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedAction || selectedAssetId === null) return;

    switch (selectedAction) {
      case 'transfer':
        await handleTransfer(
          selectedAssetId,
          recipientAddress,
          BigInt(
            parseFloat(quantity) *
              Math.pow(10, assetMetadata.find((a) => a.id === selectedAssetId)?.metadata[3] || 0)
          )
        );
        break;
      case 'transferAll':
        await handleTransferAll(selectedAssetId, recipientAddress);
        break;
      case 'mint':
        await handleMint(
          selectedAssetId,
          recipientAddress,
          BigInt(
            parseFloat(quantity) *
              Math.pow(10, assetMetadata.find((a) => a.id === selectedAssetId)?.metadata[3] || 0)
          )
        );
        break;
      case 'burn':
        await handleBurn(
          selectedAssetId,
          recipientAddress,
          BigInt(
            parseFloat(quantity) *
              Math.pow(10, assetMetadata.find((a) => a.id === selectedAssetId)?.metadata[3] || 0)
          )
        );
        break;
    }

    setActionDialogOpen(false);
    setQuantity('');
    setRecipientAddress('');
  };

  const handleTransfer = useCallback(
    async (assetId: number, to: string, amount: bigint) => {
      console.log('Transfer clicked');
      const merak = initMerakClient();
      let tx = new Transaction();
      await merak.transfer(tx, assetId, to, amount, true);
      await signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
          chain: `sui:testnet`
        },
        {
          onSuccess: (result) => {
            console.log('executed transaction', result);
            toast('Transfer Successful', {
              description: new Date().toUTCString(),
              action: {
                label: 'Check in Explorer',
                onClick: () =>
                  window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, '_blank')
              }
            });
            setDigest(result.digest);
            refreshData();
          },
          onError: (error) => {
            console.log('executed transaction', error);
          }
        }
      );
    },
    [signAndExecuteTransaction, setDigest, refreshData]
  );

  const handleTransferAll = useCallback(
    async (assetId: number, to: string) => {
      console.log('TransferAll clicked');
      const merak = initMerakClient();
      let tx = new Transaction();
      await merak.transferAll(tx, assetId, to, true);
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
            refreshData();
          },
          onError: (error) => {
            console.log('executed transaction', error);
          }
        }
      );
    },
    [signAndExecuteTransaction, setDigest, refreshData]
  );

  const handleMint = useCallback(
    async (assetId: number, to: string, amount: bigint) => {
      console.log('Mint clicked');
      const merak = initMerakClient();
      let tx = new Transaction();
      await merak.mint(tx, assetId, to, amount, true);
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
            refreshData();
          },
          onError: (error) => {
            console.log('executed transaction', error);
          }
        }
      );
    },
    [signAndExecuteTransaction, setDigest, refreshData]
  );

  const handleBurn = useCallback(
    async (assetId: number, who: string, amount: bigint) => {
      console.log('Burn clicked');
      const merak = initMerakClient();
      let tx = new Transaction();
      await merak.burn(tx, assetId, who, amount, true);
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
            refreshData();
          },
          onError: (error) => {
            console.log('executed transaction', error);
          }
        }
      );
    },
    [signAndExecuteTransaction, setDigest, refreshData]
  );

  if (!currentWallet) {
    return null;
  }

  return (
    <SheetContent className="w-[400px] sm:w-[540px] ">
      <SheetHeader>
        <SheetTitle>Crypto Portfolio</SheetTitle>
        <SheetDescription>Your current merak'token holdings</SheetDescription>
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
            <div className="h-[calc(100vh-250px)] pr-4 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="text-right">Asset ID</TableHead>
                    <TableHead className="text-right">Token Name</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Value (USD)</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetMetadata.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="text-right whitespace-nowrap">#{asset.id}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end whitespace-nowrap">
                          <img
                            src={asset.metadata[4] || '/default-icon.png'}
                            alt={asset.metadata[0] || `Asset ${asset.id}`}
                            className="w-6 h-6 mr-2"
                          />
                          {asset.metadata[0] || `Asset ${asset.id}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {(
                          Number(asset.balance[0]) / Math.pow(10, asset.metadata[3])
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">$N/A</TableCell>
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
                            <DropdownMenuItem
                              onClick={() => handleActionClick('transfer', asset.id)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              <span>Transfer</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleActionClick('transferAll', asset.id)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              <span>Transfer All</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleActionClick('mint', asset.id)}>
                              <Coins className="mr-2 h-4 w-4" />
                              <span>Mint</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick('burn', asset.id)}>
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
          </div>
        </>
      )}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {selectedAction === 'transferAll'
                ? 'Please enter the recipient address for the transfer all action.'
                : 'Please enter the quantity and recipient address for the selected action.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedAction !== 'transferAll' && (
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
  );
}
