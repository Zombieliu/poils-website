"use client";
import React, { useState, useEffect } from "react"
import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Skeleton } from "@repo/ui/components/ui/skeleton"
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
                                    value={payAmount}
                                    className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                    onChange={handleInputChangePay}
                                />
                                <Button variant="outline" className="ml-2 rounded-full" onClick={() => setTokenSelectionOpen(true)}>
                                    {fromTokenLoading ? (
                                        <Skeleton className="w-5 h-5 rounded-full mr-2" />
                                    ) : (
                                        <img src={fromToken.icon} alt={fromToken.symbol} className="w-5 h-5 mr-2" />
                                    )}
                                    {fromToken.symbol}
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
                                <Button variant="outline" className="ml-2 rounded-full" onClick={() => setTokenSelectionOpen(true)}>
                                    {toTokenLoading ? (
                                        <Skeleton className="w-5 h-5 rounded-full mr-2" />
                                    ) : (
                                        <img src={toToken.icon} alt={toToken.symbol} className="w-5 h-5 mr-2" />
                                    )}
                                    {toToken.symbol}
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
        </main>
    )
}