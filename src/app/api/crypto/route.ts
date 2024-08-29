import { NextResponse } from "next/server";
import axios from "axios";
import { featureFlag } from "@/utils/feature-flag";
import {
  bettingContractAddress,
  bobMainnet,
  bobSepoliaTestnet,
} from "@/config/network";
import { bettingContractAbi } from "../../../../contracts/main";
import { Contract, formatEther, JsonRpcProvider } from "ethers";

// const COINMARKETCAP_API_URL =
//   "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
// const API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY || "";

// export async function GET(request: Request) {
//   const url = new URL(request.url);
//   const cryptoSymbol = url.searchParams.get("symbol"); // Use 'symbol' instead of 'ids'
//   const vsCurrency = url.searchParams.get("vs_currency") || "USD";

//   if (!cryptoSymbol) {
//     return NextResponse.json(
//       { error: "Invalid cryptocurrency symbol" },
//       { status: 400 }
//     );
//   }

//   try {
//     const response = await axios.get(COINMARKETCAP_API_URL, {
//       headers: {
//         "X-CMC_PRO_API_KEY": API_KEY,
//         Accept: "application/json",
//       },
//       params: {
//         symbol: cryptoSymbol.toUpperCase(), // Symbol should be in uppercase
//         convert: vsCurrency.toUpperCase(),
//       },
//     });

//     // Check if the symbol exists in the response data
//     const cryptoData = response.data.data[cryptoSymbol.toUpperCase()];

//     if (cryptoData && cryptoData[0]) {
//       return NextResponse.json(
//         cryptoData[0].quote[vsCurrency.toUpperCase()].price
//       );
//     } else {
//       return NextResponse.json(
//         { error: "Cryptocurrency not found" },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error("Error fetching cryptocurrency price:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch cryptocurrency price" },
//       { status: 500 }
//     );
//   }
// }

const activeChain = featureFlag("NEXT_PUBLIC_USE_BOB_MAINNET")
  ? bobMainnet
  : bobSepoliaTestnet;

console.log("activeChain", featureFlag("NEXT_PUBLIC_USE_BOB_MAINNET"));

const ethProxyAddress = String(process.env.NEXT_PUBLIC_API3_ETH_PROXY_ADDRESS);

const provider = new JsonRpcProvider(activeChain.rpcUrls.default.http[0]);

export async function GET(request: Request) {
  try {
    const bettingContract = new Contract(
      bettingContractAddress as `0x${string}`,
      bettingContractAbi,
      provider
    );

    const dataFeed = await bettingContract.readOraclePriceDataFeed(
      ethProxyAddress
    );

    if (dataFeed && dataFeed[0]) {
      return NextResponse.json(
        Number(formatEther((dataFeed[0] as bigint).toString()))
      );
    } else {
      return NextResponse.json(
        { error: "Cryptocurrency not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching cryptocurrency price:", error);
    return NextResponse.json(
      { error: "Failed to fetch cryptocurrency price" },
      { status: 500 }
    );
  }
}
