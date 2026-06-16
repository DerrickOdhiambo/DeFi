import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "DeFi Real Estate",
  // The project ID is used to identify your app to the WalletConnect cloud service
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "METAMASK_ONLY",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  transports: {
    [mainnet.id]: http("https://cloudflare-eth.com"),
    [polygon.id]: http("https://polygon.llamarpc.com"),
    [optimism.id]: http("https://mainnet.optimism.io"),
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
    [base.id]: http("https://mainnet.base.org"),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
  ssr: false,
});
