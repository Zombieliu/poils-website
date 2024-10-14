'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const router = useRouter();

  const { currentWallet, connectionStatus } = useCurrentWallet();

  useEffect(() => {
    if (connectionStatus === 'connected' && currentWallet) {
      // 当连接成功时，将钱包信息保存到 localStorage
      localStorage.setItem(
        'sui_wallet_info',
        JSON.stringify({
          name: currentWallet.name,
          accounts: currentWallet.accounts.map((account) => account.address)
        })
      );
    }
  }, [connectionStatus, currentWallet]);

  useEffect(() => {
    // 组件加载时，尝试从 localStorage 恢复钱包信息
    const savedWalletInfo = localStorage.getItem('sui_wallet_info');
    if (savedWalletInfo && connectionStatus === 'disconnected') {
      // 这里可以添加自动重连的逻辑，或者显示一个提示让用户手动重连
      console.log('Found saved wallet info:', JSON.parse(savedWalletInfo));
    }
  }, []);

  if (!currentWallet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-8 bg-white/80 rounded-lg shadow-md backdrop-blur-sm">
          <h1 className="mb-4 text-2xl font-bold text-center">Welcome to Poils</h1>
          <p className="mb-6 text-center text-gray-600">
            Please connect your wallet to access all features.
          </p>
          <ConnectButton className="w-full" />
        </div>
      </div>
    );
  }

  return <div className="min-h-screen">{children}</div>;
}
