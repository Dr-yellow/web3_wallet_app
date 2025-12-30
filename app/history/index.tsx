import { getHistory, historyResponse } from "@/api/wallet/history";
import { PageScroll } from "@/components/page/PageScroll";
import { ThemedText } from "@/components/themed-text";
import { AppTransactionItemProps } from "@/components/transaction/AppTransactionItem";
import { AppTransactionList } from "@/components/transaction/AppTransactionList";
import { grayScale } from "@/constants/theme/base";
import {
  AccountInfo,
  getCurrentWalletId,
  getWalletAccounts,
} from "@/utils/wallet";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface GroupedTransactions {
  date: string;
  data: AppTransactionItemProps[];
}

export default function HistoryScreen() {
  const [historyData, setHistoryData] = useState<GroupedTransactions[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const formatTransactions = useCallback(
    (list: historyResponse["history_list"]) => {
      const grouped: { [key: string]: AppTransactionItemProps[] } = {};

      // 首先按时间排序原始数据 (使用 timestamp)
      const sortedList = [...(list || [])].sort(
        (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
      );

      sortedList.forEach((item) => {
        const dateObj = item.timestamp
          ? new Date(item.timestamp * 1000)
          : new Date();
        const dateKey = dateObj.toLocaleDateString();

        const isScam = item.is_scam;
        const receives = item.receives || [];
        const sends = item.sends || [];

        // 决定交易类型
        let type: AppTransactionItemProps["type"] = "contract";
        if (receives.length > 0 && sends.length === 0) {
          type = "receive";
        } else if (sends.length > 0 && receives.length === 0) {
          type = "send";
        } else if (receives.length > 0 && sends.length > 0) {
          // 同时有发送和接收，通常是兑换、跨链或合约交互
          type = "contract";
        }

        const title =
          type === "receive" ? "收款" : type === "send" ? "发送" : "合约交互";

        // 构建代币列表 (确保 amount 是 string, symbol 是 token_id)
        const tokens: any[] = [
          ...receives.map((r) => ({
            symbol: (r.token_id || "Unknown").toUpperCase(),
            amount: String(r.amount),
            isPositive: true,
          })),
          ...sends.map((s) => ({
            symbol: (s.token_id || "Unknown").toUpperCase(),
            amount: String(s.amount),
            isPositive: false,
          })),
        ];

        const otherAddr = item.other_address || "";
        const subtitle =
          type === "receive"
            ? `来自 ${otherAddr.slice(0, 6)}...${otherAddr.slice(-4)}`
            : type === "send"
            ? `至 ${otherAddr.slice(0, 6)}...${otherAddr.slice(-4)}`
            : otherAddr
            ? `${otherAddr.slice(0, 6)}...${otherAddr.slice(-4)}`
            : item.chain;

        const tx: AppTransactionItemProps = {
          id: item.tx_hash || item.tx?.tx_hash || Math.random().toString(),
          type,
          title: isScam ? `${title} (可疑)` : title,
          subtitle,
          tokens,
          rawData: item,
        };

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(tx);
      });

      // 保持日期排序
      const sortedDates = Object.keys(grouped).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );

      return sortedDates.map((date) => ({
        date: date === new Date().toLocaleDateString() ? "今天" : date,
        data: grouped[date],
      }));
    },
    []
  );

  const fetchData = async (isRefresh = false) => {
    let address = "";
    let chain_ids: keyof AccountInfo = "evm";
    const walletId = await getCurrentWalletId();
    if (!walletId) {
      router.replace("/wallet-setup/onboarding");
      return;
    }
    const walletInfo = await getWalletAccounts(walletId);
    const allAccounts = walletInfo[0];
    // chain_ids = Object.keys(allAccounts)[0];
    // address = allAccounts[chain_ids];
    chain_ids = "tron";
    address = "TSEWHHd2CouVMfHwTtB8KZGcx7kW8Xrjjx";
    console.log("address", address);

    try {
      if (isRefresh) setRefreshing(true);
      const { history_list } = await getHistory({
        address,
        params: { chain_ids, start_time: Date.now() - 2 * 24 * 3600000 },
        config: {
          noLoading: isRefresh,
        },
      });
      setHistoryData(formatTransactions(history_list));
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  const handleItemPress = (item: AppTransactionItemProps) => {
    router.push({
      pathname: "/history/transaction",
      params: { data: JSON.stringify(item.rawData) },
    } as any);
  };

  return (
    <PageScroll
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshing={refreshing}
      onRefresh={() => fetchData(true)}
    >
      <Stack.Screen
        options={{
          title: "交易记录",
          headerShown: true,
          headerBackTitle: "",
          headerStyle: { backgroundColor: grayScale[500] },
          headerRight: () => (
            <TouchableOpacity style={styles.headerIcon}>
              <Feather name="filter" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      {historyData.length > 0
        ? historyData.map((group, groupIndex) => (
            <AppTransactionList
              key={groupIndex}
              title={group.date}
              transactions={group.data}
              onItemPress={handleItemPress}
            />
          ))
        : !refreshing && (
            <ThemedText style={styles.emptyText}>暂无记录</ThemedText>
          )}

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={grayScale[200]}
          />{" "}
          仅展示最近7天的交易记录，如需更多请查询浏览器
        </ThemedText>
      </View>
    </PageScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerIcon: {
    marginRight: 16,
  },
  footer: {
    marginTop: 60,
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: grayScale[200],
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 100,
    color: grayScale[200],
  },
});
