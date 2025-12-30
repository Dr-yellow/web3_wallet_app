import { ThemedView } from "@/components/themed-view";
import { colors } from "@/constants/colors";
import { useMultiChain } from "@/context/MultiChainContext";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { getCurrentWalletData, saveWalletAccounts } from "@/utils/wallet";
import { Ionicons } from "@expo/vector-icons";

import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { privateKeyToAddress } from "viem/accounts";

const EVM_ICON = require("@/assets/images/chain/evm.png");
const TRON_ICON = require("@/assets/images/chain/tron.png");

type ItemData = {
  id: string;
  title: string;
};

const CHAIN_LIST = [
  {
    id: "tron",
    title: "Tron",
    icon: TRON_ICON,
    color: "#41131E",
  },
  {
    id: "evm",
    title: "Ethereum",
    icon: EVM_ICON,
    color: "#4971FF",
  },
];

export default function selletAccountScreen() {
  const router = useDebouncedNavigation();
  const insets = useSafeAreaInsets();
  const { tronWebProvider } = useMultiChain();
  const { privateKey } = useLocalSearchParams<{ privateKey: string }>();

  const [selectedItems, setSelectedItems] = useState<ItemData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = useCallback(async () => {
    try {
      const walletId = await getCurrentWalletData();
      if (!walletId) return;

      // 通过私钥获取地址
      const ethAddress = privateKeyToAddress(
          ("0x" + privateKey) as `0x${string}`
        ),
        tronAddress = tronWebProvider.address.fromPrivateKey(privateKey);
      // 保存账户信息
      await saveWalletAccounts(walletId.walletId, [
        {
          index: selectedIndex,
          evm: {
            address: ethAddress,
            path: "",
          },
          tron: {
            address: tronAddress as string,
            path: "",
          },
        },
      ]);
      router.replace("/home");
    } catch (error) {
      console.error("[selletAccountScreen] Error loading wallets:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedItems, selectedIndex, tronWebProvider, setLoading]);

  return (
    <ThemedView style={[styles.container]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "选择网络",
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
      <View style={styles.content}>
        {CHAIN_LIST.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              setSelectedIndex(index);
            }}
          >
            <View
              style={[
                styles.item,
                index === selectedIndex && styles.selectedItem,
              ]}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Image
                  source={item.icon}
                  style={[item.id === "evm" ? styles.iconImage : styles.icon]}
                />
              </View>
              <Text style={styles.listTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          disabled={loading}
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleNext}
        >
          <Text style={[styles.nextButtonText]}>
            {loading ? "加载中..." : "确认"}
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: StatusBar.currentHeight || 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 32,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  nextButtonTextDisabled: {
    color: colors.textTertiary,
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
  item: {
    height: 54,
    marginVertical: 8,
    borderRadius: 38,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectedItem: {
    backgroundColor: "#1F1F1F",
  },
  listTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: -1.05,
  },
  icon: {
    width: 18,
    height: 18,
  },
  iconImage: {
    width: 11,
    height: 18,
  },
  iconContainer: {
    width: 41,
    height: 41,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
  },
});
