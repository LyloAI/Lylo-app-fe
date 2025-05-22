"use client";

import { Provider } from "react-redux";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { wallets, endpoint } from "@/logic/solwalletadapter/config";
import { config } from "@/logic/wagmi/config";
import { store } from "@/store";

export default function Providers({ children }) {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  );
}
