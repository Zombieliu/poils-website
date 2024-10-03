"use client";
import React, { useState, useEffect } from "react"
import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Skeleton } from "@repo/ui/components/ui/skeleton"
import { useAtom } from "jotai";    
import { TokenSelectionOpen } from "../../../jotai/swap/swap";
import { useRouter } from 'next/navigation';
import TokenSelectionModal from "../../../components/swap/token-selection-modal";

export default function Page({ params }: { params: { fromToken: string, toToken: string } }) {
    const [isTokenSelectionOpen, setTokenSelectionOpen] = useAtom(TokenSelectionOpen);
    const router = useRouter();

    const tokens = {
        '0': { symbol: 'Poils', icon: 'https://hop.ag/tokens/SUI.svg' },
        '1': { symbol: 'USDC', icon: 'https://hop.ag/tokens/SUI.svg' }
    };

    const [fromToken, setFromToken] = useState<any>(null);
    const [toToken, setToToken] = useState<any>(null);
    const [currentSelection, setCurrentSelection] = useState<'from' | 'to'>('from');

    const [isLoading, setIsLoading] = useState(false);
    const [dollarValue, setDollarValue] = useState<string | null>(null);

    const [fromTokenLoading, setFromTokenLoading] = useState(true);
    const [toTokenLoading, setToTokenLoading] = useState(true);

    useEffect(() => {
        setFromToken(tokens[params.fromToken as keyof typeof tokens]);
        setToToken(tokens[params.toToken as keyof typeof tokens]);
        
        // Simulate image loading
        setFromTokenLoading(true);
        setToTokenLoading(true);
        
        setTimeout(() => {
            setFromTokenLoading(false);
            setToTokenLoading(false);
        }, 1500); // Adjust this timeout as needed
    }, [params.fromToken, params.toToken]);

    useEffect(() => {
        // 假设 tokens 是一个包含所有可用 token 的对象或数组
        const initialToToken = tokens[params.toToken as keyof typeof tokens] || null;
        setToToken(initialToToken);
    }, [params.toToken]);

    const handleSwap = () => {
        console.log("Swap button clicked"); // 调试日志
        router.push(`/swap/${params.toToken}/${params.fromToken}`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setDollarValue("$1,835,875,668.29");
            setIsLoading(false);
        }, 1000);
    };

    const [isLoadingPay, setIsLoadingPay] = useState(false);
    const [isLoadingReceive, setIsLoadingReceive] = useState(false);
    const [dollarValuePay, setDollarValuePay] = useState<string | null>(null);
    const [dollarValueReceive, setDollarValueReceive] = useState<string | null>(null);

    const handleInputChangePay = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPayAmount(value);
        setIsLoadingPay(true);
        setIsLoadingReceive(true);
        
        // Simulate API call for exchange rate and dollar values
        setTimeout(() => {
            // This is a mock calculation. Replace with actual API call and calculation
            const calculatedReceiveAmount = (parseFloat(value) * 1.5).toFixed(2);
            setReceiveAmount(calculatedReceiveAmount);
            setDollarValuePay(`$${(parseFloat(value) * 1).toFixed(2)}`);
            setDollarValueReceive(`$${(parseFloat(calculatedReceiveAmount) * 1).toFixed(2)}`);
            setIsLoadingPay(false);
            setIsLoadingReceive(false);
        }, 1000);
    };

    const handleInputChangeReceive = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIsLoadingReceive(true);
        setTimeout(() => {
            setDollarValueReceive("$1,835,875,668.29");
            setIsLoadingReceive(false);
        }, 1000);
    };

    const [payAmount, setPayAmount] = useState<string>('');
    const [receiveAmount, setReceiveAmount] = useState<string>('');

    const [slippage, setSlippage] = useState("1.00");

    const handleSelectToken = (token: any) => {
        if (currentSelection === 'from') {
            setFromToken(token);
        } else {
            setToToken(token);
        }
        setTokenSelectionOpen(false);
    };

    return (
        <main>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <button className="rounded-full p-2 hover:bg-gray-100">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <div className="bg-white border border-gray-200 rounded-full px-4 py-1 text-sm font-medium">
                            {slippage}% slippage
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-2xl">
                            <label className="block text-sm font-medium text-gray-500 mb-1">You pay</label>
                            <div className="flex items-center justify-between">
                                <Input
                                    type="text"
                                    value={payAmount}
                                    className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                    onChange={handleInputChangePay}
                                />
                                <Button 
                                    variant="outline" 
                                    className="ml-2 rounded-full" 
                                    onClick={() => {
                                        setCurrentSelection('from');
                                        setTokenSelectionOpen(true);
                                    }}
                                >
                                    {fromToken ? (
                                        <>
                                            <img src={fromToken.icon} alt={fromToken.symbol} className="w-5 h-5 mr-2" />
                                            {fromToken.symbol}
                                        </>
                                    ) : (
                                        'Select Token'
                                    )}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-gray-500 text-sm mt-1 h-5">
                                {isLoadingPay ? (
                                    <Loader2 className="animate-spin h-4 w-4 inline-block" />
                                ) : dollarValuePay}
                            </div>
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
                                    value={isLoadingReceive ? '' : receiveAmount}
                                    className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                    readOnly
                                />
                                <Button 
                                    variant="outline" 
                                    className="ml-2 rounded-full" 
                                    onClick={() => {
                                        setCurrentSelection('to');
                                        setTokenSelectionOpen(true);
                                    }}
                                >
                                    {toToken ? (
                                        <>
                                            <img src={toToken.icon} alt={toToken.symbol} className="w-5 h-5 mr-2" />
                                            {toToken.symbol}
                                        </>
                                    ) : (
                                        'Select Token'
                                    )}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-gray-500 text-sm mt-1 h-5">
                                {isLoadingReceive ? (
                                    <Loader2 className="animate-spin h-4 w-4 inline-block" />
                                ) : dollarValueReceive}
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-gray-500 text-sm mt-4">
                        Could not connect to routing API.
                    </div>
                </div>
            </div>
            <TokenSelectionModal 
                isOpen={isTokenSelectionOpen} 
                onClose={() => setTokenSelectionOpen(false)} 
                onSelectToken={handleSelectToken}
                selectionType={currentSelection}
            />
        </main>
    )
}