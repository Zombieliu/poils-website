import { ChevronDown } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { useState } from "react";
import { useAtom } from "jotai";
import { TokenSelectionOpen } from "../../../jotai/swap/swap";

export default function TokenCreateOne() {
    // const [searchTerm, setSearchTerm] = useState('')
    // const [isTokenSelectionOpen, setTokenSelectionOpen] = useAtom(TokenSelectionOpen);
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <button className="mb-6">
        <ChevronDown className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-bold mb-2">Step 1: Select tokens</h2>
      <p className="text-gray-400 mb-6">
        Tips: for TURBOS/USDC, TURBOS is the base token, USDC is the quote token.
      </p>
      <div className="space-y-4">
        <Select>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select a base token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="turbos">TURBOS</SelectItem>
            <SelectItem value="eth">ETH</SelectItem>
            <SelectItem value="btc">BTC</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select a quote token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usdc">USDC</SelectItem>
            <SelectItem value="usdt">USDT</SelectItem>
            <SelectItem value="dai">DAI</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600">
          Select tokens
        </Button>
      </div>
    </div>
  )
}