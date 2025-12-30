/**
 * 备份助记词页面
 * 显示助记词并引导用户备份
 */
import { ThemedView } from "@/components/themed-view";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { generateMnemonic } from "@/utils/wallet/evm-wallet";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BackupMnemonicScreen() {
  const router = useDebouncedNavigation();
  const params = useLocalSearchParams<{
    walletName?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { walletName } = params;
  const [mnemonic, setMnemonic] = useState<string>("");
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateMnemonic = () => {
    // 生成助记词
    const newMnemonic = generateMnemonic(128); // 12 词助记词
    setMnemonic(newMnemonic);
    setMnemonicWords(newMnemonic.split(" "));
    setHasGenerated(true);
  };

  const handleShowMnemonic = () => {
    Alert.alert(
      "重要提醒",
      "请确保在安全的环境中查看助记词，不要截屏或通过网络传输。",
      [
        { text: "取消", style: "cancel" },
        {
          text: "我已了解",
          onPress: () => setIsVisible(true),
        },
      ]
    );
  };

  const handleCopyMnemonic = () => {
    if (!isVisible) {
      Alert.alert("提示", "请先显示助记词");
      return;
    }
    Clipboard.setString(mnemonic);
    Alert.alert("已复制", "助记词已复制到剪贴板");
  };

  const handleVerifyBackup = () => {
    if (!isVisible) {
      Alert.alert("提示", "请先显示并备份助记词");
      return;
    }
    if (!mnemonic || !mnemonic.trim()) {
      Alert.alert("错误", "助记词未生成，请重新生成");
      return;
    }

    // 导航到验证助记词页面

    router.push({
      pathname: "/wallet-setup/confirm-phrase",
      params: {
        mnemonic: mnemonic,
        walletName: walletName,
      },
    });
  };

  const handleBackupLater = () => {
    Alert.alert(
      "提示",
      "助记词是恢复钱包的唯一凭证，请务必妥善保管。建议立即备份。",
      [
        { text: "稍后备份", onPress: () => router.back() },
        { text: "立即备份", onPress: () => {} },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container]}>
      {/* 头部导航栏 */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "创建助记词",
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasGenerated ? (
          // 初始说明页面
          <View style={styles.initialSection}>
            {/* 标题和说明 */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>备份助记词，保护钱包安全</Text>
              <Text style={styles.description}>
                助记词是恢复钱包的凭证，并且仅保存在您的设备中。请您务必做好备份，以便将来需要的时候进行恢复
              </Text>
            </View>

            {/* 重要提醒 */}
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>① 重要提醒</Text>
              <Text style={styles.warningText}>
                任何人，只要获取到助记词，就可以控制您的资产
              </Text>
            </View>

            {/* 建议备份方法 */}
            <View style={styles.backupMethodsSection}>
              <Text style={styles.methodsTitle}>建议备份方法</Text>
              <View style={styles.methodsList}>
                <Text style={styles.methodItem}>
                  - 使用笔和纸，将助记词按顺序正确抄写
                </Text>

                <Text style={styles.methodItem}>- 将助记词保存在安全地方</Text>
                <Text style={styles.methodItem}>
                  - 不可将助记词进行网络存储与传输
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* 说明文字 */}
            <Text style={styles.instructionText}>
              请务必准确抄写您的助记词，并妥善保存在安全地点。切勿截屏或通过网络存储和传输。以免造成泄露。
            </Text>

            {/* 助记词显示区域 */}
            <View style={styles.mnemonicSection}>
              <View style={styles.mnemonicHeader}>
                <Text style={styles.mnemonicLabel}>助记词 (12个单词)</Text>
                {/* <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => Alert.alert("提示", "显示二维码功能待实现")}
                >
                  <MaterialCommunityIcons
                    name="qrcode"
                    size={20}
                    color="#2196F3"
                  />
                  <Text style={styles.qrButtonText}>显示二维码</Text>
                </TouchableOpacity> */}
              </View>

              {!isVisible ? (
                <TouchableOpacity
                  style={styles.hiddenMnemonicContainer}
                  onPress={handleShowMnemonic}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="eye-off"
                    size={64}
                    color="#FF5252"
                  />
                  <Text style={styles.hiddenText}>点击展示助记词</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.mnemonicGrid}>
                  {mnemonicWords.map((word, index) => (
                    <View key={index} style={styles.mnemonicWord}>
                      <Text style={styles.wordIndex}>{index + 1}</Text>
                      <Text style={styles.wordText}>{word}</Text>
                    </View>
                  ))}
                </View>
              )}

              {isVisible && (
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyMnemonic}
                >
                  <Text style={styles.copyButtonText}>复制助记词</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* 底部按钮 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {!hasGenerated ? (
          <>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateMnemonic}
              activeOpacity={0.7}
            >
              <Text style={styles.generateButtonText}>生成助记词</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyBackup}
              disabled={!isVisible}
              activeOpacity={0.7}
            >
              <Text style={styles.verifyButtonText}>验证备份</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.laterButton}
              onPress={handleBackupLater}
            >
              <Text style={styles.laterButtonText}>稍后再备份</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  instructionText: {
    color: "#9E9E9E",
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 24,
  },
  backupMethodSection: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    padding: 4,
  },

  mnemonicSection: {
    marginBottom: 24,
  },
  mnemonicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  mnemonicLabel: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrButtonText: {
    color: "#2196F3",
    marginLeft: 4,
  },
  hiddenMnemonicContainer: {
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  hiddenText: {
    color: "#FF5252",
    marginTop: 16,
    fontWeight: "500",
  },
  mnemonicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    padding: 4,
    gap: 8,
  },
  mnemonicWord: {
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  wordIndex: {
    color: "#666666",
    marginRight: 8,
    minWidth: 20,
  },
  wordText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  copyButton: {
    marginTop: 16,
    alignItems: "center",
  },
  copyButtonText: {
    color: "#2196F3",
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2C",
    paddingHorizontal: 20,
  },
  verifyButton: {
    backgroundColor: "#2196F3",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    opacity: 1,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
  },
  laterButton: {
    alignItems: "center",
  },
  laterButtonText: {
    color: "#2196F3",
    fontSize: 18,
    fontWeight: "600",
  },
  initialSection: {
    paddingTop: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    color: "#9E9E9E",
    lineHeight: 22,
  },
  warningBox: {
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningTitle: {
    color: "#D32F2F",
    fontWeight: "bold",
    marginBottom: 8,
  },
  warningText: {
    color: "#D32F2F",
    lineHeight: 22,
  },
  backupMethodsSection: {
    marginBottom: 24,
  },
  methodsTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 16,
  },
  methodsList: {
    gap: 12,
  },
  methodItem: {
    color: "#9E9E9E",
    lineHeight: 22,
  },
  generateButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  generateButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 18,
  },
  advancedButton: {
    alignItems: "center",
  },
  advancedButtonText: {
    color: "#2196F3",
  },
});
