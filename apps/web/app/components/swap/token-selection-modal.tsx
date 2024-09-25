"use client";
import { useState } from 'react'
import { X, Search, ChevronDown, ExternalLink, Check } from 'lucide-react'
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import { useAtom } from 'jotai'
import { TokenSelectionOpen } from '../../jotai/swap/swap'


const tokens = [
  { symbol: 'SUI', name: 'Sui', address: '0x2::sui::SUI', verified: true },
  // { symbol: 'USDC', name: 'USD Coin', address: '0x5d4b...COIN', verified: true },
  // { symbol: 'AUSD', name: 'AUSD', address: '0x2053...AUSD', verified: true },
  // { symbol: 'BLUB', name: 'BLUB', address: '0xfa7a...BLUB', verified: true },
  // { symbol: 'FUD', name: 'FUD', address: '0x76cb...FUD', verified: true },
  // { symbol: 'HUSKI', name: 'Huski Token', address: '0xda16...OKEN', verified: true },
]

// const quickSelectTokens = ['SUI', 'USDC', 'LIQ', 'MEOW', 'PUGWIF', 'SCUBA']
const quickSelectTokens = ['SUI']

function TokenSelectionModalOpen() {
    const [_,setTokenSelectionOpen] = useAtom(TokenSelectionOpen);
    
    const getTokenImage = (symbol: string) => {
      console.log(`https://hop.ag/tokens/${symbol}.svg`);
      return symbol === 'SUI' ? `https://hop.ag/tokens/${symbol}.svg` : `/placeholder.svg?height=40&width=40`
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Select a Token</h2>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X onClick={() => setTokenSelectionOpen(false)} className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by token or paste type"
                className="pl-10 pr-4 py-3 w-full bg-gray-100 rounded-2xl"
              />
            </div>
  
            <div className="flex flex-wrap gap-2 mb-4">
              {quickSelectTokens.map((token) => (
                <Button key={token} variant="outline" className="rounded-full">
                 <img src={getTokenImage(token)} alt={token} className="w-6 h-6 mr-2" />
                  {token}
                </Button>
              ))}
            </div>
  
            <ScrollArea className="h-[300px]">
              {tokens.map((token) => (
                <div key={token.symbol} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center">
                  <img src={getTokenImage(token.symbol)} alt={token.symbol} className="w-10 h-10 mr-3" />
                    <div>
                      <div className="flex items-center">
                        <span className="font-bold mr-1">{token.symbol}</span>
                        {token.verified && <Check className="w-4 h-4 text-green-500" />}
                      </div>
                      <span className="text-sm text-gray-500">{token.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">--</span>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
  
            <p className="text-center text-sm text-gray-500 mt-4">
              Default list may not include all tokens.
            </p>
          </div>
        </div>
      </div>
    )
  }

interface TokenSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectToken: (token: any) => void;
}

const TokenSelectionModal: React.FC<TokenSelectionModalProps> = ({ isOpen, onClose, onSelectToken }) => {
    return (
        <div style={{ display: isOpen ? 'block' : 'none' }}>
            {/* Modal Content */}
            <TokenSelectionModalOpen/>
            <button onClick={onClose}>Close</button>
            {/* Token selection logic */}
        </div>
    );
};

export default TokenSelectionModal;

