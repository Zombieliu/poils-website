import Link from "next/link"
import React, { useState } from "react"
import {
  ConnectButton,
  ConnectModal,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Sheet } from "@repo/ui/components/ui/sheet"
import Assets from "../assets/page"
import { ChevronDown } from "lucide-react";

export default function Header() {
  const currentAccount = useCurrentAccount();
	const [open, setOpen] = useState(false);
	const [assetsSheetOpen, setAssetsSheetOpen] = useState(false);

  
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-black"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
          <span className="font-bold text-lg">Obelisk</span>
        </div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">v0.1</span>
      </div>
      <nav className="hidden md:flex items-center space-x-4">
      <Link href="/" className="text-sm font-medium hover:text-gray-600">
          Swap
        </Link>
        <Link href="/pool" className="text-sm font-medium hover:text-gray-600">
          Earn
        </Link>
        {/* <Link href="/staking" className="text-sm font-medium hover:text-gray-600">
          Staking
        </Link> */}
        <button
          onClick={() => setAssetsSheetOpen(true)}
          className="text-sm font-medium hover:text-gray-600"
        >
          Assets
        </button>
        <Link href="/create" className="text-sm font-medium hover:text-gray-600">
          Create Token
        </Link>
        <Link href="/wrap" className="text-sm font-medium hover:text-gray-600">
          Warp
        </Link>
        {/* <Link href="/bridge" className="text-sm font-medium hover:text-gray-600">
          Bridge
        </Link> */}
        {/* <button className="text-sm font-medium hover:text-gray-600 flex items-center">
          <span>Pool</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </button> */}
        <Link href="/pool/liquidity" className="text-sm font-medium hover:text-gray-600">
          Pool
        </Link>
      </nav>
      <ConnectButton />
      {/* <ConnectModal
        trigger={
          <button disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect'}</button>
        }
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
      /> */}
      <Sheet open={assetsSheetOpen} onOpenChange={setAssetsSheetOpen}>
        <Assets />
      </Sheet>
    </header>
  )
}