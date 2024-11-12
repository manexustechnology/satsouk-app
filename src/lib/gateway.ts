import { GatewayQuoteParams, GatewaySDK } from "@gobob/bob-sdk";
import { isBitcoinWallet } from "@dynamic-labs/bitcoin";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";

const gatewaySDK = new GatewaySDK("bob"); // or "bob-sepolia"

export const doOrder = async (
  fromToken: string,
  fromChain: string,
  fromUserAddress: string,
  toUserAddress: string,
  amount: number = 0
) => {
  const { primaryWallet } = useDynamicContext();
  const { address: btcAddress, connector } = useAccount();

  if (!connector) throw new Error("No connector available");
  if (!btcAddress) throw new Error("BTC address not available");

  if (!primaryWallet as any || !isBitcoinWallet(primaryWallet as any)) {
    throw new Error("Primary wallet is not a valid Bitcoin wallet");
  }

  const address = await primaryWallet!.address;

  const quoteParams: GatewayQuoteParams = {
    fromToken,
    fromChain,
    fromUserAddress,
    toChain: "BOB",
    toUserAddress: address,
    toToken: "tBTC",
    amount,
    gasRefill: 10000,
  };

  const quote = await gatewaySDK.getQuote(quoteParams);
  if (!quote) throw new Error("Failed to retrieve quote");

  const { uuid, psbtBase64 } = await gatewaySDK.startOrder(quote, quoteParams);
  if (!psbtBase64) throw new Error("No PSBT data available");

  const signedPsbt = await primaryWallet!.signMessage(psbtBase64);
  if (!signedPsbt) throw new Error("Failed to sign PSBT");

  await gatewaySDK.finalizeOrder(uuid, signedPsbt);

  return { uuid, status: "Order completed" };
};
