import { GetToken, TokenItem } from "@/api/wallet/token";
import { API_CODE } from "@/constants/auth";
import { formatDelimiter } from "@/utils/system/formatNumber";
import {
  getCurrentWalletId,
  getWalletAccounts,
} from "@/utils/wallet/wallet-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// 扩展的 TokenItem，支持多链合并
export interface MergedTokenItem extends TokenItem {
  chains: string[]; // 该代币所在的链列表
  originalTokens: TokenItem[]; // 原始代币列表，用于保留详细信息
}

// 认证上下文类型定义
interface HomeContextType {
  totalTokenList: MergedTokenItem[];
  totalValue: string;
  getAllWallets: () => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

/**
 * 合并多链代币：将相同 symbol 的代币合并成一个
 */
function mergeTokens(tokens: TokenItem[]): MergedTokenItem[] {
  const tokenMap = new Map<string, MergedTokenItem>();

  tokens.forEach((token) => {
    const key = token.symbol.toLowerCase(); // 使用 symbol 作为合并键
    const existing = tokenMap.get(key);

    if (existing) {
      // 如果已存在相同 symbol 的代币，合并它们
      existing.balance += token.balance;
      existing.total_value_usd += token.total_value_usd;
      // 更新 unit_price_usd 为加权平均价格（基于总价值加权）
      const totalValue = existing.total_value_usd;
      const totalBalance = existing.balance;
      existing.unit_price_usd =
        totalBalance > 0 ? totalValue / totalBalance : existing.unit_price_usd;
      // 添加链信息（如果不在列表中）
      if (!existing.chains.includes(token.chain)) {
        existing.chains.push(token.chain);
      }
      // 保留原始代币信息
      existing.originalTokens.push(token);
      // 保留第一个有效的 logo
      if (!existing.logo_url && token.logo_url) {
        existing.logo_url = token.logo_url;
      }
      // 更新地址为第一个地址（或可以使用主地址）
      if (!existing.address) {
        existing.address = token.address;
      }
    } else {
      // 创建新的合并代币
      tokenMap.set(key, {
        ...token,
        chains: [token.chain],
        originalTokens: [token],
      });
    }
  });

  return Array.from(tokenMap.values());
}

/**
 * 首页上下文提供者
 * 负责首页数据的维护、持久化以及初始化加载
 */
export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [allTokens, setAllTokens] = useState<TokenItem[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);

  const getAllWallets = useCallback(async () => {
    try {
      console.log("getAllWallets----");
      const currentWalletId = await getCurrentWalletId();
      if (!currentWalletId) return;

      const walletAccounts = await getWalletAccounts(currentWalletId);

      // 收集所有需要获取 token 的任务
      // 支持一个账户同时请求多个链
      const tokenTasks: Promise<{
        tokens: TokenItem[];
        total_usd_value: number;
      }>[] = [];

      walletAccounts.forEach((account) => {
        const chains: ("evm" | "tron")[] = [];
        const addresses: string[] = [];

        // 收集该账户的所有链和地址
        if (account.evm) {
          chains.push("evm");
          addresses.push(account.evm.address);
        }
        if (account.tron) {
          chains.push("tron");
          addresses.push(account.tron.address);
        }

        // 如果账户有多个链，分别请求每个链
        // 如果 API 支持一次请求多个链，可以优化为一次请求
        chains.forEach((chain, index) => {
          const address = addresses[index];
          tokenTasks.push(
            GetToken({
              address,
              chain_ids: chain,
            })
              .then((res) => {
                // 拦截器已经处理过响应，成功时返回的是 data 对象
                // res 的结构是 { tokens: TokenItem[], total_usd_value: number }
                console.log("res----getToken----", res);
                return {
                  tokens: res.tokens || [],
                  total_usd_value: res.total_usd_value || 0,
                };
              })
              .catch((error: any) => {
                // 处理业务错误，对于某些错误可以静默处理
                // 拦截器抛出的业务错误结构: { isBusinessError: true, code, msg, data }
                if (error?.isBusinessError) {
                  const errorCode = error.code;
                  const errorMsg = error.msg || "未知错误";

                  // 对于地址无效、链不支持等错误，静默处理（不抛出错误）
                  // 这样其他链的请求可以继续
                  if (
                    errorCode === API_CODE.INVALID_ADDRESS ||
                    errorCode === API_CODE.UNSUPPORTED_CHAIN ||
                    errorCode === API_CODE.CHAIN_IS_REQUIRED
                  ) {
                    console.warn(
                      `获取 ${chain} 链代币失败 (${errorMsg}): ${address}`
                    );
                    // 返回空数据，不抛出错误
                    return {
                      tokens: [],
                      total_usd_value: 0,
                    };
                  }

                  // 其他业务错误仍然抛出，但使用更友好的错误信息
                  throw new Error(
                    `获取 ${chain} 链代币失败: ${errorMsg} (地址: ${address})`
                  );
                }

                // 非业务错误（如网络错误）直接抛出
                const errorMsg = error?.message || error?.msg || "网络错误";
                throw new Error(
                  `获取 ${chain} 链代币失败: ${errorMsg} (地址: ${address})`
                );
              })
          );
        });
      });

      // 并行执行所有请求并收集结果（使用 allSettled 确保即使部分失败也能继续）
      const results = await Promise.allSettled(tokenTasks);

      // 收集所有成功的结果
      const collectedTokens: TokenItem[] = [];
      let collectedTotal = 0;

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const { tokens, total_usd_value } = result.value;
          collectedTokens.push(...tokens);
          collectedTotal += total_usd_value;
        } else if (result.status === "rejected") {
          console.error("获取代币列表失败:", result.reason);
        }
      });

      // 一次性更新状态，避免多次渲染和竞争条件
      setAllTokens(collectedTokens);
      setTotalValue(collectedTotal);
    } catch (error) {
      console.error("获取钱包列表失败:", error);
      // 发生错误时重置状态
      setAllTokens([]);
      setTotalValue(0);
    }
  }, []);

  useEffect(() => {
    getAllWallets();
  }, [getAllWallets]);

  // 合并多链代币（相同 symbol 的代币合并）
  const totalTokenList = useMemo(() => {
    return mergeTokens(allTokens);
  }, [allTokens]);

  const formattedTotalValue = useMemo(() => {
    return formatDelimiter(totalValue, {
      precision: 2,
      prefix: "$",
      suffix: "",
      pad: true,
    });
  }, [totalValue]);

  return (
    <HomeContext.Provider
      value={{
        totalTokenList,
        totalValue: formattedTotalValue,
        getAllWallets,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

/**
 * 便捷 Hook 用于在组件中访问认证状态
 */
export function useHome() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHome 必须在 HomeProvider 内部使用");
  }
  return context;
}
