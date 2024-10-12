'use client';

import { atom } from 'jotai';
import { Obelisk, loadMetadata } from '@0xobelisk/sui-client';
import { NETWORK, PACKAGE_ID } from '@/app/chain/config';

const initObeliskClient = () => {
  const obelisk = new Obelisk({
    networkType: NETWORK,
    packageId: PACKAGE_ID
  });
  return obelisk;
};

const obeliskClient = atom(initObeliskClient);

export { obeliskClient, initObeliskClient };
