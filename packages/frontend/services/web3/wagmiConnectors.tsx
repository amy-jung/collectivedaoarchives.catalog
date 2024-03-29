import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { optimism } from "viem/chains";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

/**
 * Chains for the app
 */
export const { chains, publicClient } = configureChains([optimism], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "Collective DAO Archives Catalog",
  // ToDo. Use official project id if we want to use wallet connect.
  projectId: "b6f31325a056c9d98d9e71f86f220a48",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
