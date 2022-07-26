import { Chain } from "@rainbow-me/rainbowkit";

export const skaleTestnet: Chain = {
  id: 132333505628089,
  name: 'Skale Testnet',
  network: 'skaletestnet',
  iconUrl: '/SKALE_logo.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'sFUEL',
    symbol: 'sFUEL',
  },
  rpcUrls: {
    default: 'https://testnet-proxy.skalenodes.com/v1/whispering-turais',
    wss: 'wss://testnet-proxy.skalenodes.com/v1/ws/whispering-turais',
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://whispering-turais.testnet-explorer.skalenodes.com/' },
  },
  testnet: true,
};

export const skaleMainnet: Chain = {
  id: 1032942172,
  name: 'Crypto Rome Network',
  network: 'cryptorome',
  iconUrl: '/SKALE_logo.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'sFUEL',
    symbol: 'sFUEL',
  },
  rpcUrls: {
    default: 'https://mainnet.skalenodes.com/v1/haunting-devoted-deneb',
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com/' },
  },
  testnet: false,
}
