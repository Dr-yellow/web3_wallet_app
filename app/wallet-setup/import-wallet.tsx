import { ThemedView } from "@/components/themed-view";

import { SeedPhrase } from "@/components/wallet/SeedPhrase";
import { colors } from "@/constants/colors";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { setCurrentWallet, validateMnemonic } from "@/utils/wallet";
import { encryptMnemonic } from "@/utils/wallet/crypto-help";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack } from "expo-router";
import { Copy } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function ImportWalletScreen() {
  const router = useDebouncedNavigation();
  const insets = useSafeAreaInsets();
  const [secretWords, setSecretWords] = useState<string[]>(Array(12).fill(""));

  const handleWordChange = (index: number, text: string) => {
    const newWords = [...secretWords];
    newWords[index] = text.trim().toLowerCase();
    setSecretWords(newWords);
  };

  const handlePaste = async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();

      if (!clipboardContent.trim()) {
        toast.error("Empty Clipboard! No text found in clipboard");
        return;
      }

      const words = clipboardContent.trim().split(/\s+/).slice(0, 12);

      if (words.length < 12) {
        toast.error(
          `Invalid Phrase! Found only ${words.length} words in clipboard. Please ensure you have exactly 12 words.`
        );
        return;
      }

      const newWords = [...secretWords];
      words.forEach((word, index) => {
        if (index < 12) {
          newWords[index] = word.toLowerCase().trim();
        }
      });
      setSecretWords(newWords);

      toast.success("12 words have been pasted from clipboard");
    } catch (error) {
      console.error("Paste error:", error);
      toast.error("Could not paste from clipboard");
    }
  };

  const handleScanText = () => {
    Alert.alert(
      "Scan Text",
      "Camera functionality would open here to scan QR code or text",
      [{ text: "OK" }]
    );
  };

  const isFormValid = () => {
    return secretWords.every((word) => word.trim().length > 0);
  };

  const handleImportWallet = useCallback(async () => {
    if (!isFormValid()) {
      Alert.alert(
        "Incomplete",
        "Please fill in all 12 words of your secret phrase",
        [{ text: "OK" }]
      );
      return;
    }

    // Join the words into a seed phrase
    const seedPhrase = secretWords.join(" ");

    // Validate the seed phrase
    if (!validateMnemonic(seedPhrase)) {
      Alert.alert(
        "Invalid Seed Phrase",
        "Please check your seed phrase. Make sure all words are spelled correctly and contain only lowercase letters.",
        [{ text: "OK" }]
      );
      return;
    }

    const walletId = `wallet_${Date.now()}`;

    const { encryptedData, salt } = await encryptMnemonic(seedPhrase, walletId);
    await setCurrentWallet(walletId, encryptedData, salt);
    Alert.alert("成功", "钱包创建成功！", [
      {
        text: "确定",
        onPress: () => {
          router.replace({
            pathname: "/wallet-setup/selletAccount",
          });
        },
      },
    ]);
  }, [secretWords]);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "导入助记词钱包",
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
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>请输入您的助记词</Text>

          <SeedPhrase
            words={secretWords}
            editable={true}
            onWordChange={handleWordChange}
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handlePaste}>
              <Copy size={15} color={"#fff"} />
              <Text style={styles.actionButtonText}>粘贴</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[
            styles.importButton,
            !isFormValid() && styles.importButtonDisabled,
          ]}
          onPress={handleImportWallet}
        >
          <Text
            style={[
              styles.importButtonText,
              !isFormValid() && styles.importButtonTextDisabled,
            ]}
          >
            确认
          </Text>
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
});
