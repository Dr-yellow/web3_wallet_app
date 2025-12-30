import { ThemedView } from "@/components/themed-view";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { setCurrentWallet, validatePrivateKey } from "@/utils/wallet";
import { encryptMnemonic } from "@/utils/wallet/crypto-help";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack } from "expo-router";
import { Copy } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NameWallet() {
  const router = useDebouncedNavigation();
  const insets = useSafeAreaInsets();
  const [privateKey, setPrivateKey] = useState("");

  const handleNext = useCallback(async () => {
    const walletId = `wallet_${Date.now()}`;

    if (!privateKey.trim()) {
      Alert.alert("错误", "请输入钱包名称");
      return;
    }
    if (!validatePrivateKey(privateKey)) {
      Alert.alert("错误", "请输入正确的私钥");
      return;
    }

    const { encryptedData, salt } = await encryptMnemonic(
      privateKey as string,
      walletId
    );

    await setCurrentWallet(walletId, encryptedData, salt);
    router.push({
      pathname: "./select-network",
      params: { privateKey },
    });
  }, [privateKey]);

  async function handlePaste() {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setPrivateKey(text);
      } else {
        // 用户可能点击了“不允许”或者剪贴板真的为空
        alert("无法读取粘贴内容，请检查权限或剪贴板内容。");
      }
    } catch (error: any) {
      console.error("读取剪贴板时发生错误: ", error);
      alert("读取剪贴板时发生错误: " + error.message);
    }
  }
  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "导入私钥钱包",
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
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 钱包名称输入 */}
          <View style={styles.inputSection}>
            <TextInput
              value={privateKey}
              onChangeText={setPrivateKey}
              style={styles.textArea}
              placeholder="请输入私钥"
              placeholderTextColor="#666666"
              multiline
              numberOfLines={4}
              autoCapitalize="none"
              autoCorrect={false}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handlePaste}>
              <Copy size={15} color={"#fff"} />
              <Text style={styles.actionButtonText}>粘贴</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 下一步按钮 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !privateKey.trim() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!privateKey.trim()}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>下一步</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  inputSection: {
    marginBottom: 32,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2C",
  },
  nextButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.8)",
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  textArea: {
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#3C3C3C",
    minHeight: 120,
    textAlignVertical: "top",
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
});
