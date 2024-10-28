import { type Chain as ViemChain } from "viem";

export const bobSepoliaTestnet = {
  id: 808813,
  name: "BOB Sepolia (Testnet)",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bob-sepolia.rpc.gobob.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://bob-sepolia.explorer.gobob.xyz",
    },
  },
} as const satisfies ViemChain;

export const dynamicBobSepoliaTestnet = {
  blockExplorerUrls: [bobSepoliaTestnet.blockExplorers.default.url],
  chainId: bobSepoliaTestnet.id,
  chainName: bobSepoliaTestnet.name,
  iconUrls: ["https://docs.gobob.xyz/img/logo-light.svg"],
  name: bobSepoliaTestnet.name,
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  networkId: bobSepoliaTestnet.id,
  rpcUrls: bobSepoliaTestnet.rpcUrls.default.http,
  vanityName: bobSepoliaTestnet.name,
};

export const bobMainnet = {
  id: 60_808,
  name: "BOB Mainnet",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.gobob.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.gobob.xyz",
    },
  },
} as const satisfies ViemChain;

export const dynamicBobMainnet = {
  blockExplorerUrls: [bobMainnet.blockExplorers.default.url],
  chainId: bobMainnet.id,
  chainName: bobMainnet.name,
  iconUrls: ["https://docs.gobob.xyz/img/logo-light.svg"],
  name: bobMainnet.name,
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  networkId: bobMainnet.id,
  rpcUrls: bobMainnet.rpcUrls.default.http,
  vanityName: bobMainnet.name,
};

export const avalanche = {
  id: 43_114,
  name: "Avalanche",
  nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 11_907_934,
    },
  },
} as const satisfies ViemChain;

export const dynamicAvalanche = {
  blockExplorerUrls: [avalanche.blockExplorers.default.url],
  chainId: avalanche.id,
  chainName: avalanche.name,
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png"],
  name: avalanche.name,
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  networkId: avalanche.id,
  rpcUrls: avalanche.rpcUrls.default.http,
  vanityName: avalanche.name,
};

export const bettingContractAddress = process.env
  .NEXT_PUBLIC_BETTING_CONTRACT_ADDRESS as `0x${string}` | undefined;
