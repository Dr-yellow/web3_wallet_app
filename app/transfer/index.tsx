import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { grayScale } from "@/constants/theme/base";
import { useMultiChain } from "@/context/MultiChainContext";
import { toast } from "sonner-native";

const { width } = Dimensions.get("window");

export default function TransferScreen() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const { currentChain, tronWebProvider } = useMultiChain();

  const tabs = [
    { id: "recent", label: "最近使用" },
    { id: "my-wallets", label: "我的钱包" },
    { id: "address-book", label: "地址簿" },
  ];

  const recentAddresses = [
    {
      id: "1",
      name: "0x8819...bbbd7",
      fullAddress: "0x8819e0702955897b3d4e1a313792e1b d6fdbbd7",
      icon: "wallet",
      iconColor: "#0066FF",
    },
    {
      id: "2",
      name: "OKX",
      fullAddress: "0x8819e0702955897b3d4e1a313792e1b d6fdbbd7",
      icon: "cube-outline",
      iconColor: "#00A478",
    },
  ];

  const handleNext = useCallback(() => {
    // 逻辑：跳转到下一步
    console.log("Next with address:", address);
    const recipientAddress = address.trim();
    // 验证地址格式（Tron 地址应该是 base58 格式）
    if (tronWebProvider.isAddress(recipientAddress)) {
      // toast.error("接收者地址格式不正确");

      router.push({
        pathname: "/transfer/tron",
        params: { recipientAddress: recipientAddress as string },
      });
    }
  }, [address, tronWebProvider, router]);
  async function handlePaste() {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setAddress(text);
      } else {
        // 用户可能点击了“不允许”或者剪贴板真的为空
        toast.error("无法读取粘贴内容，请检查权限或剪贴板内容。");
      }
    } catch (error: any) {
      console.error("读取剪贴板时发生错误: ", error);
      alert("读取剪贴板时发生错误: " + error.message);
    }
  }

  return (
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
          headerRight: () => (
            <TouchableOpacity style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="scan-helper"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 输入区域 */}
          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIndicator} />
              <TextInput
                style={styles.input}
                placeholder="输入钱包地址或域名"
                placeholderTextColor={grayScale[200]}
                value={address}
                onChangeText={setAddress}
                selectionColor="#fff"
                multiline
                numberOfLines={2}
                blurOnSubmit={true}
              />
            </View>

            <View style={styles.pasteRow}>
              <TouchableOpacity
                style={styles.pasteButton}
                onPress={handlePaste}
              >
                <MaterialCommunityIcons
                  name="content-paste"
                  size={18}
                  color="#fff"
                />
                <ThemedText style={styles.pasteText}>粘贴</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 分类 Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* 地址列表 */}
          <View style={styles.listContainer}>
            {recentAddresses.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.addressItem}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.addressIcon,
                    { backgroundColor: item.iconColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={22}
                    color="#fff"
                  />
                </View>
                <View style={styles.addressInfo}>
                  <ThemedText style={styles.addressName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.addressFull} numberOfLines={1}>
                    {item.fullAddress}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* 底部按钮 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !address && activeTab === "recent" && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!address && activeTab === "recent"}
          >
            <ThemedText style={styles.nextButtonText}>下一步</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  inputSection: {
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 100,
  },
  inputIndicator: {
    width: 4,
    height: 36,
    backgroundColor: "#fff",
    marginRight: 12,
    marginTop: 6,
    borderRadius: 2,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    paddingTop: 0,
    textAlignVertical: "top",
  },
  pasteRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  pasteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: grayScale[300],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  pasteText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  tab: {
    backgroundColor: grayScale[300],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: grayScale[200],
  },
  activeTabText: {
    color: "#000",
  },
  listContainer: {
    gap: 20,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  addressIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  addressFull: {
    fontSize: 13,
    color: grayScale[200],
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    backgroundColor: "#000",
  },
  nextButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333", // 深灰色背景
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#888", // 灰色文字
  },
});
