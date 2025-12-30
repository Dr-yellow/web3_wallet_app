import { grayScale } from "@/constants/theme/base";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { formatDelimiter } from "@/utils/system/formatNumber";
import {
  getCurrentWalletId,
  getWalletAccounts,
} from "@/utils/wallet/wallet-storage";
import { Ionicons } from "@expo/vector-icons";

import { GetToken, TokenItem } from "@/api/wallet/token";
import { useColorFinance } from "@/hooks/use-color-finance";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const CHAIN = "tron" as const;
const { width } = Dimensions.get("window");

interface CoinItemProps {
  item: TokenItem;
  index: number;
  handlePress: (item: TokenItem) => void;
}

function CoinItem({ item, index, handlePress }: CoinItemProps) {
  const { up } = useColorFinance();

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => handlePress(item)}>
      <Animated.View
        entering={FadeIn.delay(index * 50)}
        exiting={FadeOut}
        style={styles.itemContainer}
      >
        <ThemedView style={styles.leftContainer}>
          <Image source={{ uri: item.logo_url }} style={styles.icon} />

          <ThemedView style={styles.infoContainer}>
            <ThemedText style={styles.name}>{item.symbol}</ThemedText>
            <ThemedText style={styles.balanceText}>
              {formatDelimiter(item.balance ?? 0, { precision: 4 })}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.rightContainer}>
          <ThemedText style={styles.price}>
            {formatDelimiter(item.total_value_usd, {
              precision: 2,
              prefix: "$",
              suffix: "",
            })}
          </ThemedText>
          <ThemedText style={[styles.change, { color: up }]}>
            ↑{" "}
            {formatDelimiter(item.unit_price_usd, {
              precision: 2,
              prefix: "$",
              suffix: "",
            })}
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function TronTransfer() {
  const router = useRouter();
  const { recipientAddress } = useLocalSearchParams();

  const insets = useSafeAreaInsets();

  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState<TokenItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  const getChainAddress = useCallback(
    (walletInfo: Awaited<ReturnType<typeof getWalletAccounts>>) => {
      const account = walletInfo.find((item) => item.tron?.address);
      return account?.tron?.address;
    },
    []
  );

  const loadWalletBalance = useCallback(async (address: string) => {
    try {
      const accountInfo = await GetToken({ address, chain_ids: CHAIN });
      setTokens(accountInfo.tokens);
      if (accountInfo.tokens.length > 0) {
        setTokenSymbol(accountInfo.tokens[0]);
      }
    } catch (error) {
      console.error("Failed to load wallet balance:", error);
      Alert.alert("错误", "加载钱包余额失败");
    }
  }, []);

  const loadWalletData = useCallback(async () => {
    try {
      const walletId = await getCurrentWalletId();
      if (!walletId) return;

      const walletInfo = await getWalletAccounts(walletId);
      const address = getChainAddress(walletInfo);
      console.log("address----", address);
      setCurrentAddress(address as string);

      if (address) {
        await loadWalletBalance(address);
      }
    } catch (error) {
      console.error("Failed to load wallet data:", error);
      Alert.alert("错误", "加载钱包数据失败");
    }
  }, [getChainAddress, loadWalletBalance]);

  useFocusEffect(
    useCallback(() => {
      loadWalletData();
    }, [loadWalletData])
  );

  const filteredTokens = useMemo(
    () =>
      tokens.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [tokens, searchQuery]
  );

  const validateTransfer = useCallback((): boolean => {
    if (!tokenSymbol) {
      Alert.alert("错误", "请选择要转账的代币");
      return false;
    }

    if (!recipientAddress.trim()) {
      Alert.alert("错误", "请输入接收地址");
      return false;
    }

    const transferAmount = parseFloat(tokenAmount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      Alert.alert("错误", "请输入有效的转账金额");
      return false;
    }

    const availableBalance = tokenSymbol.balance || 0;
    if (transferAmount > availableBalance) {
      Alert.alert(
        "错误",
        `余额不足，可用余额: ${tokenSymbol.balance} ${tokenSymbol.symbol}`
      );
      return false;
    }

    return true;
  }, [tokenSymbol, tokenAmount, recipientAddress]);

  const handleTransfer = useCallback(async () => {
    if (!validateTransfer()) return;

    setLoading(true);
    try {
      router.push({
        pathname: "/transfer/send_token",
        params: {
          address: currentAddress,
          symbol: tokenSymbol?.symbol,
          symbol_address: tokenSymbol?.address,
          tokenAmount: tokenAmount,
          recipientAddress,
        },
      });
      // TODO: 实现实际的转账逻辑
      // 判断是 TRC20 代币还是原生 TRX
      // if (tokenSymbol?.address) {
      //   // 有地址的是 TRC20 代币
      //   // await transferTRC20Token(...);
      // } else {
      //   // 没有地址的是原生 TRX
      //   // await transferTRX(...);
      // }
    } catch (error) {
      console.error("Transfer failed:", error);
      Alert.alert("错误", "转账失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [validateTransfer, tokenSymbol]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === "." && tokenAmount.includes(".")) {
        return; // 防止多个小数点
      }
      setTokenAmount((prev) => prev + key);
    },
    [tokenAmount]
  );

  const handleBackspace = useCallback(() => {
    setTokenAmount((prev) => prev.slice(0, -1));
  }, []);

  return (
    // <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "转账",
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

      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        {/* 钱包名称输入 */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.description}>
            可用最大:
            {formatDelimiter(tokenSymbol?.balance || "0", {
              precision: 2,
              prefix: "$",
              suffix: "",
            })}
            <TouchableOpacity
              onPress={() => {
                setTokenAmount(tokenSymbol?.balance?.toString() || "0");
              }}
              activeOpacity={0.7}
            >
              <ThemedText style={{ color: "#fff", marginLeft: 10 }}>
                最大
              </ThemedText>
            </TouchableOpacity>
          </ThemedText>
          <View
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={[
                styles.input,
                { flex: 1, backgroundColor: "transparent", borderWidth: 0 },
              ]}
              value={tokenAmount}
              onChangeText={setTokenAmount}
              placeholder="请输入转移数量"
              placeholderTextColor="#666666"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric" // 或 "number-pad"
            />

            <ThemedView>
              <TouchableOpacity
                onPress={() => setShowTokenModal(true)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="swap-horizontal"
                  size={36}
                  color="#FFFFFF"
                  style={{ transform: [{ rotate: "90deg" }] }}
                />
              </TouchableOpacity>
            </ThemedView>
          </View>
        </View>

        {/* 自定义数字键盘 */}
        <View style={styles.keypad}>
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            [".", "0", "delete"],
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key, colIndex) => {
                if (key === "")
                  return <View key={colIndex} style={styles.key} />;

                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={styles.key}
                    onPress={() =>
                      key === "delete" ? handleBackspace() : handleKeyPress(key)
                    }
                    activeOpacity={0.6}
                  >
                    {key === "delete" ? (
                      <Ionicons
                        name="backspace-outline"
                        size={28}
                        color="#fff"
                      />
                    ) : (
                      <ThemedText style={styles.keyText}>{key}</ThemedText>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleTransfer}>
            <ThemedText style={styles.nextButtonText}>下一步</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* 代币选择弹框 */}
      <Modal
        visible={showTokenModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTokenModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowTokenModal(false)}
          />
          <View style={styles.modalContent}>
            {/* 标题栏 */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLine} />
              <ThemedText style={styles.modalTitle}>选择币种</ThemedText>
            </View>

            {/* 搜索栏 */}
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#8E8E93"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="搜索币种"
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* 代币列表 */}
            {filteredTokens.length === 0 ? (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>暂无代币</ThemedText>
              </View>
            ) : (
              <ScrollView style={styles.tokenList}>
                {filteredTokens.map((item, index) => (
                  <CoinItem
                    key={`${item.symbol}-${index}`}
                    item={item}
                    index={index}
                    handlePress={(selectedToken) => {
                      setTokenSymbol(selectedToken);
                      setTokenAmount("");
                      setShowTokenModal(false);
                      setSearchQuery("");
                    }}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  description: {
    color: "#9E9E9E",
    lineHeight: 22,
    marginBottom: 12,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  maxButton: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontFamily: "IBM Plex Sans",
    fontSize: 30,
    fontWeight: "500",
    letterSpacing: -2.1,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  swapButton: {
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2C",
  },
  nextButton: {
    backgroundColor: "#2196F3",
    borderRadius: 26,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#3C3C3C",
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  // 代币选择弹框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    minHeight: "80%",
  },
  modalHeader: {
    alignItems: "center",
    paddingBottom: 16,
    paddingTop: 8,
  },
  modalHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: "#666666",
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 0,
  },
  tokenList: {
    maxHeight: 500,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 14,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 28,
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
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  keypad: {
    flex: 1,
    justifyContent: "flex-end",
  },
  key: {
    width: width / 3 - 20,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: 28,
    fontWeight: "500",
  },
  headerIcon: {
    padding: 4,
  },
});
