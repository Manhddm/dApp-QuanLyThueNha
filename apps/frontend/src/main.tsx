import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { mainnet, hardhat } from "wagmi/chains";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet, hardhat],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [hardhat.id]: http(),
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
