'use client';

import { atom } from 'jotai';

export type Token = {
  id: number;
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  icon: string;
  balance: string;
};

export const fromTokenAtom = atom<Token>({
  id: 0,
  name: 'A',
  symbol: 'A',
  description: 'A',
  decimals: 1,
  icon: '',
  balance: ''
});
export const toTokenAtom = atom<Token>({
  id: 1,
  name: 'B',
  symbol: 'B',
  description: 'B',
  decimals: 1,
  icon: '',
  balance: ''
});
