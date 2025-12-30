/**
 * 多链管理上下文
 * 管理当前选择的链和链切换逻辑
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { EVM_CHAINS, EVMChainId } from "../utils/chains/evm-chains";

import { TronWeb } from "tronweb";
export type ChainType = "evm" | "solana" | "txron";

export interface Chain {
  type: ChainType;
  id: EVMChainId;
  name: string;
  symbol: string;
  chainId?: number; // EVM 链的 chainId
  rpcUrl?: string; // RPC URL
}
const RPC_URL = "https://nile.trongrid.io";
const API_KEY = "b628508e-ed59-41bb-b01d-0704829c16bd";
const CURRENT_CHAIN_KEY = "@current_chain";

// 默认链配置
const DEFAULT_CHAIN: Chain = {
  type: "evm",
  id: "ETHEREUM",
  name: "Ethereum",
  symbol: "ETH",
  chainId: EVM_CHAINS.ETHEREUM.chainId,
  rpcUrl: EVM_CHAINS.ETHEREUM.rpcUrl,
};
// const DEFAULT_CHAIN: Chain = {
//   type: "txron",
//   id: "TETRON_TESTNET",
//   name: "Tetron Testnet",
//   symbol: "TXR",
//   chainId: EVM_CHAINS.TETRON_TESTNET.chainId,
//   rpcUrl: EVM_CHAINS.TETRON_TESTNET.rpcUrl,
// };

// 所有可用链
export const AVAILABLE_CHAINS: Chain[] = [
  {
    type: "evm",
    id: "ETHEREUM",
    name: "Ethereum",
    symbol: "ETH",
    chainId: EVM_CHAINS.ETHEREUM.chainId,
    rpcUrl: EVM_CHAINS.ETHEREUM.rpcUrl,
  },
  {
    type: "evm",
    id: "BSC",
    name: "Binance Smart Chain",
    symbol: "BNB",
    chainId: EVM_CHAINS.BSC.chainId,
    rpcUrl: EVM_CHAINS.BSC.rpcUrl,
  },
  {
    type: "evm",
    id: "SEPOLIA",
    name: "Sepolia Testnet",
    symbol: "ETH",
    chainId: EVM_CHAINS.SEPOLIA.chainId,
    rpcUrl: EVM_CHAINS.SEPOLIA.rpcUrl,
  },

  {
    type: "txron",
    id: "TETRON_TESTNET",
    name: "Tetron Testnet",
    symbol: "TXR",
    chainId: EVM_CHAINS.TETRON_TESTNET.chainId,
    rpcUrl: EVM_CHAINS.TETRON_TESTNET.rpcUrl,
  },
];

interface MultiChainContextType {
  currentChain: Chain;
  availableChains: Chain[];
  switchChain: (chain: Chain) => Promise<void>;
  getChainById: (id: string) => Chain | undefined;
  tronWebProvider: TronWeb;
}

const MultiChainContext = createContext<MultiChainContextType | undefined>(
  undefined
);

export function MultiChainProvider({ children }: { children: ReactNode }) {
  const [currentChain, setCurrentChain] = useState<Chain>(DEFAULT_CHAIN);
  const tronWebProvider = new TronWeb({
    fullHost: RPC_URL,
    headers: { "TRON-PRO-API-KEY": API_KEY },
  });
  // 加载保存的链配置
  useEffect(() => {
    const loadSavedChain = async () => {
      try {
        const savedChainData = await AsyncStorage.getItem(CURRENT_CHAIN_KEY);
        if (savedChainData) {
          const savedChain = JSON.parse(savedChainData) as Chain;
          // 验证链是否仍然可用
          const chain = AVAILABLE_CHAINS.find(
            (c) => c.type === savedChain.type && c.id === savedChain.id
          );
          if (chain) {
            // setCurrentChain(chain);
          }
        }
      } catch (error) {
        console.error("[MultiChainContext] Error loading saved chain:", error);
      }
    };

    loadSavedChain();
  }, []);

  const switchChain = async (chain: Chain) => {
    try {
      setCurrentChain(chain);
      // 保存到 AsyncStorage
      await AsyncStorage.setItem(CURRENT_CHAIN_KEY, JSON.stringify(chain));
      console.log("[MultiChainContext] Chain switched to:", chain);
    } catch (error) {
      console.error("[MultiChainContext] Error switching chain:", error);
      throw error;
    }
  };

  const getChainById = (id: string): Chain | undefined => {
    return AVAILABLE_CHAINS.find((chain) => chain.id === id);
  };

  return (
    <MultiChainContext.Provider
      value={{
        currentChain,
        availableChains: AVAILABLE_CHAINS,
        switchChain,
        tronWebProvider,
        getChainById,
      }}
    >
      {children}
    </MultiChainContext.Provider>
  );
}

export function useMultiChain() {
  const context = useContext(MultiChainContext);
  if (!context) {
    throw new Error("useMultiChain must be used within a MultiChainProvider");
  }
  return context;
}
