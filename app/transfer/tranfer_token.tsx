import ActionButtons from "@/components/home/ActionButtons";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppTransactionList } from "@/components/transaction/AppTransactionList";
import { colors } from "@/constants/colors";
import { grayScale } from "@/constants/theme/base";
import { useColorFinance } from "@/hooks/use-color-finance";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { getHistory, type historyResponse } from "@/api/wallet/history";
import { AppTransactionItemProps } from "@/components/transaction/AppTransactionItem";
import { formatDelimiter } from "@/utils/system/formatNumber";
import { getCurrentWalletId, getWalletAccounts } from "@/utils/wallet";
import { useCallback, useEffect, useState } from "react";

interface GroupedTransactions {
  date: string;
  data: AppTransactionItemProps[];
}
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tokenItemInfo } = useLocalSearchParams();
  const { balance, logo_url, symbol, total_value_usd, chain } = JSON.parse(
    tokenItemInfo as string
  );
  console.log("tokenItemInfo", tokenItemInfo);
  const marketTheme = useColorFinance();
  const [historyData, setHistoryData] = useState<GroupedTransactions[]>([]);
  const [showAddress, setShowAddress] = useState<string>("");

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

  const getAllWallets = useCallback(async () => {
    const walletId = await getCurrentWalletId();
    if (!walletId) return;
    const walletInfo = await getWalletAccounts(walletId);
    console.log("walletInfo", walletInfo);
    if (!chain) return;
    // 通过传入的 chain 获取当前链地址
    let address: string | undefined;
    const account = walletInfo.find((item) => {
      if (chain === "evm") return item.evm?.address;
      if (chain === "tron") return item.tron?.address;
      if (chain === "solana") return item.solana?.address;
      return false;
    });
    if (account) {
      if (chain === "evm") address = account.evm?.address;
      else if (chain === "tron") address = account.tron?.address;
      else if (chain === "solana") address = account.solana?.address;
    }
    if (!address) return;
    setShowAddress(address);
    getHistoryData(address, chain);
  }, [chain]);

  const [refreshing, setRefreshing] = useState(false);

  const getHistoryData = async (address: string, chainIds: string) => {
    try {
      const { history_list } = await getHistory({
        address,
        params: {
          chain_ids: chainIds,
          start_time: Date.now() - 2 * 24 * 3600000,
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
    getAllWallets();
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    if (!text || text === "-") return;
    await Clipboard.setStringAsync(text);
    toast.success(`${label}已复制`);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: logo_url as string }}
                style={{ width: 36, height: 36, borderRadius: "50%" }}
              />

              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "500",
                  marginLeft: 10,
                }}
              >
                {symbol?.toUpperCase()}
              </Text>
            </ThemedView>
          ),
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
      {/* 余额信息 */}
      <ThemedView style={styles.transferContainer}>
        <ThemedView style={styles.leftContent}>
          <ThemedView style={styles.changeRow}>
            <ThemedText
              color={marketTheme.down}
              style={[styles.isMyBalance, { marginBottom: 4 }]}
            >
              我的余额
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.changeRow}>
            <ThemedText color={marketTheme.down} style={styles.changeText}>
              {formatDelimiter(balance as string, { precision: 3 })}{" "}
              {symbol?.toUpperCase()}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.changeRow}>
            <ThemedText color={marketTheme.down} style={styles.isMyBalance}>
              {formatDelimiter(total_value_usd as string, {
                precision: 2,
                prefix: "$",
                suffix: "",
              })}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.rightContent}>
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={36}
              color="#FFFFFF"
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      {/* 收款信息 */}
      <ThemedView style={styles.transferContainer}>
        <ThemedView style={[styles.leftContent]}>
          <ThemedView style={styles.changeRow}>
            <ThemedText
              color={marketTheme.down}
              style={[styles.changeText, { fontSize: 20 }]}
            >
              收款地址
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.changeRow}>
            <ThemedText color={marketTheme.down} style={styles.isMyBalance}>
              {showAddress}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.rightContent}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => copyToClipboard(showAddress, "收款地址")}
          >
            <Ionicons name="copy-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ActionButtons />

      <ThemedView style={historyStyles.container}>
        <ThemedText style={historyStyles.header}>历史记录</ThemedText>

        <ScrollView style={historyStyles.listContent}>
          {historyData.length > 0
            ? historyData.map((group, groupIndex) => (
                <AppTransactionList
                  key={groupIndex}
                  title={group.date}
                  transactions={group.data}
                  onItemPress={() => {}}
                />
              ))
            : !refreshing && (
                <ThemedText style={styles.emptyText}>暂无记录</ThemedText>
              )}
        </ScrollView>
        <ThemedView style={{ height: 40 }} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#141414",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  importButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  importButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  importButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  importButtonTextDisabled: {
    color: "#888",
  },
  headerIcon: {
    paddingHorizontal: 8,
  },

  transferContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  leftContent: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  balanceText: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  isMyBalance: {
    color: "#999",
    fontSize: 15,
    fontWeight: "400",
  },
  changeText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "500",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  chart: {
    paddingRight: 0,
    paddingLeft: 0,
    marginTop: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 100,
    color: grayScale[200],
  },
});

const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    padding: 16,

    color: "#FFF",
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 21.527,
    textTransform: "capitalize",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 28,
    backgroundColor: "transparent",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    width: 41,
    height: 41,
    borderRadius: 22,
    marginRight: 16,
  },
  infoContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 6,
  },
  balanceText: {
    color: grayScale[200],
    fontSize: 15,
    fontWeight: 500,
  },
  rightContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  price: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 6,
  },
  change: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});
