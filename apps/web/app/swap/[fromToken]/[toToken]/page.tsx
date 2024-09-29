"use client";
import React, { useState, useEffect } from "react"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import TokenSelectionModal from "../../../components/swap/token-selection-modal";
import { useAtom } from "jotai";    
import { TokenSelectionOpen } from "../../../jotai/swap/swap";
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { fromToken: string, toToken: string } }) {
    const [isTokenSelectionOpen, setTokenSelectionOpen] = useAtom(TokenSelectionOpen);
    const router = useRouter();

    const tokens = {
        '0': { symbol: 'Poils', icon: 'https://hop.ag/tokens/SUI.svg' },
        '1': { symbol: 'USDC', icon: 'https://hop.ag/tokens/SUI.svg' }
    };

    const [fromToken, setFromToken] = useState(tokens[params.fromToken as keyof typeof tokens]);
    const [toToken, setToToken] = useState(tokens[params.toToken as keyof typeof tokens]);

    useEffect(() => {
        setFromToken(tokens[params.fromToken as keyof typeof tokens]);
        setToToken(tokens[params.toToken as keyof typeof tokens]);
    }, [params.fromToken, params.toToken]);

    const handleSwap = () => {
        console.log("Swap button clicked"); // 调试日志
        router.push(`/swap/${params.toToken}/${params.fromToken}`);
    };

    return (
        <main>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-2xl">
                            <label className="block text-sm font-medium text-gray-500 mb-1">You pay</label>
                            <div className="flex items-center justify-between">
                                <Input
                                    type="text"
                                    defaultValue="1,232,131,321"
                                    className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                />
                                <Button variant="outline" className="ml-2 rounded-full" onClick={() => setTokenSelectionOpen(true)}>
                                    <img src={fromToken.icon} alt={fromToken.symbol} className="w-5 h-5 mr-2" />
                                    {fromToken.symbol}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-gray-500 text-sm mt-1">$1,835,875,668.29</div>
                        </div>
                        <div className="flex justify-center">
                            <Button variant="outline" size="icon" className="rounded-full" onClick={handleSwap}>
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="bg-white p-4 rounded-2xl">
                            <label className="block text-sm font-medium text-gray-500 mb-1">You receive</label>
                            <div className="flex items-center justify-between">
                                <Input
                                    type="text"
                                    defaultValue="1,232,131,321"
                                    className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                />
                                <Button variant="outline" className="ml-2 rounded-full" onClick={() => setTokenSelectionOpen(true)}>
                                    <img src={toToken.icon} alt={toToken.symbol} className="w-5 h-5 mr-2" />
                                    {toToken.symbol}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-gray-500 text-sm mt-1">$0.00</div>
                        </div>
                    </div>
                    <div className="text-center text-gray-500 text-sm mt-4">
                        Could not connect to routing API.
                    </div>
                </div>
            </div>
        </main>
    )
}