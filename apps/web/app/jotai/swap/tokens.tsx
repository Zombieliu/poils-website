'use client';

import { atom } from 'jotai';

export interface Token {
  id: number;
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  icon: string;
  balance: string | string[];
}

export const fromTokenAtom = atom<Token | null>(null);
export const toTokenAtom = atom<Token | null>(null);
