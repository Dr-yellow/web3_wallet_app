import { Page } from "@/components/page/Page";
import { ThemedText } from "@/components/themed-text";
import { FixedBottomButton } from "@/components/ui/FixedBottomButton";
import Touch from "@/components/ui/Touch";
import { SeedPhrase } from "@/components/wallet/SeedPhrase";
import { grayScale } from "@/constants/theme/base";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { generateMnemonic } from "@/utils/wallet/evm-wallet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { toast } from "sonner-native";

export default function SecureWalletScreen() {
  const router = useDebouncedNavigation();
  const params = useLocalSearchParams<{
    walletName?: string;
  }>();
  const { walletName } = params;

  const [mnemonic, setMnemonic] = useState<string>("");
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 页面加载时自动生成助记词
    const newMnemonic = generateMnemonic(128); // 12 词助记词
    setMnemonic(newMnemonic);
    setMnemonicWords(newMnemonic.split(" "));
  }, []);

  const handleCopyMnemonic = async () => {
    await Clipboard.setStringAsync(mnemonic);
    toast.success("已安全复制助记词");
  };

  const handleNext = () => {
    if (!isVisible) {
      setIsVisible(true);
      return;
    }

    router.push({
      pathname: "/wallet-setup/confirm-phrase",
      params: {
        mnemonic,
        walletName,
      },
    });
  };

  return (
    <Page>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
        }}
      />

      <View style={styles.content}>
        <ThemedText style={styles.title}>抄写备份助记词</ThemedText>
        <ThemedText style={styles.subtitle}>
          请按顺序抄写以下单词，并妥善保管，切勿向任何人透露您的助记词，否则你可能失去全部资产。
        </ThemedText>

        <View style={styles.mnemonicContainer}>
          {!isVisible ? (
            <Touch
              style={styles.hiddenOverlay}
              onPress={() => setIsVisible(true)}
            >
              <MaterialCommunityIcons
                name="eye-off-outline"
                size={32}
                color={grayScale[200]}
              />
              <ThemedText style={styles.hiddenText}>点击查看助记词</ThemedText>
            </Touch>
          ) : (
            <SeedPhrase words={mnemonicWords} editable={false} />
          )}
        </View>

        {isVisible && (
          <View style={styles.actionRow}>
            <Touch style={styles.actionButton} onPress={handleCopyMnemonic}>
              <MaterialCommunityIcons
                name="content-copy"
                size={16}
                color="#fff"
              />
              <ThemedText style={styles.actionButtonText}>安全复制</ThemedText>
            </Touch>

            <Touch
              style={styles.actionButton}
              onPress={() => setIsVisible(false)}
            >
              <MaterialCommunityIcons
                name="eye-off-outline"
                size={16}
                color="#fff"
              />
              <ThemedText style={styles.actionButtonText}>隐藏</ThemedText>
            </Touch>
          </View>
        )}
      </View>

      <FixedBottomButton title="完成" onPress={handleNext} />
    </Page>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: grayScale[200],
    lineHeight: 22,
    marginBottom: 32,
  },
  mnemonicContainer: {
    minHeight: 240,
    justifyContent: "center",
  },
  hiddenOverlay: {
    aspectRatio: 1.5,
    backgroundColor: grayScale[400],
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  hiddenText: {
    fontSize: 14,
    color: grayScale[200],
    marginTop: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: grayScale[400],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
});
