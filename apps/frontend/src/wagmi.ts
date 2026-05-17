import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { defineChain } from 'viem';

// Định nghĩa thủ công mạng Oasis Sapphire Testnet
export const oasisSapphireTestnet = defineChain({
  id: 23295,
  name: 'Oasis Sapphire Testnet',
  nativeCurrency: { name: 'Sapphire Testnet ROSE', symbol: 'TEST', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.sapphire.oasis.dev'] },
  },
  blockExplorers: {
    default: { name: 'Oasis Explorer', url: 'https://explorer.testnet.sapphire.oasis.dev' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [oasisSapphireTestnet],
  connectors: [injected()],
  transports: {
    // Sử dụng RPC chính thức và đảm bảo hỗ trợ Sapphire
    [oasisSapphireTestnet.id]: http('https://testnet.sapphire.oasis.dev'),
  },
});

