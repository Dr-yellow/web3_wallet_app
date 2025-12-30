import { ThemedView } from "@/components/themed-view";
import { colors } from "@/constants/colors";
import { useMultiChain } from "@/context/MultiChainContext";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { getCurrentWalletData, saveWalletAccounts } from "@/utils/wallet";
import { decryptMnemonic } from "@/utils/wallet/crypto-help";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { derivePrivateKey } from "@/utils/wallet/evm-wallet";
import { mnemonicToSeedSync } from "@scure/bip39";
import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { privateKeyToAddress } from "viem/accounts";

type ItemData = {
  id: string;
  title: string;
};

const INITIAL_COUNT = 20; // 首次渲染20条
const LOAD_MORE_COUNT = 10; // 每次加载10条

const getItem = (_data: unknown, index: number): ItemData => ({
  id: `item-${index}`,
  title: `Account #${index + 1}`,
});

export default function selletAccountScreen() {
  const router = useDebouncedNavigation();
  const insets = useSafeAreaInsets();
  const { tronWebProvider } = useMultiChain();
  const [itemCount, setItemCount] = useState(INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getItemCount = useCallback(() => itemCount, [itemCount]);
  const [selectedItems, setSelectedItems] = useState<ItemData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    // 模拟加载延迟，实际使用时可以移除
    setTimeout(() => {
      setItemCount((prev) => prev + LOAD_MORE_COUNT);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore]);

  const handleNext = useCallback(async () => {
    setLoading(true);
    try {
      const walletId = await getCurrentWalletData();
      // console.log("walletId", walletId);
      // console.log("selectedItems", selectedItems);
      if (!walletId) return;
      const res = await decryptMnemonic(
        walletId.encryptedData as string,
        walletId.walletId,
        walletId.salt as string
      );
      // console.log("解密获取助记词", res);
      // console.log("selectedIndex", selectedIndex);
      const ethPath = `m/44'/60'/${selectedIndex}'/0/0`;
      const tronPath = `m/44'/195'/${selectedIndex}'/0/0`;
      const seed = mnemonicToSeedSync(res as string);
      const ethPrivateKey = derivePrivateKey(seed, ethPath);
      const tronPrivateKey = derivePrivateKey(seed, tronPath);

      let tronPrivateKeyBuffer = "";
      if (tronPrivateKey.startsWith("0x")) {
        tronPrivateKeyBuffer = tronPrivateKey.slice(2);
      } else {
        tronPrivateKeyBuffer = tronPrivateKey;
      }

      const ethAddress = privateKeyToAddress(ethPrivateKey as `0x${string}`);
      const tronAddress =
        tronWebProvider.address.fromPrivateKey(tronPrivateKeyBuffer);

      console.log("ethAddress", ethAddress);
      console.log("tronAddress", tronAddress);
      await saveWalletAccounts(walletId.walletId, [
        {
          index: selectedIndex,
          evm: {
            address: ethAddress,
            path: ethPath,
          },
          tron: {
            address: tronAddress as string,
            path: tronPath,
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
          title: "选择账户",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#000",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.replace("/wallet-setup/high-setting")}
              style={styles.headerIcon}
            >
              <Ionicons name="settings-outline" size={28} color="#fff" />
            </TouchableOpacity>
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
      <VirtualizedList
        style={styles.content}
        initialNumToRender={20}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              console.log("item", item, index);
              setSelectedItems(item);
              setSelectedIndex(index);
            }}
          >
            <View
              style={[
                styles.item,
                selectedIndex === index && styles.selectedItem,
              ]}
            >
              <Text style={styles.listTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Button
          size="lg"
          title={loading ? "加载中…" : "下一步"}
          onPress={handleNext}
          disabled={loading}
        />
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
    borderRadius: 12,
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
    justifyContent: "center",
    marginVertical: 8,
    borderRadius: 38,
    paddingHorizontal: 24,
  },
  selectedItem: {
    backgroundColor: "#1F1F1F",
  },
  listTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: -1.05,
  },
});
