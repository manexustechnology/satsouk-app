import { GatewayQuoteParams, GatewaySDK } from "@gobob/bob-sdk";
import { base64 } from "@scure/base";
import { Transaction } from "@scure/btc-signer";

interface bridgeBTCParams {
  bitcoinInterface: any;
  btcAddress: string;
  evmAddress: string;
  amount: number;
}

export const bridgeBTC = async ({
  bitcoinInterface,
  btcAddress,
  evmAddress,
  amount,
}: bridgeBTCParams) => {
  try {
    const gatewaySDK = new GatewaySDK("bob"); // or "bob-sepolia"

    const quoteParams: GatewayQuoteParams = {
      fromChain: "Bitcoin",
      fromToken: "BTC",
      fromUserAddress: btcAddress,
      toChain: "BOB",
      toUserAddress: evmAddress,
      toToken: "tBTC", // or "tBTC"
      amount: 100,
      gasRefill: amount * 10 ** 8 + 1000,
    };
    console.log("quoteParams", quoteParams);

    const quote = await gatewaySDK.getQuote(quoteParams);
    console.log("quote", quote);

    const { uuid, bitcoinAddress, satoshis, opReturnHash } =
      await gatewaySDK.startOrder(quote, quoteParams);

    const { txhash } = await bitcoinInterface.send({
      from: quoteParams.fromUserAddress,
      to: bitcoinAddress,
      value: satoshis.toString(),
      memo: opReturnHash,
    });

    const finalize = await gatewaySDK.finalizeOrder(uuid, txhash);
    console.log("finalize", finalize);
  } catch (error) {
    console.error(error);
  }
};
