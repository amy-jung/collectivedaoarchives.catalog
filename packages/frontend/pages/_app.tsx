import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { chains, wagmiConfig } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <NextNProgress color="#36456C" options={{ showSpinner: false }} />
        <div className={`flex flex-col min-h-screen ${inter.className}`}>
          <Header />
          <main className="relative flex flex-col flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
        <Toaster />
        <Analytics />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
