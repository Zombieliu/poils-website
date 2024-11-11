'use client';

import '@repo/ui/globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'jotai';

import '@mysten/dapp-kit/dist/index.css';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { NETWORK } from '@/app/chain/config';
import { EnokiFlowProvider } from '@mysten/enoki/react';
import Header from '@/app/components/header';
import React from 'react';
import AppWrapper from '@/app/components/app-wrapper';

const inter = Inter({ subsets: ['latin'] });

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') }
});

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F7F8FA]`}>
        <Provider>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork={NETWORK}>
              <WalletProvider>
                <EnokiFlowProvider apiKey="enoki_public_7278cc47e76ec32331cf1f8fc83a4b1a">
                  <Toaster />
                  <div>
                    <Header />
                    <AppWrapper>{children}</AppWrapper>
                  </div>
                </EnokiFlowProvider>
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
