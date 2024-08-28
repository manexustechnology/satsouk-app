import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      viaIR: true,
    },
  },
  networks: {
    // Local
    hardhat: {
      forking: {
        url: "https://testnet.rpc.gobob.xyz", // BOB Testnet RPC
      },
      accounts: [
        {
          privateKey: vars.get("WALLET_PRIVATE_KEY"),
          balance: "1000000000000000000000000", // 100 BOB
        },
      ],
    },
    // Bob Testnet
    bob_testnet: {
      url: "https://testnet.rpc.gobob.xyz", // BOB Testnet RPC
      accounts: [vars.get("WALLET_PRIVATE_KEY")],
    },
  },
};

export default config;
