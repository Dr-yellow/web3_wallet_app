/**
 * EVM 链配置
 * 支持 Ethereum、BSC 等 EVM 兼容链
 */

export const EVM_CHAINS = {
  ETHEREUM: {
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    rpcUrl: "https://eth.llamarpc.com",
    blockExplorer: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  BSC: {
    chainId: 56,
    name: "Binance Smart Chain",
    symbol: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org",
    blockExplorer: "https://bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  SEPOLIA: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    symbol: "ETH",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    blockExplorer: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  BSC_TESTNET: {
    chainId: 97,
    name: "BSC Testnet",
    symbol: "BNB",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    blockExplorer: "https://testnet.bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  TETRON_TESTNET: {
    chainId: 97053,
    name: "Tetron Testnet",
    symbol: "TXR",
    rpcUrl: "https://nile.trongrid.io",
    blockExplorer: "https://testnet.tetronscan.io",
    nativeCurrency: {
      name: "Tetron",
      symbol: "TXR",
      decimals: 18,
    },
  },
} as const;

export type EVMChainId = keyof typeof EVM_CHAINS;

export function getEVMChain(
  chainId: number
): (typeof EVM_CHAINS)[keyof typeof EVM_CHAINS] | null {
  for (const chain of Object.values(EVM_CHAINS)) {
    if (chain.chainId === chainId) {
      return chain;
    }
  }
  return null;
}

export function getEVMChainById(
  chainId: EVMChainId
): (typeof EVM_CHAINS)[EVMChainId] {
  return EVM_CHAINS[chainId];
}
