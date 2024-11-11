import Link from 'next/link';
import React, { useState } from 'react';
import { ConnectButton, ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { Sheet } from '@repo/ui/components/ui/sheet';
import Assets from '@/app/assets/page';
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  const [assetsSheetOpen, setAssetsSheetOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-transparent border-b border-gray-200">
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
            className="text-blue-500"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
          <span className="font-bold text-lg text-blue-500">Merak</span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-500 px-2 py-1 rounded-full">v0.1</span>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-500">
          Swap
        </Link>
        <Link href="/pool" className="text-sm font-medium text-gray-600 hover:text-blue-500">
          Earn
        </Link>
        <button
          onClick={() => setAssetsSheetOpen(true)}
          className="text-sm font-medium text-gray-600 hover:text-blue-500"
        >
          Assets
        </button>
        <Link href="/create" className="text-sm font-medium text-gray-600 hover:text-blue-500">
          Create Token
        </Link>
        <Link href="/wrap" className="text-sm font-medium text-gray-600 hover:text-blue-500">
          Wrap
        </Link>
        <Link
          href="/pool/liquidity"
          className="text-sm font-medium text-gray-600 hover:text-blue-500"
        >
          Pool
        </Link>
      </nav>
      <ConnectButton className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded" />
      <Sheet open={assetsSheetOpen} onOpenChange={setAssetsSheetOpen}>
        <Assets />
      </Sheet>
    </header>
  );
}
