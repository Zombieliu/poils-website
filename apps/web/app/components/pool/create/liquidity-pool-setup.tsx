"use client";
import { useState } from 'react'
import { ArrowLeft, Info, AlertTriangle } from 'lucide-react'
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import React from 'react'
import { PoolSetupOpen } from '../../../jotai/pool/pool';
import { useAtom } from 'jotai';

export default function LiquidityPoolSetup() {
  const [feeTier, setFeeTier] = useState('1%')
  const [initialPrice, setInitialPrice] = useState('1')
  const [liquidityRange, setLiquidityRange] = useState('Full')
  const [suiAmount, setSuiAmount] = useState('')
  const [usdcAmount, setUsdcAmount] = useState('0.1')
  const [_,SetPoolSetupOpen] = useAtom(PoolSetupOpen);
  return (
    <div className="min-h-screen bg-white p-6 max-w-md mx-auto">
      <div className="mb-6 flex items-center">
        <button onClick={()=>SetPoolSetupOpen(false)}>
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
        <div className="text-right mb-2 ">50% $SUI : 50% $USDC</div>
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
            <div className="flex-1">
              <div>Poils</div>
              <div className="text-sm ">Balance: 10.64</div>
            </div>
            <Input
              type="text"
              value={suiAmount}
              onChange={(e) => setSuiAmount(e.target.value)}
              className="w-1/3 "
            />
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full mr-2"></div>
            <div className="flex-1">
              <div>Obelisk</div>
              <div className="text-sm ">Balance: 0.013213</div>
            </div>
            <Input
              type="text"
              value={usdcAmount}
              onChange={(e) => setUsdcAmount(e.target.value)}
              className="w-1/3 "
            />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span>Total</span>
          <span>$0</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
          <div>
            <div className="font-bold">Important Notice:</div>
            <div className="text-sm">
              A minimum liquidity deposit of $100 is required to create a new pool. This ensures that token pools are established by project builders and core community members with a genuine commitment to the project.
            </div>
          </div>
        </div>
      </div>
      
      <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        Create Poils pool and deposit
      </Button>
    </div>
  )
}