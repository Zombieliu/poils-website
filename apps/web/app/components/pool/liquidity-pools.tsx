"use client"

import { Search, ChevronDown, RefreshCw, Grid, List, Info } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect, useCallback } from 'react'
import { Skeleton } from "@repo/ui/components/ui/skeleton"

export default function LiquidityPools() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPools, setFilteredPools] = useState([])
  const [pools, setPools] = useState([])
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Default')
  const [viewMode, setViewMode] = useState('card') // 'card' or 'table'

  const categories = [
    'All',
    'Rewards',
    'Stablecoin',
    'MEME coin',
    'LST',
    'High APR',
    'Low Risk',
    'New Pools'
  ]

  const sortOptions = [
    'Default',
    'Volume',
    'Liquidity',
    'APR',
    'Fee Tier',
    'Newest',
    'Rewards',
    '24h Change'
  ]

  const fetchPools = useCallback(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPools([
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
      ])
      setIsLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    fetchPools()
  }, [fetchPools])

  useEffect(() => {
    const filtered = pools.filter(pool => 
      pool.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPools(filtered)
  }, [searchTerm, pools])

  const handleViewModeChange = () => {
    setViewMode(prevMode => prevMode === 'card' ? 'table' : 'card')
  }

  const renderCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredPools.map((pool, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
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
      ))}
    </div>
  )

  const renderTableView = () => (
    <table className="w-full text-left">
      <thead>
        <tr className="text-gray-400">
          <th>Pool</th>
          <th>Liquidity</th>
          <th>24h Volume</th>
          <th>24h Fees</th>
          <th>APR</th>
          <th>Rewards</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {filteredPools.map((pool, index) => (
          <tr key={index} className="border-b border-gray-700">
            <td className="py-2">{pool.name}</td>
            <td>{pool.liquidity}</td>
            <td>{pool.volume}</td>
            <td>{(parseFloat(pool.volume.replace(/[^0-9.-]+/g,"")) * parseFloat(pool.feeTier) / 100).toFixed(0)}</td>
            <td className="text-green-400">{pool.apr}</td>
            <td>{/* Rewards icon */}</td>
            <td><button className="text-blue-400">+</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const renderSkeleton = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    </>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Earn Fees and Rewards by Providing Liquidity</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            + Create a Pool
          </button>
        </div>
        
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          <button className="text-indigo-600 border-b-2 border-indigo-600 pb-2 whitespace-nowrap">Concentrated Liquidity Pools</button>
        </div>
        
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded shadow">
                <div className="text-gray-600 mb-2">Total Value Locked</div>
                <div className="text-2xl font-bold text-gray-800">$ 13,482,691</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-gray-600 mb-2">Volume (24H)</div>
                <div className="text-2xl font-bold text-gray-800">$ 9,488,068</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <input 
                type="text" 
                placeholder="Input coin symbol" 
                className="bg-white p-2 rounded border border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                className="bg-white p-2 rounded border border-gray-300"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select 
                className="bg-white p-2 rounded border border-gray-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((sort) => (
                  <option key={sort} value={sort}>{sort}</option>
                ))}
              </select>
              <button 
                className="bg-white p-2 rounded border border-gray-300" 
                onClick={fetchPools}
              >
                <RefreshCw size={20} className="text-gray-600" />
              </button>
              <button 
                className="bg-white p-2 rounded border border-gray-300"
                onClick={handleViewModeChange}
              >
                {viewMode === 'card' ? <List size={20} className="text-gray-600" /> : <Grid size={20} className="text-gray-600" />}
              </button>
            </div>
            
            <div className="h-[calc(100vh-300px)] overflow-y-auto">
              {viewMode === 'card' ? renderCardView() : renderTableView()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}