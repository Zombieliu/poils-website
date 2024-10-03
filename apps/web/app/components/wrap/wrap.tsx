"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Switch } from "@repo/ui/components/ui/switch";
import { useAtom } from "jotai";
import { init_obelisk_client, obelisk_client } from "../../jotai/obelisk";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  DevInspectResults,
  Transaction,
  TransactionArgument,
} from "@0xobelisk/sui-client";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { toast } from "sonner";
import { ASSETS_ID, WRAPPER_ID } from "../../chain/config";
import { CoinStruct } from "@0xobelisk/sui-client";

// Token logo components
const EthLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
        <path d="M16.498 4L9 16.22l7.498-3.35z" />
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
        <path d="M16.498 27.995v-6.028L9 17.616z" />
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z" />
      </g>
    </g>
  </svg>
);

const UsdtLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        fill="#FFF"
        d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"
      />
    </g>
  </svg>
);

const DaiLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#F4B731" />
      <path
        d="M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z"
        fill="#FFF"
      />
    </g>
  </svg>
);

export default function TokenWrapper() {
  const account = useCurrentAccount();
  const [isWrap, setIsWrap] = useState(true);
  const [sourceToken, setSourceToken] = useState("");
  const [targetToken, setTargetToken] = useState("");
  const [amount, setAmount] = useState("");
  const [coins, setCoins] = useState({ data: [] });
  const [coins_metadata, setCoinsMetadata] = useState([]);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState("");
  const [assetMetadata, setAssetMetadata] = useState<any[]>([]);

  useEffect(() => {
    const getCoins = async () => {
      try {
        const obelisk = await init_obelisk_client();
        const coinsData = await obelisk.suiInteractor.currentClient.getCoins({
          owner: account?.address,
        });
        console.log("Fetched coins data:", coinsData);
        setCoins(coinsData);

        const uniqueCoinTypes = [
          ...new Set(coinsData.data.map((coin) => coin.coinType)),
        ];
        const metadataPromises = uniqueCoinTypes.map((coinType) =>
          obelisk.suiInteractor.currentClient.getCoinMetadata({ coinType }),
        );
        const metadataResults = await Promise.all(metadataPromises);
        console.log("Fetched metadata:", metadataResults);
        setCoinsMetadata(metadataResults);
      } catch (error) {
        console.error("Error fetching coins data:", error);
        toast.error("Failed to fetch coins data");
      }
    };
    if (account?.address) {
      getCoins();
    }
  }, [account?.address]);

  useEffect(() => {
    const getWrapCoins = async () => {
      const obelisk = await init_obelisk_client();
      let tx = new Transaction();
      const wrapper = tx.object(WRAPPER_ID);
      const assets = tx.object(ASSETS_ID);
      let params: TransactionArgument[] = [wrapper, assets];
      let query_wrap_token_list =
        (await obelisk.query.wrapper_system.wrapped_assets(
          tx,
          params,
        )) as DevInspectResults;
      let wrap_token_list = obelisk.view(query_wrap_token_list)[0];

      const assetPromises = wrap_token_list.map(async (assetId: number) => {
        let tx2 = new Transaction();
        let assets = tx2.object(ASSETS_ID);
        let asset_id = tx2.pure.u32(assetId);

        let metadataParams: TransactionArgument[] = [assets, asset_id];
        let asset_metadata = (await obelisk.query.assets_system.metadata_of(
          tx2,
          metadataParams,
        )) as DevInspectResults;

        // Create a new Transaction for balance query
        let tx3 = new Transaction();
        let assets3 = tx3.object(ASSETS_ID);
        let asset_id3 = tx3.pure.u32(assetId);

        // Fetch balance
        let balanceParams: TransactionArgument[] = [
          assets3,
          asset_id3,
          tx3.pure.address(account?.address),
        ];
        let balance_query = (await obelisk.query.assets_system.balance_of(
          tx3,
          balanceParams,
        )) as DevInspectResults;

        return {
          id: assetId,
          metadata: obelisk.view(asset_metadata),
          balance: obelisk.view(balance_query),
        };
      });
      const assetResults = await Promise.all(assetPromises);
      setAssetMetadata(assetResults);
      console.log("assetResults", assetResults);
    };
    getWrapCoins();
  }, []);

  const internalTokens = [
    { value: "PETH", label: "PETH", logo: <EthLogo /> },
    { value: "PUSDT", label: "PUSDT", logo: <UsdtLogo /> },
    { value: "PDAI", label: "PDAI", logo: <DaiLogo /> },
  ];

  // Updated sourceTokens calculation
  const sourceTokens = useMemo(() => {
    const tokenMap = new Map();

    coins.data.forEach((coin) => {
      const metadata = coins_metadata.find((m) => m.id === coin.coinType);
      const symbol =
        metadata?.symbol || coin.coinType.split("::").pop() || "Unknown";

      if (
        !tokenMap.has(symbol) ||
        BigInt(coin.balance) > BigInt(tokenMap.get(symbol)?.rawBalance || 0)
      ) {
        let iconUrl = metadata?.iconUrl || "default-icon-url.svg";
        if (symbol === "SUI") {
          iconUrl = "https://hop.ag/tokens/SUI.svg";
        }

        // Calculate balance using the correct number of decimal places
        const decimals = metadata?.metadata[4] || 9; // Use metadata[4] for decimals, default to 9 if not available
        const rawBalance = BigInt(coin.balance);
        const balance = Number(rawBalance) / Math.pow(10, decimals);

        tokenMap.set(symbol, {
          value: coin.coinType,
          symbol: symbol,
          balance: balance.toFixed(4), // Format to 4 decimal places for display
          logo: (
            <img
              src={iconUrl}
              alt={symbol}
              width="20"
              height="20"
              style={{ marginRight: "8px" }}
            />
          ),
          rawBalance: coin.balance,
          decimals: decimals,
        });
      }
    });

    return Array.from(tokenMap.values());
  }, [coins.data, coins_metadata]);

  // Updated targetTokens calculation (for wrapping)
  const targetTokens = useMemo(() => {
    return assetMetadata.map((asset) => {
      console.log(`Processing asset:`, asset);

      const rawBalance = BigInt(asset.balance);
      console.log(`Raw balance:`, rawBalance.toString());

      const decimals = asset.metadata[3];
      console.log(`Decimals:`, decimals);

      const scaleFactor = BigInt(10 ** decimals);
      console.log(`Scale factor:`, scaleFactor.toString());

      const scaledBalance = rawBalance * BigInt(10000);
      console.log(`Scaled balance:`, scaledBalance.toString());

      const dividedBalance = scaledBalance / scaleFactor;
      console.log(`Divided balance:`, dividedBalance.toString());

      const finalBalance = Number(dividedBalance) / 10000;
      console.log(`Final balance:`, finalBalance);

      return {
        value: asset.id.toString(),
        symbol: asset.metadata[1],
        balance: finalBalance.toFixed(4),
        logo: (
          <img
            src={asset.metadata[4]}
            alt={asset.metadata[1]}
            width="20"
            height="20"
            style={{ marginRight: "8px" }}
          />
        ),
      };
    });
  }, [assetMetadata]);

  console.log(`Final targetTokens:`, targetTokens);

  // Updated calculation for unwrapping source tokens (with balance)
  const unwrapSourceTokens = useMemo(() => {
    return assetMetadata.map((asset) => ({
      value: asset.id.toString(),
      symbol: asset.metadata[1],
      balance: (
        Number(BigInt(asset.balance)) / Math.pow(10, asset.metadata[3])
      ).toFixed(4),
      logo: (
        <img
          src={asset.metadata[4]}
          alt={asset.metadata[1]}
          width="20"
          height="20"
          style={{ marginRight: "8px" }}
        />
      ),
    }));
  }, [assetMetadata]);

  // Swap tokens when isWrap changes
  useEffect(() => {
    setSourceToken("");
    setTargetToken("");
  }, [isWrap]);

  const handleWrapToggle = (checked: boolean) => {
    setIsWrap(checked);
    // 清空选择，防止用户混淆
    setSourceToken("");
    setTargetToken("");
  };

  // Updated currentSourceTokens and currentTargetTokens
  const currentSourceTokens = useMemo(() => {
    return isWrap ? sourceTokens : unwrapSourceTokens;
  }, [isWrap, sourceTokens, unwrapSourceTokens]);

  const currentTargetTokens = useMemo(() => {
    if (isWrap) {
      return assetMetadata.map((asset) => ({
        value: asset.id.toString(),
        symbol: asset.metadata[1],
        balance: (
          Number(BigInt(asset.balance)) / Math.pow(10, asset.metadata[3])
        ).toFixed(4),
        logo: (
          <img
            src={asset.metadata[4]}
            alt={asset.metadata[1]}
            width="20"
            height="20"
            style={{ marginRight: "8px" }}
          />
        ),
      }));
    } else {
      return sourceTokens.map((token) => ({
        ...token,
        balance: token.balance, // Use the original balance from sourceTokens
      }));
    }
  }, [isWrap, assetMetadata, sourceTokens]);

  useEffect(() => {
    if (isWrap) {
      setSourceToken(sourceTokens[0]?.value || "");
      setTargetToken(currentTargetTokens[0]?.value || "");
    } else {
      setSourceToken(currentSourceTokens[0]?.value || "");
      setTargetToken(currentTargetTokens[0]?.value || "");
    }
  }, [isWrap, sourceTokens, currentSourceTokens, currentTargetTokens]);

  const handleWrap = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("wrap");

    const obelisk = await init_obelisk_client();

    // Ensure amount is a valid number
    const amountToWrap = parseFloat(amount);
    if (isNaN(amountToWrap) || amountToWrap <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid positive number.",
      });
      return;
    }

    // Ensure source and target tokens are selected
    if (!sourceToken || !targetToken) {
      toast.error("Tokens not selected", {
        description: "Please select both source and target tokens.",
      });
      return;
    }

    // Find the selected source and target tokens
    const selectedSourceToken = currentSourceTokens.find(
      (token) => token.value === sourceToken,
    );
    const selectedTargetToken = currentTargetTokens.find(
      (token) => token.value === targetToken,
    );

    if (!selectedSourceToken || !selectedTargetToken) {
      toast.error("Token selection error", {
        description: "Unable to find the selected tokens.",
      });
      return;
    }
    // Check if the token names are consistent (ignoring the 'P' prefix for wrapped tokens)
    const sourceTokenName = selectedSourceToken.symbol.replace(/^P/, "");
    const targetTokenName = selectedTargetToken.symbol.replace(/^P/, "");

    if (sourceTokenName !== targetTokenName) {
      toast.error("Token mismatch", {
        description:
          "Source and target tokens must be the same type for wrapping.",
      });
      return;
    }

    // Check if the user has sufficient balance
    if (parseFloat(selectedSourceToken.balance) < amountToWrap) {
      toast.error("Insufficient balance", {
        description: `You don't have enough balance in the selected ${selectedSourceToken.symbol} token.`,
      });
      return;
    }

    try {
      // Implement the actual wrapping logic here
      // This is a placeholder for the actual implementation

      // console.log("sourceToken", sourceToken);
      // let tx = new Transaction();
      // const [coin] = tx.splitCoins(tx.gas,[100]);
      // console.log("coin", coin);

      // Calculate the amount based on the decimals in metadata
      const selectedAssetMetadata =
        await obelisk.suiInteractor.currentClient.getCoinMetadata({
          coinType: sourceToken,
        });
      const decimals = selectedAssetMetadata.decimals;

      let tx = new Transaction();
      // tx.setGasBudget(1000000000);
      let wrapper = tx.object(WRAPPER_ID);
      let assets = tx.object(ASSETS_ID);
      let beneficiary = tx.pure.address(account?.address);

      console.log("selectedSourceToken.value", selectedSourceToken.value);

      const amountInSmallestUnit = Math.floor(amountToWrap * 10 ** decimals);
      console.log("amountInSmallestUnit", amountInSmallestUnit);

      const selectCoins = await obelisk.selectCoinsWithAmount(
        amountInSmallestUnit,
        // selectedSourceToken.value,
        "0x2::sui::SUI",
        account?.address,
      );
      console.log("account?.address", account?.address);
      console.log("amountToWrap", amountToWrap);

      // console.log("selectCoins", selectCoins[0]);
      // // const bidding_amount = tx.pure.u64(BigInt(Math.floor(amountToWrap * decimals)));
      const bidding_amount = tx.pure.u64(
        Math.floor(amountToWrap * 10 ** decimals),
      );
      // console.log("bidding_amount", bidding_amount);
      const [coin] = tx.splitCoins(tx.object(selectCoins[0]), [bidding_amount]);
      // console.log("coin", coin);
      let params: TransactionArgument[] = [wrapper, assets, coin, beneficiary];
      // console.log("sourceToken", sourceToken);
      // // let typeArguments = [`0x2::coin::Coin<${sourceToken}>`];
      // let typeArguments = [`${sourceToken}`];
      let typeArguments = [`0x2::sui::SUI`];
      // console.log("typeArguments", typeArguments);
      await obelisk.tx.wrapper_system.wrap(tx, params, typeArguments, true);

      await signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
          chain: `sui:testnet`,
        },
        {
          onSuccess: (result) => {
            console.log("executed transaction", result);
            toast("Translation Successful", {
              description: new Date().toUTCString(),
              action: {
                label: "Check in Explorer",
                onClick: () =>
                  window.open(
                    `https://testnet.suivision.xyz/txblock/${result.digest}`,
                    "_blank",
                  ),
              },
            });
            setDigest(result.digest);
          },
          onError: (error) => {
            console.log("executed transaction", error);
          },
        },
      );
      // Reset the amount after successful wrap
      setAmount("");
    } catch (error) {
      console.error("Error executing transaction:", error);
      toast.error("Transaction Failed", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  // let tx = new Transaction();
  // let wrapper = tx.object(WRAPPER_ID),
  // let assets = tx.object(ASSETS_ID),
  // let coin =
  // let beneficiary = account?.address

  // let params: TransactionArgument[] = [
  //   wrapper,
  //   assets
  //   ];
  // await obelisk.tx.wrapper_system.wrap(tx, params, undefined, true);
  // 确保 amount 是一个有效的数字
  // const amountToSplit = parseInt(amount);
  // if (isNaN(amountToSplit) || amountToSplit <= 0) {
  //   toast.error("Invalid amount", {
  //     description: "Please enter a valid positive number.",
  //   });
  //   return;
  // }

  // // 确保用户选择了 Source Token
  // if (!sourceToken) {
  //   toast.error("Source Token not selected", {
  //     description: "Please select a source token.",
  //   });
  //   return;
  // }

  // try {
  //   let tx = new Transaction();

  //   // 从 coins 数组中找到用户选择的 coin
  //   const selectedCoin = coins.data.find(coin =>
  //     coin.coinType.toLowerCase() === sourceToken.toLowerCase()
  //   );

  //   if (!selectedCoin) {
  //     console.log("All available coins:", coins.data.map(c => c.coinType));
  //     toast.error("Selected coin not found", {
  //       description: `Unable to find the selected ${sourceToken} coin.`,
  //     });
  //     return;
  //   }

  //   // 检查选择的 coin 是否有足够的余额
  //   if (BigInt(selectedCoin.balance) < BigInt(amountToSplit)) {
  //     toast.error("Insufficient balance", {
  //       description: `You don't have enough balance in the selected ${sourceToken} coin.`,
  //     });
  //     return;
  //   }

  //   // 拆分选定的 coin
  //   // const [coin] = tx.splitCoins(selectedCoin.coinObjectId, [amountToSplit]);

  //   // tx.transferObjects([coin], '0xbb3e90c52cb585aeb926edb6fb3d01146d47e96d9692394bd9d691ce1b0bd693');

  //   const [coin] = tx.splitCoins(tx.gas, [200000000]);

  //   // transfer the split coin to a specific address
  //   tx.transferObjects([coin], '0xbb3e90c52cb585aeb926edb6fb3d01146d47e96d9692394bd9d691ce1b0bd693');

  //   const result = await signAndExecuteTransaction(
  //     {
  //       transaction: tx.serialize(),
  //       chain: `sui:testnet`,
  //     },
  //     {
  //       onSuccess: (result) => {
  //         console.log('executed transaction', result);
  //         toast.success("Transaction Successful", {
  //           description: `Wrapped ${amountToSplit} ${sourceToken} tokens at ${new Date().toUTCString()}`,
  //           action: {
  //             label: "Check in Explorer",
  //             onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${result.digest}`, "_blank"),
  //           },
  //         });
  //         setDigest(result.digest);
  //       },
  //     },
  //   );
  // } catch (error) {
  //   console.error('Error executing transaction:', error);
  //   toast.error("Transaction Failed", {
  //     description: error instanceof Error ? error.message : "An unknown error occurred",
  //   });
  // }
  //};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 p-4">
      <Card className="w-[400px] border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Poils Token Exchange
          </CardTitle>
          <p className="text-sm text-gray-500">Wrap or unwrap tokens</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center justify-between">
              <Label htmlFor="wrap-switch">{isWrap ? "Wrap" : "Unwrap"}</Label>
              <Switch
                id="wrap-switch"
                checked={isWrap}
                onCheckedChange={handleWrapToggle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceToken">Source Token</Label>
              <Select
                onValueChange={(value) => setSourceToken(value)}
                value={sourceToken}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source token" />
                </SelectTrigger>
                <SelectContent>
                  {currentSourceTokens.map((token) => (
                    <SelectItem key={token.value} value={token.value}>
                      <div className="flex items-center">
                        {token.logo}
                        <span>
                          {isWrap ? token.symbol : `P${token.symbol}`} (
                          {token.balance}{" "}
                          {isWrap ? token.symbol : `P${token.symbol}`})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetToken">Target Token</Label>
              <Select
                onValueChange={(value) => setTargetToken(value)}
                value={targetToken}
              >
                <SelectTrigger id="targetToken" className="w-full">
                  <SelectValue placeholder="Select target token" />
                </SelectTrigger>
                <SelectContent>
                  {currentTargetTokens.map((token) => (
                    <SelectItem key={token.value} value={token.value}>
                      <div className="flex items-center">
                        {token.logo}
                        <span>
                          {token.symbol} (
                          {parseFloat(token.balance).toLocaleString(undefined, {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4,
                          })}{" "}
                          {token.symbol})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder={`Enter ${isWrap ? "wrap" : "unwrap"} amount`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button
              type="button"
              onClick={handleWrap}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isWrap ? "Wrap" : "Unwrap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
