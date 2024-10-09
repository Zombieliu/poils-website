import { useState } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import TokenSelectionModal from '../swap/token-selection-modal'
import { init_obelisk_client } from '../../jotai/obelisk'
import { Transaction, TransactionArgument } from '@0xobelisk/sui-client'
import { toast } from 'sonner'
import { ASSETS_ID, DEX_ID } from '../../chain/config'
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'

interface TokenData {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  id: number;
  decimals: number;
}

export default function AddLiquidity() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState("");
  const [token1, setToken1] = useState<TokenData | null>(null)
  const [token2, setToken2] = useState<TokenData | null>(null)
  const [amount1, setAmount1] = useState('0.0')
  const [amount2, setAmount2] = useState('0.0')
  const [minAmount1, setMinAmount1] = useState('0.0')
  const [minAmount2, setMinAmount2] = useState('0.0')

  const [isToken1ModalOpen, setIsToken1ModalOpen] = useState(false)
  const [isToken2ModalOpen, setIsToken2ModalOpen] = useState(false)

  const handleSelectToken1 = (token: TokenData) => {
    setToken1(token)
    setIsToken1ModalOpen(false)
  }

  const handleSelectToken2 = (token: TokenData) => {
    setToken2(token)
    setIsToken2ModalOpen(false)
  }

  const handleAddLiquidity = async () => {
    if (!token1 || !token2) {
      toast.error("Please select both tokens");
      return;
    }

    console.log('Add liquidity')
    const obelisk = await init_obelisk_client()
    let tx = new Transaction();
    
    console.log(token1,token2);

    const baseDesired = BigInt(Math.floor(parseFloat(amount1) * Math.pow(10, token1.decimals)));
    const quoteDesired = BigInt(Math.floor(parseFloat(amount2) * Math.pow(10, token2.decimals)));
    const baseMin = BigInt(Math.floor(parseFloat(minAmount1) * Math.pow(10, token1.decimals)));
    const quoteMin = BigInt(Math.floor(parseFloat(minAmount2) * Math.pow(10, token2.decimals)));


    
    let params: TransactionArgument[] = [
      tx.object(DEX_ID),
      tx.object(ASSETS_ID),
      tx.pure.u32(token1.id),
      tx.pure.u32(token2.id),
      tx.pure.u64(baseDesired),
      tx.pure.u64(quoteDesired),
      tx.pure.u64(baseMin),
      tx.pure.u64(quoteMin),
    ];
    await obelisk.tx.dex_system.add_liquidity(tx, params, undefined, true);
    await signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
        chain: `sui:testnet`,
      },
      {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          toast("Transaction Successful", {
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
          toast.error("Transaction failed");
        },
      },
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add Liquidity</h1>
      </div>
      <p className="text-sm text-gray-500">Create a new pool or create a liquidity position on an existing pool.</p>

      <div className="space-y-6">
        <div>
          <Label>Tokens</Label>
          <p className="text-sm text-gray-500 mb-2">Select token pair which you like to add liquidity to.</p>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsToken1ModalOpen(true)}
              className="w-full justify-between"
              variant="outline"
            >
              {token1 ? (
                <>
                  <img src={token1.icon} alt={token1.symbol} className="w-6 h-6 mr-2" />
                  {token1.symbol}
                </>
              ) : 'Select token'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button
              onClick={() => setIsToken2ModalOpen(true)}
              className="w-full justify-between"
              variant="outline"
            >
              {token2 ? (
                <>
                  <img src={token2.icon} alt={token2.symbol} className="w-6 h-6 mr-2" />
                  {token2.symbol}
                </>
              ) : 'Select token'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <div>
          <Label>Liquidity</Label>
          <p className="text-sm text-gray-500 mb-2">
            Enter the amount of tokens you wish to deposit for this position.
          </p>
          <div className="space-y-4">
            <div>
              <Label>{token1 ? token1.symbol : ''} Amount</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={amount1}
                  onChange={(e) => setAmount1(e.target.value)}
                  placeholder="0.0"
                />
                <span className="text-sm font-medium">{token1 ? token1.symbol : ''}</span>
              </div>
              {token1 && (
                <p className="text-sm text-gray-500 mt-1">
                  Balance: {token1.balance} {token1.symbol}
                </p>
              )}
            </div>
            <div>
              <Label>{token2 ? token2.symbol : ''} Amount</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={amount2}
                  onChange={(e) => setAmount2(e.target.value)}
                  placeholder="0.0"
                />
                <span className="text-sm font-medium">{token2 ? token2.symbol : ''}</span>
              </div>
              {token2 && (
                <p className="text-sm text-gray-500 mt-1">
                  Balance: {token2.balance} {token2.symbol}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label>Minimum Deposit Amounts</Label>
          <p className="text-sm text-gray-500 mb-2">
            Enter the minimum amount of tokens you're willing to deposit.
          </p>
          <div className="space-y-4">
            <div>
              <Label>Minimum {token1 ? token1.symbol : ''} Amount</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={minAmount1}
                  onChange={(e) => setMinAmount1(e.target.value)}
                  placeholder="0.0"
                />
                <span className="text-sm font-medium">{token1 ? token1.symbol : ''}</span>
              </div>
            </div>
            <div>
              <Label>Minimum {token2 ? token2.symbol : ''} Amount</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={minAmount2}
                  onChange={(e) => setMinAmount2(e.target.value)}
                  placeholder="0.0"
                />
                <span className="text-sm font-medium">{token2 ? token2.symbol : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleAddLiquidity} className="w-full">Add Liquidity</Button>

      <TokenSelectionModal
        isOpen={isToken1ModalOpen}
        onClose={() => setIsToken1ModalOpen(false)}
        onSelectToken={handleSelectToken1}
        selectionType="from"
      />
      <TokenSelectionModal
        isOpen={isToken2ModalOpen}
        onClose={() => setIsToken2ModalOpen(false)}
        onSelectToken={handleSelectToken2}
        selectionType="to"
      />
    </div>
  )
}