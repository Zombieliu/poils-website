"use client";
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { ArrowRightLeft, Wallet } from "lucide-react"

export default function Staking() {
  return (
    <div className="bg-gray-900 text-white p-8 max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center">
            <ArrowRightLeft className="w-12 h-12 text-teal-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
            <span className="text-teal-500 font-bold">x</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-8">赚取更多收益通过 <span className="text-teal-500">&lt; xPoils &gt;</span></h2>
      
      <p className="text-center text-gray-400 mb-8">通过质押Poils，您有机会赚取协议产生的费用，任何Poils持有人都可以分享Poils的收入。</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 mb-2">质押年化率</p>
          <p className="text-3xl font-bold">9.96%</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 mb-2">xPoils 余额</p>
          <div className="flex items-center">
            <ArrowRightLeft className="w-6 h-6 text-teal-500 mr-2" />
            <p className="text-3xl font-bold">-</p>
          </div>
          <p className="text-gray-400">- REF</p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <div className="flex justify-between mb-4">
          <Button variant="ghost" className="text-teal-500">质押</Button>
          <Button variant="ghost" className="text-gray-400">取消质押</Button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <ArrowRightLeft className="w-6 h-6 text-teal-500" />
          <p>1 Poils = 0.6704 xPoils</p>
        </div>
        <Input type="number" placeholder="0.0" className="mb-4" />
        <p className="text-right text-gray-400 mb-4">余额: -</p>
        <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
          <Wallet className="w-4 h-4 mr-2" /> 连接钱包
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 mb-2">质押人数</p>
          <p className="text-2xl font-bold">25,099</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 mb-2">和xPoils持有者分享的收入</p>
          <p className="text-2xl font-bold">2,968,234.25 Poils</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 mb-2">质押的Poils总数量</p>
          <p className="text-xl font-bold">14,940,737.12 Poils</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 mb-2">产出的xPoils的总数量</p>
          <p className="text-xl font-bold">10,016,949.23 xPoils</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 mb-2">累计 Poils 回购</p>
          <p className="text-xl font-bold">3,948,907.03 Poils</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 mb-2">年度收入加速器</p>
          <p className="text-xl font-bold">x1</p>
        </div>
      </div>
    </div>
  )
}