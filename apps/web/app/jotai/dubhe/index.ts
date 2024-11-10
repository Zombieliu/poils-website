'use client';

import { atom } from 'jotai';
import { Dubhe, loadMetadata } from '@0xobelisk/sui-client';
import { NETWORK, PACKAGE_ID } from '@/app/chain/config';

const initDubheClient = () => {
  const dubhe = new Dubhe({
    networkType: NETWORK,
    packageId: PACKAGE_ID
  });
  return dubhe;
};

const dubheClient = atom(initDubheClient);

export { dubheClient, initDubheClient };
