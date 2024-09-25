"use client";
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import TokenSelectionModal from "./token-selection-modal";
import { useAtom } from "jotai";
import { TokenSelectionOpen } from "../../jotai/swap/swap";



export default function SwapInterface () {
  const [isTokenSelectionOpen, setTokenSelectionOpen] = useAtom(TokenSelectionOpen);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="bg-white border border-gray-200 rounded-full px-4 py-1 text-sm font-medium">
          1.00% slippage
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-2xl">
          <label className="block text-sm font-medium text-gray-500 mb-1">You pay</label>
          <div className="flex items-center justify-between">
            <Input
              type="text"
              defaultValue="1,232,131,321"
              className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
            />
            {/* how to click button to open token-selection-modal.tsx */}

            <Button variant="outline" className="ml-2 rounded-full" onClick={() => setTokenSelectionOpen(true)}>
                    <img src="https://hop.ag/tokens/SUI.svg" alt="SUI" className="w-5 h-5 mr-2" />
                    Poils
                    <ChevronDown className="ml-2 h-4 w-4" />
             </Button>
             <TokenSelectionModal 
               isOpen={isTokenSelectionOpen} 
               onClose={() => setTokenSelectionOpen(false)} 
               onSelectToken={(token) => {
                 // Handle token selection
                 setTokenSelectionOpen(false);
               }}
             />
          </div>
          <div className="text-gray-500 text-sm mt-1">$1,835,875,668.29</div>
        </div>
        <div className="flex justify-center">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl">
          <label className="block text-sm font-medium text-gray-500 mb-1">You receive</label>
          <div className="flex items-center justify-between">
            <Input
              type="text"
              defaultValue="1,232,131,321"
              className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
            />
            <Button variant="outline" className="ml-2 rounded-full" onClick={() => setTokenSelectionOpen(true)}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg">
                <circle cx="1000" cy="1000" r="1000" fill="#2775CA"/>
                <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#FFF"/>
              </svg>
              USDC
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <TokenSelectionModal 
               isOpen={isTokenSelectionOpen} 
               onClose={() => setTokenSelectionOpen(false)} 
               onSelectToken={(token) => {
                 // Handle token selection
                 setTokenSelectionOpen(false);
               }}
             />
          </div>
          <div className="text-gray-500 text-sm mt-1">$0.00</div>
        </div>
        <Button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-500 font-medium py-4 rounded-2xl text-lg">
          Connect Wallet
        </Button>
      </div>
      <div className="text-center text-gray-500 text-sm mt-4">
        Could not connect to routing API.
      </div>
    </div>
  </div>
  )
}

