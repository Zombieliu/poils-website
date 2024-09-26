'use client'

import { useState } from 'react'
import { ArrowLeft, Info, AlertTriangle } from 'lucide-react'
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { useAtom } from 'jotai'
import { PoolSetupOpen } from '../../../jotai/pool/pool'

export default function LiquidityPoolSetup() {
  const [feeTier, setFeeTier] = useState('1%')
  const [initialPrice, setInitialPrice] = useState('1')
  const [liquidityRange, setLiquidityRange] = useState('Full')
  const [suiAmount, setSuiAmount] = useState('')
  const [usdcAmount, setUsdcAmount] = useState('0.1')
  const [_, setPoolSetupOpen] = useAtom(PoolSetupOpen)

  return (
    <div className="min-h-screen bg-white p-6 max-w-md mx-auto">
      <div className="mb-6 flex items-center">
        <button onClick={() => setPoolSetupOpen(false)} className="flex items-center text-primary">
          <ArrowLeft className="mr-2" />
          <span>Back to select tokens</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Step 2: Set initial deposit</h1>
      
      <div className="mb-6">
        <Label className="flex items-center mb-2">
          Fee tier <Info className="ml-2 w-4 h-4" />
        </Label>
        <div className="flex space-x-2">
          {['1%', '0.3%', '0.05%', '0.01%'].map((fee) => (
            <Button
              key={fee}
              variant={feeTier === fee ? "secondary" : "outline"}
              onClick={() => setFeeTier(fee)}
              className="flex-1"
            >
              {fee}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <Label className="flex items-center mb-2">
          Initial price <Info className="ml-2 w-4 h-4" />
        </Label>
        <div className="flex items-center">
          <Input
            type="text"
            value={initialPrice}
            onChange={(e) => setInitialPrice(e.target.value)}
            className="flex-1 bg-white"
          />
          <span className="ml-2">USDC per SUI</span>
        </div>
      </div>
      
      <div className="mb-6">
        <Label className="flex items-center mb-2">
          Liquidity range <Info className="ml-2 w-4 h-4" />
        </Label>
        <div className="flex space-x-2">
          <Button
            variant={liquidityRange === 'Full' ? "secondary" : "outline"}
            onClick={() => setLiquidityRange('Full')}
            className="flex-1"
          >
            Full
          </Button>
          <Button
            variant={liquidityRange === 'Custom' ? "secondary" : "outline"}
            onClick={() => setLiquidityRange('Custom')}
            className="flex-1"
          >
            Custom
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Label className="mb-2">Amount to deposit</Label>
        <div className="text-right mb-2 text-gray-600">50% $SUI : 50% $USDC</div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <img src="https://hop.ag/tokens/SUI.svg" alt="Poils logo" className="w-8 h-8 rounded-full mr-2" />
            <div className="flex-1">
              <div>Poils</div>
              <div className="text-sm text-gray-600">Balance: 10.64</div>
            </div>
            <Input
              type="text"
              value={suiAmount}
              onChange={(e) => setSuiAmount(e.target.value)}
              className="w-1/3 bg-white"
            />
          </div>
          <div className="flex items-center">
            <img src="https://hop.ag/tokens/SUI.svg" alt="Obelisk logo" className="w-8 h-8 rounded-full mr-2" />
            <div className="flex-1">
              <div>Obelisk</div>
              <div className="text-sm text-gray-600">Balance: 0.013213</div>
            </div>
            <Input
              type="text"
              value={usdcAmount}
              onChange={(e) => setUsdcAmount(e.target.value)}
              className="w-1/3 bg-white"
            />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span>Total</span>
          <span>$0</span>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
          <div>
            <div className="font-bold">Important Notice:</div>
            <div className="text-sm text-gray-700">
              A minimum liquidity deposit of $100 is required to create a new pool. This ensures that token pools are established by project builders and core community members with a genuine commitment to the project.
            </div>
          </div>
        </div>
      </div>
      
      <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
        Create Poils pool and deposit
      </Button>
    </div>
  )
}