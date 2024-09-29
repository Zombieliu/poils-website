// "use client"

// import { Search, ChevronDown, RefreshCw, Grid, Info } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// import React from 'react'

// export default function LiquidityPools() {

//   const pools = [
//     { name: 'BLUB / SUI', apr: '432.17%', liquidity: '$732,615', volume: '$819,691', feeTier: '1%', 
//       token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
//     { name: 'AAA / SUI', apr: '359.04%', liquidity: '$48,707', volume: '$43,353', feeTier: '1%', 
//       token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
//     { name: 'PUFF / SUI', apr: '127.61%', liquidity: '$84,279', volume: '$25,720', feeTier: '1%', 
//       token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
//     { name: 'LIQ / TURBOS', apr: '620.04%', liquidity: '$14,826', volume: '$19,263', feeTier: '1%', 
//       token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
//     { name: 'SUI / USDC', apr: '328.72%', liquidity: '$2,234,003', volume: '$5,355,934', feeTier: '0.3%', 
//       token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
//     { name: 'USDT / USDC', apr: '20.78%', liquidity: '$5,364,358', volume: '$1,642,141', feeTier: '0.01%', 
//       token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
//     { name: 'FUD / SUI', apr: '499.64%', liquidity: '$486,326', volume: '$665,726', feeTier: '1%', 
//       token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
//     { name: 'LIQ / SUI', apr: '307.52%', liquidity: '$259,579', volume: '$318,707', feeTier: '1%', 
//       token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
//   ]
  
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold">Earn Fees and Rewards by Providing Liquidity</h1>
//           <button className="bg-white px-4 py-2 rounded">
//             <Link href="/pool/create">
//               + Create a Pool
//             </Link>
//           </button>
//         </div>
        
//         <div className="flex space-x-4 mb-8 overflow-x-auto">
//           <button className="text-indigo-400 border-b-2 border-indigo-400 pb-2 whitespace-nowrap">Concentrated Liquidity Pools</button>
//           {/* <button className="text-gray-400 whitespace-nowrap">My Favorite</button>
//           <button className="text-gray-400 whitespace-nowrap">Manage Positions and Rewards</button> */}
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//           <div className="bg-white p-4 rounded">
//             <div className="text-gray-400 mb-2">Total Value Locked</div>
//             <div className="text-2xl font-bold">$ 13,482,691</div>
//           </div>
//           <div className="bg-white p-4 rounded">
//             <div className="text-gray-400 mb-2">Volume (24H)</div>
//             <div className="text-2xl font-bold">$ 9,488,068</div>
//           </div>
//         </div>
        
//         <div className="flex flex-wrap gap-4 mb-8">
//           <div className="relative flex-grow">
//             <input type="text" placeholder="Input coin symbol" className="w-full bg-white p-2 pl-10 rounded" />
//             <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
//           </div>
//           <div className="relative">
//             <select className="appearance-none bg-white p-2 pr-10 rounded">
//               <option>Category</option>
//             </select>
//             <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
//           </div>
//           <div className="relative">
//             <select className="appearance-none bg-white p-2 pr-10 rounded">
//               <option>Sort By</option>
//             </select>
//             <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
//           </div>
//           <button className="bg-white p-2 rounded flex items-center">
//             <input type="checkbox" className="mr-2" /> Display all pools
//           </button>
//           <button className="bg-white p-2 rounded">
//             <RefreshCw size={20} />
//           </button>
//           <button className="bg-white p-2 rounded">
//             <Grid size={20} />
//           </button>
//         </div>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {pools.map((pool, index) => (
//             <div key={index} className="bg-white p-4 rounded">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center space-x-2">
//                   <img src={pool.token1Image} alt={pool.name.split(' / ')[0]} width={24} height={24} className="rounded-full" />
//                   <img src={pool.token2Image} alt={pool.name.split(' / ')[1]} width={24} height={24} className="rounded-full" />
//                   <span>{pool.name}</span>
//                 </div>
//                 <div className="flex space-x-2">
//                   <img src="https://hop.ag/tokens/SUI.svg" alt="Sui" className="rounded-full" />
//                   <img src="https://hop.ag/tokens/SUI.svg" alt="Sui" className="rounded-full" />
//                 </div>
//               </div>
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <div className="text-gray-400 text-sm">APR <Info size={12} className="inline" /></div>
//                   <div className="text-xl font-bold text-green-400">{pool.apr}</div>
//                 </div>
//                 <div>
//                   <div className="text-gray-400 text-sm">Rewards</div>
//                   <img src="https://hop.ag/tokens/SUI.svg" alt="Sui" width={24} height={24} className="rounded-full" />
//                 </div>
//               </div>
//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Liquidity</span>
//                   <span>{pool.liquidity}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">24h Volume</span>
//                   <span>{pool.volume}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Fee Tier</span>
//                   <span>{pool.feeTier}</span>
//                 </div>
//               </div>
//               <button className="w-full bg-indigo-600 text-white p-2 rounded">Add Liquidity</button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { Search, ChevronDown, RefreshCw, Grid, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Skeleton } from "@repo/ui/components/ui/skeleton"

export default function LiquidityPools() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const pools = [
    { name: 'BLUB / SUI', apr: '432.17%', liquidity: '$732,615', volume: '$819,691', feeTier: '1%', 
      token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
    { name: 'AAA / SUI', apr: '359.04%', liquidity: '$48,707', volume: '$43,353', feeTier: '1%', 
      token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
    { name: 'PUFF / SUI', apr: '127.61%', liquidity: '$84,279', volume: '$25,720', feeTier: '1%', 
      token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
    { name: 'LIQ / TURBOS', apr: '620.04%', liquidity: '$14,826', volume: '$19,263', feeTier: '1%', 
      token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
    { name: 'SUI / USDC', apr: '328.72%', liquidity: '$2,234,003', volume: '$5,355,934', feeTier: '0.3%', 
      token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
    { name: 'USDT / USDC', apr: '20.78%', liquidity: '$5,364,358', volume: '$1,642,141', feeTier: '0.01%', 
      token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
    { name: 'FUD / SUI', apr: '499.64%', liquidity: '$486,326', volume: '$665,726', feeTier: '1%', 
      token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
    { name: 'LIQ / SUI', apr: '307.52%', liquidity: '$259,579', volume: '$318,707', feeTier: '1%', 
      token1Image: 'https://hop.ag/tokens/SUI.svg', token2Image: 'https://hop.ag/tokens/SUI.svg' },
  ]
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-10 w-32" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Earn Fees and Rewards by Providing Liquidity</h1>
              <button className="bg-white px-4 py-2 rounded">
                <Link href="/pool/create">
                  + Create a Pool
                </Link>
              </button>
            </>
          )}
        </div>
        
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-64" />
            </>
          ) : (
            <button className="text-indigo-400 border-b-2 border-indigo-400 pb-2 whitespace-nowrap">Concentrated Liquidity Pools</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <div className="bg-white p-4 rounded">
                <div className="text-gray-400 mb-2">Total Value Locked</div>
                <div className="text-2xl font-bold">$ 13,482,691</div>
              </div>
              <div className="bg-white p-4 rounded">
                <div className="text-gray-400 mb-2">Volume (24H)</div>
                <div className="text-2xl font-bold">$ 9,488,068</div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full md:w-1/3" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </>
          ) : (
            <>
              <div className="relative flex-grow">
                <input type="text" placeholder="Input coin symbol" className="w-full bg-white p-2 pl-10 rounded" />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <div className="relative">
                <select className="appearance-none bg-white p-2 pr-10 rounded">
                  <option>Category</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
              <div className="relative">
                <select className="appearance-none bg-white p-2 pr-10 rounded">
                  <option>Sort By</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button className="bg-white p-2 rounded flex items-center">
                <input type="checkbox" className="mr-2" /> Display all pools
              </button>
              <button className="bg-white p-2 rounded">
                <RefreshCw size={20} />
              </button>
              <button className="bg-white p-2 rounded">
                <Grid size={20} />
              </button>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array(8).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))
          ) : (
            pools.map((pool, index) => (
              <div key={index} className="bg-white p-4 rounded">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <img src={pool.token1Image} alt={pool.name.split(' / ')[0]} width={24} height={24} className="rounded-full" />
                    <img src={pool.token2Image} alt={pool.name.split(' / ')[1]} width={24} height={24} className="rounded-full" />
                    <span>{pool.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <img src="https://hop.ag/tokens/SUI.svg" alt="Sui" className="rounded-full" />
                    <img src="https://hop.ag/tokens/SUI.svg" alt="Sui" className="rounded-full" />
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-gray-400 text-sm">APR <Info size={12} className="inline" /></div>
                    <div className="text-xl font-bold text-green-400">{pool.apr}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Rewards</div>
                    <img src="https://hop.ag/tokens/SUI.svg" alt="Sui" width={24} height={24} className="rounded-full" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Liquidity</span>
                    <span>{pool.liquidity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume</span>
                    <span>{pool.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee Tier</span>
                    <span>{pool.feeTier}</span>
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white p-2 rounded">Add Liquidity</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}