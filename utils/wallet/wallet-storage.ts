/**
 * 钱包存储管理
 * 使用 expo-secure-store 存储敏感信息（私钥），AsyncStorage 存储元数据
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const WALLETS_STORAGE_KEY = "@multi_chain_wallets";
const CURRENT_WALLET_KEY = "@current_wallet_id";
const WALLETS_ACCOUNTS_KEY = "@wallets_accounts";
const WALLET_ACCOUNTS_KEY_PREFIX = "@wallet_accounts_";
const ALL_WALLET_IDS_KEY = "@all_wallet_ids";

export interface StoredWallet {
  id: string;
  name: string;
  type: "evm" | "solana" | "multi" | "txron"; // multi 表示同时支持 EVM 和 Solana
  evmWallets?: {
    [chainId: number]: {
      address: string;
      // 私钥存储在 SecureStore 中
    };
  };
  solanaWallet?: {
    publicKey: string; // 注意：publicKey 已经是加密后的数据
  };
  txronWallet?: {
    address: string; // 注意：address 可能包含加密后的 publicKey
  };
  createdAt: number;
  updatedAt: number;
}

/**
 * 保存钱包（敏感信息存储在 SecureStore）
 */
export async function saveWallet(
  walletId: string,
  wallet: StoredWallet,
  privateKeys: {
    evm?: { [chainId: number]: string };
    solana?: Uint8Array;
    txron?: string;
    salt?: string;
    encryptedData?: string;
  }
): Promise<void> {
  try {
    // 保存钱包元数据到 AsyncStorage
    const wallets = await getWallets();
    wallet.updatedAt = Date.now();
    wallets[walletId] = wallet;
    await AsyncStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));

    // 保存私钥到 SecureStore
    if (privateKeys.evm) {
      for (const [chainId, privateKey] of Object.entries(privateKeys.evm)) {
        const key = `wallet_${walletId}_evm_${chainId}`;
        await SecureStore.setItemAsync(key, privateKey);
      }
    }

    if (privateKeys.solana) {
      const key = `wallet_${walletId}_solana`;
      await SecureStore.setItemAsync(
        key,
        JSON.stringify(Array.from(privateKeys.solana))
      );
    }
    if (privateKeys.txron) {
      const key = `wallet_${walletId}_txron`;
      await SecureStore.setItemAsync(key, privateKeys.txron);
    }
  } catch (error) {
    console.error("[wallet-storage] Error saving wallet:", error);
    throw error;
  }
}

/**
 * 获取所有钱包
 */
export async function getWallets(): Promise<{ [id: string]: StoredWallet }> {
  try {
    const data = await AsyncStorage.getItem(WALLETS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("[wallet-storage] Error getting wallets:", error);
    return {};
  }
}

/**
 * 获取钱包私钥（从 SecureStore）
 */
export async function getWalletPrivateKey(
  walletId: string,
  type: "evm" | "solana" | "txron",
  chainId?: number
): Promise<string | Uint8Array | null> {
  try {
    if (type === "evm" && chainId) {
      const key = `wallet_${walletId}_evm_${chainId}`;
      const privateKey = await SecureStore.getItemAsync(key);
      return privateKey;
    } else if (type === "solana") {
      const key = `wallet_${walletId}_solana`;
      const data = await SecureStore.getItemAsync(key);
      return data ? new Uint8Array(JSON.parse(data)) : null;
    } else if (type === "txron") {
      const key = `wallet_${walletId}_txron`;
      const privateKey = await SecureStore.getItemAsync(key);
      return privateKey;
    }
    return null;
  } catch (error) {
    console.error("[wallet-storage] Error getting wallet private key:", error);
    return null;
  }
}

/**
 * 获取钱包信息（不包含私钥）
 */
export async function getWallet(
  walletId: string
): Promise<StoredWallet | null> {
  try {
    const wallets = await getWallets();
    return wallets[walletId] || null;
  } catch (error) {
    console.error("[wallet-storage] Error getting wallet:", error);
    return null;
  }
}

/**
 * 删除钱包
 */
export async function deleteWallet(walletId: string): Promise<void> {
  try {
    // 删除元数据
    const wallets = await getWallets();
    delete wallets[walletId];
    await AsyncStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));

    // 删除所有相关的私钥
    const wallet = await getWallet(walletId);
    if (wallet) {
      // 删除 EVM 私钥
      if (wallet.evmWallets) {
        for (const chainId of Object.keys(wallet.evmWallets)) {
          const key = `wallet_${walletId}_evm_${chainId}`;
          await SecureStore.deleteItemAsync(key).catch(() => {
            // 忽略删除失败的错误
          });
        }
      }

      // 删除 Solana 私钥
      if (wallet.solanaWallet) {
        const key = `wallet_${walletId}_solana`;
        await SecureStore.deleteItemAsync(key).catch(() => {
          // 忽略删除失败的错误
        });
      }
    }
  } catch (error) {
    console.error("[wallet-storage] Error deleting wallet:", error);
    throw error;
  }
}

/**
 * 设置当前钱包
 * @param walletId 钱包ID
 * @param encryptedData 可选的加密数据（助记词加密后的数据）
 * @param salt 可选的盐值（用于加密）
 * @param forceUpdate 是否强制更新加密数据（如果已存在），默认为 false
 */
export async function setCurrentWallet(
  walletId: string,
  encryptedData?: string,
  salt?: string,
  forceUpdate: boolean = false
): Promise<void> {
  try {
    await AsyncStorage.setItem(CURRENT_WALLET_KEY, walletId);

    // 将钱包ID添加到所有钱包ID列表中（如果不存在）
    const allWalletIds = await getAllWalletIds();
    if (!allWalletIds.includes(walletId)) {
      allWalletIds.push(walletId);
      await AsyncStorage.setItem(
        ALL_WALLET_IDS_KEY,
        JSON.stringify(allWalletIds)
      );
    }

    // 如果提供了加密数据和盐值，存储到 SecureStore
    if (encryptedData) {
      const encryptedKey = `wallet_${walletId}_encrypted_data`;

      // 如果 forceUpdate 为 false，检查是否已存在加密数据
      if (!forceUpdate) {
        const existingData = await SecureStore.getItemAsync(encryptedKey);
        if (existingData) {
          console.warn(
            `[wallet-storage] 钱包 ${walletId} 已存在加密数据，跳过更新。如需覆盖，请设置 forceUpdate=true`
          );
          // 不更新已存在的加密数据
        } else {
          // 不存在时才写入
          await SecureStore.setItemAsync(encryptedKey, encryptedData);
        }
      } else {
        // forceUpdate 为 true 时，直接覆盖
        await SecureStore.setItemAsync(encryptedKey, encryptedData);
      }
    }

    if (salt) {
      const saltKey = `wallet_${walletId}_salt`;

      // 如果 forceUpdate 为 false，检查是否已存在盐值
      if (!forceUpdate) {
        const existingSalt = await SecureStore.getItemAsync(saltKey);
        if (existingSalt) {
          console.warn(
            `[wallet-storage] 钱包 ${walletId} 已存在盐值，跳过更新。如需覆盖，请设置 forceUpdate=true`
          );
          // 不更新已存在的盐值
        } else {
          // 不存在时才写入
          await SecureStore.setItemAsync(saltKey, salt);
        }
      } else {
        // forceUpdate 为 true 时，直接覆盖
        await SecureStore.setItemAsync(saltKey, salt);
      }
    }
  } catch (error) {
    console.error("[wallet-storage] Error setting current wallet:", error);
    throw error;
  }
}

/**
 * 获取当前钱包 ID
 */
export async function getCurrentWalletId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(CURRENT_WALLET_KEY);
  } catch (error) {
    console.error("[wallet-storage] Error getting current wallet ID:", error);
    return null;
  }
}

/**
 * 获取所有钱包ID列表
 * @returns 返回所有存储的钱包ID数组
 */
export async function getAllWalletIds(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(ALL_WALLET_IDS_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as string[];
  } catch (error) {
    console.error("[wallet-storage] Error getting all wallet IDs:", error);
    return [];
  }
}

/**
 * 获取当前钱包 ID 和加密数据
 * @returns 返回包含 walletId、encryptedData 和 salt 的对象，如果不存在则返回 null
 */
export async function getCurrentWalletData(): Promise<{
  walletId: string;
  encryptedData: string | null;
  salt: string | null;
} | null> {
  try {
    const walletId = await getCurrentWalletId();

    if (!walletId) {
      return null;
    }

    // 从 SecureStore 获取加密数据和盐值
    const encryptedKey = `wallet_${walletId}_encrypted_data`;
    const saltKey = `wallet_${walletId}_salt`;

    const encryptedData = await SecureStore.getItemAsync(encryptedKey);
    const salt = await SecureStore.getItemAsync(saltKey);

    return {
      walletId,
      encryptedData,
      salt,
    };
  } catch (error) {
    console.error("[wallet-storage] Error getting current wallet data:", error);
    return null;
  }
}

/**
 * 账户与钱包的映射关系
 * 一个 accountId 可以对应多个 walletId
 */
export interface WalletAccountMapping {
  [accountId: string]: string[]; // accountId -> walletIds[]
}

/**
 * 设置钱包账户映射（一个 accountId 可以存储多个 walletId）
 * 如果 accountId 已存在，则追加 walletId（如果不存在）
 * 如果 accountId 不存在，则创建新的映射
 */
export async function setCurrentWalletAccount(
  accountId: string,
  walletId: string
): Promise<void> {
  try {
    const existingData = await getWalletAccountMapping();

    // 如果 accountId 已存在，检查 walletId 是否已在数组中
    if (existingData[accountId]) {
      if (!existingData[accountId].includes(walletId)) {
        existingData[accountId].push(walletId);
      }
    } else {
      // 如果 accountId 不存在，创建新的数组
      existingData[accountId] = [walletId];
    }

    await AsyncStorage.setItem(
      WALLETS_ACCOUNTS_KEY,
      JSON.stringify(existingData)
    );
  } catch (error) {
    console.error(
      "[wallet-storage] Error setting current wallet account:",
      error
    );
    throw error;
  }
}

/**
 * 获取钱包账户映射关系
 */
export async function getWalletAccountMapping(): Promise<WalletAccountMapping> {
  try {
    const data = await AsyncStorage.getItem(WALLETS_ACCOUNTS_KEY);
    if (!data) {
      return {};
    }

    // 兼容旧的数据格式
    const parsed = JSON.parse(data);

    // 如果是旧格式 { accountId: string, walletId: string }
    if (
      parsed.accountId &&
      parsed.walletId &&
      !Array.isArray(parsed[parsed.accountId])
    ) {
      return {
        [parsed.accountId]: [parsed.walletId],
      };
    }

    return parsed as WalletAccountMapping;
  } catch (error) {
    console.error(
      "[wallet-storage] Error getting wallet account mapping:",
      error
    );
    return {};
  }
}

/**
 * 获取指定账户的所有 walletId
 */
export async function getWalletIdsByAccountId(
  accountId: string
): Promise<string[]> {
  try {
    const mapping = await getWalletAccountMapping();
    return mapping[accountId] || [];
  } catch (error) {
    console.error(
      "[wallet-storage] Error getting wallet IDs by account ID:",
      error
    );
    return [];
  }
}

/**
 * 从账户中移除指定的 walletId
 */
export async function removeWalletFromAccount(
  accountId: string,
  walletId: string
): Promise<void> {
  try {
    const mapping = await getWalletAccountMapping();
    if (mapping[accountId]) {
      mapping[accountId] = mapping[accountId].filter((id) => id !== walletId);

      // 如果账户下没有钱包了，删除该账户
      if (mapping[accountId].length === 0) {
        delete mapping[accountId];
      }

      await AsyncStorage.setItem(WALLETS_ACCOUNTS_KEY, JSON.stringify(mapping));
    }
  } catch (error) {
    console.error(
      "[wallet-storage] Error removing wallet from account:",
      error
    );
    throw error;
  }
}

/**
 * 获取当前钱包账户 ID（兼容旧接口，返回第一个账户ID）
 * @deprecated 建议使用 getWalletAccountMapping 获取完整的映射关系
 */
export async function getCurrentWalletAccountId(): Promise<string | null> {
  try {
    const mapping = await getWalletAccountMapping();
    const accountIds = Object.keys(mapping);
    return accountIds.length > 0 ? accountIds[0] : null;
  } catch (error) {
    console.error(
      "[wallet-storage] Error getting current wallet account ID:",
      error
    );
    return null;
  }
}

/**
 * 清除当前钱包
 */
export async function clearCurrentWallet(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CURRENT_WALLET_KEY);
  } catch (error) {
    console.error("[wallet-storage] Error clearing current wallet:", error);
  }
}

export const saveWalletData = async (mnemonic: string, userPin: string) => {
  try {
    // 存储 PIN 码
    await SecureStore.setItemAsync("user_pin", userPin);

    // 存储助记词
    // iOS 特有配置：REQUIRE_AUTHENTICATION 可以在系统层面要求 FaceID 才能读取
    await SecureStore.setItemAsync("user_mnemonic", mnemonic, {
      keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    });

    console.log("安全存储成功");
  } catch (error) {
    console.error("存储失败", error);
  }
};

export const accessMnemonic = async (inputPin: string) => {
  // 1. 首先验证数字密码
  const savedPin = await SecureStore.getItemAsync("user_pin");

  if (inputPin !== savedPin) {
    alert("密码错误");
    return;
  }

  // 2. 验证成功后，从 SecureStore 读取助记词
  const mnemonic = await SecureStore.getItemAsync("user_mnemonic");
  return mnemonic;
};

/**
 * 保存钱包（敏感信息存储在 SecureStore）
 * 支持在一个钱包名称下保存多链信息，支持增量更新
 *
 * 注意：
 * - publicKey 在传入时已经是加密后的数据，直接保存，不进行二次加密
 * - 私钥存储在 SecureStore 中，元数据存储在 AsyncStorage 中
 */
export async function saveCryptoWallet(
  walletId: string,
  wallet: StoredWallet,
  privateKeys: {
    evm?: { [chainId: number]: string };
    solana?: Uint8Array;
    txron?: string;
  }
): Promise<void> {
  try {
    // 获取现有钱包列表
    const wallets = await getWallets();

    // 检查钱包是否已存在
    const existingWallet = wallets[walletId];

    // 如果钱包已存在，进行增量合并
    if (existingWallet) {
      // 合并 EVM 钱包信息（保留现有的，添加新的）
      if (wallet.evmWallets) {
        existingWallet.evmWallets = {
          ...(existingWallet.evmWallets || {}),
          ...wallet.evmWallets,
        };
      }
      // 如果只提供了私钥但没有地址信息，保留现有的地址信息
      else if (privateKeys.evm && existingWallet.evmWallets) {
        // 保留现有的 evmWallets，只更新私钥
        // evmWallets 保持不变
      }

      // 合并 Solana 钱包信息（publicKey 已经是加密后的数据，直接保存）
      if (wallet.solanaWallet) {
        existingWallet.solanaWallet = wallet.solanaWallet;
      }

      // 合并 Txron 钱包信息（address 可能包含加密后的 publicKey，直接保存）
      if (wallet.txronWallet) {
        existingWallet.txronWallet = wallet.txronWallet;
      }

      // 更新钱包名称（如果提供了新名称）
      if (wallet.name) {
        existingWallet.name = wallet.name;
      }

      // 自动检测并更新钱包类型
      const hasEVM =
        existingWallet.evmWallets &&
        Object.keys(existingWallet.evmWallets).length > 0;
      const hasSolana = !!existingWallet.solanaWallet;
      const hasTxron = !!existingWallet.txronWallet;

      const chainCount = [hasEVM, hasSolana, hasTxron].filter(Boolean).length;

      if (chainCount > 1) {
        existingWallet.type = "multi";
      } else if (hasEVM) {
        existingWallet.type = "evm";
      } else if (hasSolana) {
        existingWallet.type = "solana";
      } else if (hasTxron) {
        existingWallet.type = "txron";
      }

      // 更新时间戳
      existingWallet.updatedAt = Date.now();

      // 保留创建时间
      if (!existingWallet.createdAt) {
        existingWallet.createdAt = wallet.createdAt || Date.now();
      }

      // 使用合并后的钱包数据
      wallets[walletId] = existingWallet;
    } else {
      // 新钱包：自动检测类型
      const hasEVM =
        wallet.evmWallets && Object.keys(wallet.evmWallets).length > 0;
      const hasSolana = !!wallet.solanaWallet;
      const hasTxron = !!wallet.txronWallet;

      const chainCount = [hasEVM, hasSolana, hasTxron].filter(Boolean).length;

      if (chainCount > 1) {
        wallet.type = "multi";
      } else if (hasEVM) {
        wallet.type = wallet.type || "evm";
      } else if (hasSolana) {
        wallet.type = wallet.type || "solana";
      } else if (hasTxron) {
        wallet.type = wallet.type || "txron";
      }

      wallet.updatedAt = Date.now();
      if (!wallet.createdAt) {
        wallet.createdAt = Date.now();
      }

      wallets[walletId] = wallet;
    }

    // 保存钱包元数据到 AsyncStorage
    await AsyncStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));

    // 保存私钥到 SecureStore（增量保存，不会覆盖已存在的私钥）
    if (privateKeys.evm) {
      for (const [chainId, privateKey] of Object.entries(privateKeys.evm)) {
        const key = `wallet_${walletId}_evm_${chainId}`;
        // 只保存新的私钥，如果已存在则跳过（避免覆盖）
        const existingKey = await SecureStore.getItemAsync(key);
        if (!existingKey) {
          await SecureStore.setItemAsync(key, privateKey);
        } else {
          // 如果提供了新的私钥，可以选择更新（这里选择更新）
          await SecureStore.setItemAsync(key, privateKey);
        }
      }
    }

    if (privateKeys.solana) {
      const key = `wallet_${walletId}_solana`;
      await SecureStore.setItemAsync(
        key,
        JSON.stringify(Array.from(privateKeys.solana))
      );
    }

    if (privateKeys.txron) {
      const key = `wallet_${walletId}_txron`;
      await SecureStore.setItemAsync(key, privateKeys.txron);
    }

    // 获取最终保存的钱包信息用于日志
    const finalWallet = wallets[walletId];
    console.log(
      `[wallet-storage] 钱包 ${walletId} 保存成功，类型: ${finalWallet.type}`,
      {
        evmChains: finalWallet.evmWallets
          ? Object.keys(finalWallet.evmWallets).length
          : 0,
        hasSolana: !!finalWallet.solanaWallet,
        hasTxron: !!finalWallet.txronWallet,
        isMultiChain: finalWallet.type === "multi",
        note: "publicKey 和 address 字段已加密，直接保存",
      }
    );
  } catch (error) {
    console.error("[wallet-storage] Error saving wallet:", error);
    throw error;
  }
}

/**
 * 账户链信息接口
 */
export interface ChainAccountInfo {
  address: string;
  path: string;
}

/**
 * 账户信息接口
 * 一个账户可以包含多个链的信息
 */
export interface AccountInfo {
  index: number;
  evm?: ChainAccountInfo;
  tron?: ChainAccountInfo;
  solana?: ChainAccountInfo;
}

/**
 * 钱包账户列表类型
 */
export type WalletAccounts = AccountInfo[];

/**
 * 保存钱包账户信息
 * 一个 walletId 可以存储多个账户（通过 index 区分）
 * @param walletId 钱包ID
 * @param accounts 账户信息数组
 */
export async function saveWalletAccounts(
  walletId: string,
  accounts: WalletAccounts
): Promise<void> {
  try {
    const key = `${WALLET_ACCOUNTS_KEY_PREFIX}${walletId}`;
    await AsyncStorage.setItem(key, JSON.stringify(accounts));
    console.log(
      `[wallet-storage] 钱包 ${walletId} 的账户信息保存成功，共 ${accounts.length} 个账户`
    );
  } catch (error) {
    console.error("[wallet-storage] Error saving wallet accounts:", error);
    throw error;
  }
}

/**
 * 获取钱包的所有账户信息
 * @param walletId 钱包ID
 * @returns 账户信息数组，如果不存在则返回空数组
 */
export async function getWalletAccounts(
  walletId: string
): Promise<WalletAccounts> {
  try {
    const key = `${WALLET_ACCOUNTS_KEY_PREFIX}${walletId}`;
    const data = await AsyncStorage.getItem(key);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as WalletAccounts;
  } catch (error) {
    console.error("[wallet-storage] Error getting wallet accounts:", error);
    return [];
  }
}

/**
 * 添加或更新单个账户信息
 * 如果账户已存在（通过 index 匹配），则更新；否则添加新账户
 * @param walletId 钱包ID
 * @param account 账户信息
 */
export async function saveWalletAccount(
  walletId: string,
  account: AccountInfo
): Promise<void> {
  try {
    const accounts = await getWalletAccounts(walletId);
    const existingIndex = accounts.findIndex((a) => a.index === account.index);

    if (existingIndex >= 0) {
      // 更新现有账户，合并链信息
      const existing = accounts[existingIndex];
      accounts[existingIndex] = {
        index: account.index,
        // 合并链信息：如果新数据中有则更新，否则保留现有的
        evm: account.evm ?? existing.evm,
        tron: account.tron ?? existing.tron,
        solana: account.solana ?? existing.solana,
      };
    } else {
      // 添加新账户
      accounts.push(account);
    }

    await saveWalletAccounts(walletId, accounts);
  } catch (error) {
    console.error("[wallet-storage] Error saving wallet account:", error);
    throw error;
  }
}

/**
 * 根据索引获取指定账户信息
 * @param walletId 钱包ID
 * @param index 账户索引
 * @returns 账户信息，如果不存在则返回 null
 */
export async function getWalletAccountByIndex(
  walletId: string,
  index: number
): Promise<AccountInfo | null> {
  try {
    const accounts = await getWalletAccounts(walletId);
    return accounts.find((a) => a.index === index) || null;
  } catch (error) {
    console.error(
      "[wallet-storage] Error getting wallet account by index:",
      error
    );
    return null;
  }
}

/**
 * 删除指定索引的账户
 * @param walletId 钱包ID
 * @param index 账户索引
 */
export async function removeWalletAccount(
  walletId: string,
  index: number
): Promise<void> {
  try {
    const accounts = await getWalletAccounts(walletId);
    const filtered = accounts.filter((a) => a.index !== index);
    await saveWalletAccounts(walletId, filtered);
  } catch (error) {
    console.error("[wallet-storage] Error removing wallet account:", error);
    throw error;
  }
}

/**
 * 清除钱包的所有账户信息
 * @param walletId 钱包ID
 */
export async function clearWalletAccounts(walletId: string): Promise<void> {
  try {
    const key = `${WALLET_ACCOUNTS_KEY_PREFIX}${walletId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("[wallet-storage] Error clearing wallet accounts:", error);
  }
}

/**
 * 钱包完整信息接口
 * 包含钱包ID、关联的账户ID列表，以及每个账户的地址信息
 */
export interface WalletCompleteInfo {
  walletId: string;
  accountIds: string[];
  accountAddresses: {
    [accountId: string]: {
      evm?: string[];
      tron?: string[];
      solana?: string[];
    };
  };
}

/**
 * 树状结构节点 - 链类型节点
 */
export interface ChainNode {
  chainType: "evm" | "tron" | "solana";
  addresses: string[];
}

/**
 * 树状结构节点 - 钱包节点
 */
export interface WalletTreeNode {
  walletId: string;
  chains: ChainNode[];
}

/**
 * 树状结构节点 - 账户节点（根节点）
 */
export interface AccountTreeNode {
  accountId: string;
  wallets: WalletTreeNode[];
}

/**
 * 树状结构数据
 */
export type WalletTreeStructure = AccountTreeNode[];

/**
 * 一次性获取所有钱包ID、对应的accountId，以及每个accountId包含的address列表
 * @returns 返回所有钱包的完整信息数组
 */
export async function getAllWalletsCompleteInfo(): Promise<
  WalletCompleteInfo[]
> {
  try {
    // 1. 获取所有钱包ID
    const allWalletIds = await getAllWalletIds();

    // 2. 获取账户与钱包的映射关系（accountId -> walletIds[]）
    const accountMapping = await getWalletAccountMapping();

    // 3. 构建反向映射（walletId -> accountIds[]）
    const walletToAccounts: { [walletId: string]: string[] } = {};
    for (const [accountId, walletIds] of Object.entries(accountMapping)) {
      for (const walletId of walletIds) {
        if (!walletToAccounts[walletId]) {
          walletToAccounts[walletId] = [];
        }
        if (!walletToAccounts[walletId].includes(accountId)) {
          walletToAccounts[walletId].push(accountId);
        }
      }
    }

    // 4. 为每个钱包ID获取账户地址信息
    const result: WalletCompleteInfo[] = [];

    for (const walletId of allWalletIds) {
      // 获取该钱包关联的accountId列表
      const accountIds = walletToAccounts[walletId] || [];

      // 获取该钱包的所有账户信息（AccountInfo[]）
      const walletAccounts = await getWalletAccounts(walletId);

      // 构建账户地址映射
      const accountAddresses: {
        [accountId: string]: {
          evm?: string[];
          tron?: string[];
          solana?: string[];
        };
      } = {};

      // 收集该钱包的所有地址信息
      const allEvmAddresses: string[] = [];
      const allTronAddresses: string[] = [];
      const allSolanaAddresses: string[] = [];

      for (const account of walletAccounts) {
        if (account.evm?.address) {
          allEvmAddresses.push(account.evm.address);
        }
        if (account.tron?.address) {
          allTronAddresses.push(account.tron.address);
        }
        if (account.solana?.address) {
          allSolanaAddresses.push(account.solana.address);
        }
      }

      // 将地址信息分配给每个关联的accountId
      // 如果该钱包没有关联的accountId，使用钱包ID作为默认账户ID
      if (accountIds.length === 0) {
        if (
          allEvmAddresses.length > 0 ||
          allTronAddresses.length > 0 ||
          allSolanaAddresses.length > 0
        ) {
          const defaultAccountId = walletId;
          accountIds.push(defaultAccountId);
          accountAddresses[defaultAccountId] = {
            evm: allEvmAddresses.length > 0 ? [...allEvmAddresses] : undefined,
            tron:
              allTronAddresses.length > 0 ? [...allTronAddresses] : undefined,
            solana:
              allSolanaAddresses.length > 0
                ? [...allSolanaAddresses]
                : undefined,
          };
        }
      } else {
        // 将地址信息添加到每个关联的accountId下
        for (const accountId of accountIds) {
          accountAddresses[accountId] = {
            evm: allEvmAddresses.length > 0 ? [...allEvmAddresses] : undefined,
            tron:
              allTronAddresses.length > 0 ? [...allTronAddresses] : undefined,
            solana:
              allSolanaAddresses.length > 0
                ? [...allSolanaAddresses]
                : undefined,
          };
        }
      }

      // 清理完全为空的账户地址对象
      for (const accountId of Object.keys(accountAddresses)) {
        const addresses = accountAddresses[accountId];
        if (!addresses.evm && !addresses.tron && !addresses.solana) {
          delete accountAddresses[accountId];
        }
      }

      result.push({
        walletId,
        accountIds,
        accountAddresses,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "[wallet-storage] Error getting all wallets complete info:",
      error
    );
    return [];
  }
}

/**
 * 将钱包完整信息转换为树状结构
 * 树状结构：accountId -> walletId -> chainType -> addresses
 * @param walletsInfo 钱包完整信息数组
 * @returns 树状结构数据
 */
export function convertToTreeStructure(
  walletsInfo: WalletCompleteInfo[]
): WalletTreeStructure {
  // 使用 Map 来构建树状结构，以 accountId 为键
  const accountMap = new Map<string, AccountTreeNode>();

  for (const walletInfo of walletsInfo) {
    const { walletId, accountIds, accountAddresses } = walletInfo;

    // 如果没有关联的 accountId，跳过
    if (accountIds.length === 0) {
      continue;
    }

    // 为每个 accountId 创建或更新节点
    for (const accountId of accountIds) {
      // 获取该 accountId 对应的地址信息
      const addresses = accountAddresses[accountId];
      if (!addresses) {
        continue;
      }

      // 如果 accountId 节点不存在，创建它
      if (!accountMap.has(accountId)) {
        accountMap.set(accountId, {
          accountId,
          wallets: [],
        });
      }

      const accountNode = accountMap.get(accountId)!;

      // 构建链类型节点数组
      const chains: ChainNode[] = [];

      if (addresses.evm && addresses.evm.length > 0) {
        chains.push({
          chainType: "evm",
          addresses: addresses.evm,
        });
      }

      if (addresses.tron && addresses.tron.length > 0) {
        chains.push({
          chainType: "tron",
          addresses: addresses.tron,
        });
      }

      if (addresses.solana && addresses.solana.length > 0) {
        chains.push({
          chainType: "solana",
          addresses: addresses.solana,
        });
      }

      // 如果该钱包有链信息，添加到账户节点下
      if (chains.length > 0) {
        // 检查该 walletId 是否已存在于该 accountId 下
        const existingWalletIndex = accountNode.wallets.findIndex(
          (w) => w.walletId === walletId
        );

        if (existingWalletIndex >= 0) {
          // 如果已存在，合并链信息
          const existingWallet = accountNode.wallets[existingWalletIndex];
          // 合并链类型，避免重复
          for (const chain of chains) {
            const existingChainIndex = existingWallet.chains.findIndex(
              (c) => c.chainType === chain.chainType
            );
            if (existingChainIndex >= 0) {
              // 合并地址，去重
              const existingChain = existingWallet.chains[existingChainIndex];
              const mergedAddresses = [
                ...new Set([...existingChain.addresses, ...chain.addresses]),
              ];
              existingWallet.chains[existingChainIndex] = {
                ...existingChain,
                addresses: mergedAddresses,
              };
            } else {
              existingWallet.chains.push(chain);
            }
          }
        } else {
          // 如果不存在，添加新的钱包节点
          accountNode.wallets.push({
            walletId,
            chains,
          });
        }
      }
    }
  }

  // 转换为数组并返回
  return Array.from(accountMap.values());
}

/**
 * 一次性获取所有钱包信息并转换为树状结构
 * @returns 返回树状结构数据
 */
export async function getAllWalletsTreeStructure(): Promise<WalletTreeStructure> {
  try {
    const walletsInfo = await getAllWalletsCompleteInfo();
    return convertToTreeStructure(walletsInfo);
  } catch (error) {
    console.error(
      "[wallet-storage] Error getting all wallets tree structure:",
      error
    );
    return [];
  }
}
