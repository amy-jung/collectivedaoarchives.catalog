import type { AppProps } from "next/app";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { Header } from "~~/components/Header";
import { chains, wagmiConfig } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="relative flex flex-col flex-1">
            <Component {...pageProps} />
          </main>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
