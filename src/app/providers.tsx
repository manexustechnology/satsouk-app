'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { ChakraProvider } from '@chakra-ui/react'
import { chakraTheme } from './chakra-theme'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { wagmiConfig } from '@/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { CryptoProvider } from '@/context/CryptoContext'
import { DisclaimerProvider } from '@/context/DisclaimerContext'
import { DynamicContextProvider, DynamicUserProfile, DynamicWagmiConnector, EthereumWalletConnectors } from '@/lib/dynamic'
import { GlobalWalletExtension } from "@dynamic-labs/global-wallet";
import { dynamicConstants } from '@/constants/dynamic'
import { dynamicBobMainnet, dynamicBobSepoliaTestnet } from '@/config/network'
import { featureFlag } from '@/utils/feature-flag'
import { TelegramProvider } from '@/context/TelegramContext'

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const dynamicActiveChain = featureFlag("NEXT_PUBLIC_USE_BOB_MAINNET")
    ? dynamicBobMainnet
    : dynamicBobSepoliaTestnet;
  const evmNetworks = [dynamicActiveChain]

  return (
    <DynamicContextProvider
      theme='dark'
      settings={{
        environmentId: dynamicConstants.environmentId,
        walletConnectors: [EthereumWalletConnectors],
        walletConnectorExtensions: [GlobalWalletExtension],
        overrides: { evmNetworks: evmNetworks as any }
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <TelegramProvider>
              <ChakraProvider theme={chakraTheme}>
                <AntdRegistry>
                  <CryptoProvider>
                    <DisclaimerProvider>
                      {children}
                      <DynamicUserProfile variant='modal' />
                    </DisclaimerProvider>
                  </CryptoProvider>
                </AntdRegistry>
              </ChakraProvider>
            </TelegramProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}