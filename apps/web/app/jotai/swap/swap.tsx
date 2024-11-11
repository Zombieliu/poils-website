'use client';

import { atom } from 'jotai';

const TokenSelectionOpen = atom(false);
const AssetsMetadata = atom<any[]>([]);

export { TokenSelectionOpen, AssetsMetadata };
