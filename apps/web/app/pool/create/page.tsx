"use client";
import React from "react";
import TokenCreate from "../../components/pool/create/token-create";
import { PoolSetupOpen } from "../../jotai/pool/pool";
import { useAtom } from "jotai";
import LiquidityPoolSetup from "../../components/pool/create/liquidity-pool-setup";

export default function Page() {
  const [PoolSetup,_] = useAtom(PoolSetupOpen);
  if(PoolSetup){
    return (
      <LiquidityPoolSetup selectedTokens={{
        base: undefined,
        quote: undefined
      }} onClose={function (): void {
        throw new Error("Function not implemented.");
      } }/>
    )
  }
  else{
    return (
      <TokenCreate onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSelectTokens={function (base: any, quote: any): void {
        throw new Error("Function not implemented.");
      } }/>
    )
  }
}