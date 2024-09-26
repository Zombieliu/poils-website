"use client";
import React from "react"
import SwapInterface from "../../components/swap/swap-interface";

export default function Page({ params }: { params: { token: string } }) {
    
    console.log(params.token);
    return (
        <main>
             <SwapInterface />
        </main>
    );
}