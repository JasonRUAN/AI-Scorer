"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [monadTestnet],
        transports: {
            // RPC URL for each chain
            [monadTestnet.id]: http(`https://testnet-rpc.monad.xyz/`),
        },

        // Required API Keys
        walletConnectProjectId:
            process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

        // Required App Info
        appName: "AI-Scorer",

        // // Optional App Info
        // appDescription: "Your App Description",
        // appUrl: "https://family.co", // your app's url
        // appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

// https://docs.family.co/connectkit/getting-started#getting-started-section-3-implementation
