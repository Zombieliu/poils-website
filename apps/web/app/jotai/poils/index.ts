'use client';

import { atom } from 'jotai';
import { Poils } from '@0xobelisk/poils-sdk';
import { NETWORK } from '@/app/chain/config';

const initPoilsClient = () => {
  const poils = new Poils({
    networkType: NETWORK
  });
  return poils;
};

const poilsClient = atom(initPoilsClient);

export { poilsClient, initPoilsClient };
