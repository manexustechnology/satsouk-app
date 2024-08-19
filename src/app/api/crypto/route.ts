import { NextResponse } from "next/server";
import axios from "axios";

const COINMARKETCAP_API_URL =
  "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
const API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY || "";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cryptoSymbol = url.searchParams.get("symbol"); // Use 'symbol' instead of 'ids'
  const vsCurrency = url.searchParams.get("vs_currency") || "USD";

  if (!cryptoSymbol) {
    return NextResponse.json(
      { error: "Invalid cryptocurrency symbol" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(COINMARKETCAP_API_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
        Accept: "application/json",
      },
      params: {
        symbol: cryptoSymbol.toUpperCase(), // Symbol should be in uppercase
        convert: vsCurrency.toUpperCase(),
      },
    });

    // Check if the symbol exists in the response data
    const cryptoData = response.data.data[cryptoSymbol.toUpperCase()];

    if (cryptoData && cryptoData[0]) {
      return NextResponse.json(
        cryptoData[0].quote[vsCurrency.toUpperCase()].price
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
