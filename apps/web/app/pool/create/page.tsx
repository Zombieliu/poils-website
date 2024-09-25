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
      <LiquidityPoolSetup/>
    )
  }
  else{
    return (
      <TokenCreate/>
    )
  }
}