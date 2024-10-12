'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { X, Search, ChevronDown, ExternalLink, Check, Loader2 } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { useAtom } from 'jotai';
import { AssetsMetadata, TokenSelectionOpen } from '@/app/jotai/swap/swap';
import debounce from 'lodash.debounce';

const quickSelectTokens = ['SUI'];

function TokenSelectionModalOpen({
  onSelectToken,
  onClose,
  selectionType
}: {
  onSelectToken: (token: any) => void;
  onClose: () => void;
  selectionType: 'from' | 'to';
}) {
  const [_, setTokenSelectionOpen] = useAtom(TokenSelectionOpen);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assetMetadata] = useAtom(AssetsMetadata);
  const [filteredAssets, setFilteredAssets] = useState(assetMetadata);

  const filterTokens = useCallback(
    (term: string) => {
      setIsLoading(true);
      const lowercasedTerm = term.toLowerCase();
      const filtered = assetMetadata.filter(
        (asset) =>
          asset.metadata[0].toLowerCase().includes(lowercasedTerm) || // name
          asset.metadata[1].toLowerCase().includes(lowercasedTerm) || // symbol
          asset.metadata[2].toLowerCase().includes(lowercasedTerm) // type
      );
      setFilteredAssets(filtered);
      setIsLoading(false);
    },
    [assetMetadata]
  );

  const debouncedFilterTokens = useMemo(() => debounce(filterTokens, 300), [filterTokens]);

  useEffect(() => {
    debouncedFilterTokens(searchTerm);
    return () => {
      debouncedFilterTokens.cancel();
    };
  }, [searchTerm, debouncedFilterTokens]);

  const handleSelectToken = (asset: any) => {
    onSelectToken({
      symbol: asset.metadata[1],
      name: asset.metadata[0],
      icon: asset.metadata[4] || '/default-icon.png',
      balance: (Number(asset.balance[0]) / Math.pow(10, asset.metadata[3])).toLocaleString(),
      id: asset.id,
      decimals: asset.metadata[3]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Select a {selectionType === 'from' ? 'Pay' : 'Receive'} Token
            </h2>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X onClick={onClose} className="h-6 w-6" />
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by token or paste type"
              className="pl-10 pr-4 py-3 w-full bg-gray-100 rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {quickSelectTokens.map((token) => (
              <Button key={token} variant="outline" className="rounded-full">
                <img
                  src={`https://hop.ag/tokens/${token}.svg`}
                  alt={token}
                  className="w-6 h-6 mr-2"
                />
                {token}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectToken(asset)}
                >
                  <div className="flex items-center">
                    <img
                      src={asset.metadata[4] || '/default-icon.png'}
                      alt={asset.metadata[0]}
                      className="w-10 h-10 mr-3"
                    />
                    <div>
                      <div className="flex items-center">
                        <span className="font-bold mr-1">{asset.metadata[1]}</span>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm text-gray-500">{asset.metadata[0]}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {(
                        Number(asset.balance[0]) / Math.pow(10, asset.metadata[3])
                      ).toLocaleString()}
                    </span>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      {asset.metadata[2].slice(0, 6)}...{asset.metadata[2].slice(-4)}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            {!isLoading && filteredAssets.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No tokens found matching your search.
              </div>
            )}
          </ScrollArea>

          <p className="text-center text-sm text-gray-500 mt-4">
            Default list may not include all tokens.
          </p>
        </div>
      </div>
    </div>
  );
}

interface TokenSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: any) => void;
  selectionType: 'from' | 'to';
}

const TokenSelectionModal: React.FC<TokenSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  selectionType
}) => {
  if (!isOpen) return null;

  return (
    <TokenSelectionModalOpen
      onSelectToken={onSelectToken}
      onClose={onClose}
      selectionType={selectionType}
    />
  );
};

export default TokenSelectionModal;
