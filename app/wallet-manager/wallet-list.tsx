import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { colors } from "@/constants/colors";
import { grayScale } from "@/constants/theme/base";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { Ionicons } from "@expo/vector-icons";

import { useHome } from "@/context/HomeContext";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { PageList } from "@/components/page/PageList";
import { AppAccordion } from "@/components/ui/AppAccordion";
import {
  getAllWalletsTreeStructure,
  getCurrentWalletId,
  getWallets,
  setCurrentWallet,
  WalletTreeNode,
  WalletTreeStructure,
} from "@/utils/wallet/wallet-storage";

// 格式化余额显示
function formatBalance(balance: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
}

// 生成账户图标颜色
function getAccountIconColor(index: number): string {
  const colors = [
    "#8B5CF6", // 紫色
    "#3B82F6", // 蓝色
    "#10B981", // 绿色
    "#F59E0B", // 橙色
    "#EF4444", // 红色
  ];
  return colors[index % colors.length];
}

interface AccordionItemProps {
  item: {
    accountId: string;
    wallets: WalletTreeNode[];
  };
  walletIndex: number;
  walletNames: Map<string, string>;
  balances: Map<string, number>;
  getAllWalletsFromHome: () => Promise<void>;
}

function AccordionItem({
  item,
  walletIndex,
  walletNames,
  balances,
  getAllWalletsFromHome,
}: AccordionItemProps) {
  const toggle = async () => {
    await setCurrentWallet(item.accountId);
    await getAllWalletsFromHome();
    setTimeout(() => {
      isCurrentWallet();
    }, 100);
  };

  // 计算钱包总余额
  const walletBalance = item.wallets.reduce((total, wallet) => {
    return total + (balances.get(wallet.walletId) || 0);
  }, 0);

  const walletName = `Wallet ${String(walletIndex + 1).padStart(2, "0")}`;
  const [isCurrent, setIsCurrent] = useState(false);

  const isCurrentWallet = async () => {
    const currentWalletId = await getCurrentWalletId();
    setIsCurrent(currentWalletId === item.accountId);
  };
  useEffect(() => {
    isCurrentWallet();
  }, [item.accountId]);

  return (
    <View style={styles.walletContainer}>
      {/* Accounts List */}
      <AppAccordion
        title={
          <View style={styles.walletHeaderLeft}>
            <View style={styles.walletHeaderContent}>
              <ThemedText style={styles.walletTitle}>{walletName}</ThemedText>
              <ThemedText style={styles.walletBalance}>
                {formatBalance(walletBalance)}
              </ThemedText>
            </View>
          </View>
        }
        children={
          <View style={styles.accountsList}>
            {item.wallets.map((wallet, accountIndex) => {
              const accountBalance = balances.get(wallet.walletId) || 0;
              const accountName = `Account ${String(accountIndex + 1).padStart(
                2,
                "0"
              )}`;
              const iconColor = getAccountIconColor(accountIndex);

              return (
                <TouchableOpacity
                  key={wallet.walletId}
                  onPress={() => toggle()}
                >
                  <View key={wallet.walletId} style={styles.accountItem}>
                    <View style={styles.accountItemLeft}>
                      <View
                        style={[
                          styles.accountIcon,
                          { backgroundColor: iconColor },
                        ]}
                      >
                        <View style={styles.accountIconInner} />
                      </View>
                      <View style={styles.accountInfo}>
                        <ThemedText style={styles.accountName}>
                          {accountName}
                        </ThemedText>
                        <ThemedText style={styles.accountBalance}>
                          {formatBalance(accountBalance)}
                        </ThemedText>
                      </View>
                    </View>
                    {isCurrent && (
                      <View style={styles.currentWalletIcon}>
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={grayScale[100]}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Add Account Button */}
            <TouchableOpacity
              style={styles.addAccountButton}
              activeOpacity={0.7}
              onPress={() => {
                // TODO: 实现添加账户功能
                console.log("添加账户");
              }}
            >
              <View style={styles.addAccountIcon}>
                <Ionicons name="add" size={20} color={grayScale[100]} />
              </View>
              <ThemedText style={styles.addAccountText}>添加账户</ThemedText>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

export default function walletListScreen() {
  const { getAllWallets: getAllWalletsFromHome } = useHome();
  const router = useDebouncedNavigation();
  const [wallets, setWallets] = useState<WalletTreeStructure>([]);
  const [walletNames, setWalletNames] = useState<Map<string, string>>(
    new Map()
  );
  const [balances, setBalances] = useState<Map<string, number>>(new Map());

  const getAllWallets = async () => {
    try {
      const allWallets = await getAllWalletsTreeStructure();
      setWallets(allWallets);
      // 获取钱包名称
      const allWalletsData = await getWallets();
      const namesMap = new Map<string, string>();
      const balancesMap = new Map<string, number>();

      // 遍历树状结构，获取每个钱包的信息
      allWallets.forEach((account) => {
        account.wallets.forEach((wallet) => {
          const walletData = allWalletsData[wallet.walletId];
          if (walletData) {
            namesMap.set(wallet.walletId, walletData.name);
            // TODO: 从API获取实际余额，这里使用模拟数据
            balancesMap.set(wallet.walletId, Math.random() * 50000);
          }
        });
      });
      setWalletNames(namesMap);
      setBalances(balancesMap);
    } catch (error) {
      console.error("加载钱包失败:", error);
    }
  };

  useEffect(() => {
    getAllWallets();
  }, []);

  return (
    <ThemedView style={[styles.container]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "钱包管理",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#000",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerIcon}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <PageList
        data={wallets}
        renderItem={({ item, index }: { item: any; index: number }) => (
          <AccordionItem
            item={item}
            walletIndex={index}
            walletNames={walletNames}
            balances={balances}
            getAllWalletsFromHome={getAllWalletsFromHome}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  walletContainer: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  walletHeaderLeft: {
    flex: 1,
  },
  walletHeaderContent: {
    gap: 4,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: grayScale[100],
  },
  walletBalance: {
    fontSize: 16,
    fontWeight: "400",
    color: grayScale[100],
    marginTop: 4,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: grayScale[300],
    alignItems: "center",
    justifyContent: "center",
  },
  accountsList: {
    paddingLeft: 0,
    gap: 12,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  accountItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  accountIconInner: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#1E1B4B", // 深蓝色块状图形
  },
  accountInfo: {
    flex: 1,
    gap: 4,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "500",
    color: grayScale[100],
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: "400",
    color: grayScale[100],
  },
  addAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  addAccountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: grayScale[300],
    alignItems: "center",
    justifyContent: "center",
  },
  addAccountText: {
    fontSize: 16,
    fontWeight: "400",
    color: grayScale[100],
  },
  headerIcon: {
    paddingHorizontal: 8,
  },

  currentWalletIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: grayScale[300],
    alignItems: "center",
    justifyContent: "center",
  },
});
