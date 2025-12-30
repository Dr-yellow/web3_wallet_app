import { Page } from "@/components/page/Page";
import { ThemedText } from "@/components/themed-text";
import Touch from "@/components/ui/Touch";
import { grayScale } from "@/constants/theme/base";
import { useMultiChain } from "@/context/MultiChainContext";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { getCurrentWalletData, saveWalletAccounts } from "@/utils/wallet";
import { decryptMnemonic } from "@/utils/wallet/crypto-help";
import { derivePrivateKey } from "@/utils/wallet/evm-wallet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { mnemonicToSeedSync } from "@scure/bip39";
import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { privateKeyToAddress } from "viem/accounts";

interface OptionCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  title,
  description,
  onPress,
}) => {
  return (
    <Touch style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionIconContainer}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.optionContent}>
        <ThemedText style={styles.optionTitle}>{title}</ThemedText>
        <ThemedText style={styles.optionDescription}>{description}</ThemedText>
      </View>
    </Touch>
  );
};

export default function HighSettingScreen() {
  const router = useDebouncedNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const [account, setAccount] = useState("0");
  const [change, setChange] = useState("0");
  const [addressIndex, setAddressIndex] = useState("0");
  const [loading, setLoading] = useState(false);
  const { tronWebProvider } = useMultiChain();

  const handleImportMnemonic = () => {
    const ethPath = `m/44'/60'/0'/0/0`;
    const tronPath = `m/44'/195'/0'/0/0`;
    createAccount({ ethPath, tronPath });
  };

  const handleOpenPathModal = () => {
    setModalVisible(true);
  };

  const handlePasswordCancel = () => {
    setModalVisible(false);
    setAccount("0");
    setChange("0");
    setAddressIndex("0");
  };

  const createAccount = async ({
    ethPath,
    tronPath,
    index = 0,
  }: {
    ethPath: string;
    tronPath: string;
    index?: number;
  }) => {
    try {
      const walletId = await getCurrentWalletData();

      if (!walletId) return;
      const res = await decryptMnemonic(
        walletId.encryptedData as string,
        walletId.walletId,
        walletId.salt as string
      );

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

      await saveWalletAccounts(walletId.walletId, [
        {
          index,
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
      console.error("[createAccount] Error loading wallets:", error);
    } finally {
      handlePasswordCancel();
    }
  };

  const handlePathConfirm = useCallback(() => {
    setLoading(true);
    if (!account || !change || !addressIndex) {
      Alert.alert("提示", "请输入完整的路径");
      setLoading(false);
      return;
    }
    if (
      isNaN(Number(account)) ||
      isNaN(Number(change)) ||
      isNaN(Number(addressIndex))
    ) {
      Alert.alert("提示", "请输入正确的路径");
      setLoading(false);
      return;
    }
    const accountNumber = parseInt(account);
    const changeNumber = parseInt(change);
    const addressIndexNumber = parseInt(addressIndex);

    const ethPath = `m/44'/60'/${accountNumber}'/${changeNumber}/${addressIndexNumber}`;
    const tronPath = `m/44'/195'/${accountNumber}'/${changeNumber}/${addressIndexNumber}`;
    createAccount({ ethPath, tronPath, index: accountNumber });
  }, [setLoading, account, change, addressIndex]);

  return (
    <Page>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "高级设置",
          headerTitleAlign: "center",
        }}
      />

      <View style={styles.optionsContainer}>
        <OptionCard
          icon="cog-outline"
          title="自定义路径"
          description="m/44'/coin_type'/0'/0/0"
          onPress={handleOpenPathModal}
        />
        <OptionCard
          icon="login-variant"
          title="快速前往账户"
          description="跳转到指定区块链账户"
          onPress={handleImportMnemonic}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handlePasswordCancel}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalBody}>
              <ThemedText style={styles.modalHint}>请输入账户路径</ThemedText>

              <View style={styles.pathContainer}>
                <ThemedText style={styles.pathText}>
                  m/44'/coin_type'/
                </ThemedText>
                <TextInput
                  style={styles.pathInput}
                  value={account}
                  onChangeText={setAccount}
                  placeholder="account"
                  placeholderTextColor={grayScale[300]}
                  keyboardType="numeric"
                  autoFocus
                  maxLength={3}
                />
                <ThemedText style={styles.pathText}>/ </ThemedText>
                <TextInput
                  style={styles.pathInput}
                  value={change}
                  onChangeText={setChange}
                  placeholder="change"
                  placeholderTextColor={grayScale[300]}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <ThemedText style={styles.pathText}> / </ThemedText>
                <TextInput
                  style={styles.pathInput}
                  value={addressIndex}
                  onChangeText={setAddressIndex}
                  placeholder="address_index"
                  placeholderTextColor={grayScale[300]}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              <View style={styles.modalButtons}>
                <Touch
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handlePasswordCancel}
                >
                  <ThemedText style={styles.modalButtonCancelText}>
                    取消
                  </ThemedText>
                </Touch>
                <Touch
                  style={[
                    styles.modalButton,
                    styles.modalButtonConfirm,
                    loading && styles.modalButtonDisabled,
                  ]}
                  onPress={handlePathConfirm}
                  disabled={loading}
                >
                  <ThemedText style={styles.modalButtonConfirmText}>
                    {loading ? "创建中..." : "确认"}
                  </ThemedText>
                </Touch>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Page>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    gap: 32,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: grayScale[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: grayScale[200],
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: grayScale[400],
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  modalBody: {
    width: "100%",
  },
  modalHint: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  pathContainer: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  pathText: {
    color: "#fff",
    fontSize: 15,
  },
  pathInput: {
    backgroundColor: grayScale[300],
    borderRadius: 8,
    paddingHorizontal: 8,
    color: "#fff",
    fontSize: 16,
    minWidth: 40,
    height: 32,
    textAlign: "center",
    marginHorizontal: 2,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonCancel: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  modalButtonConfirm: {
    backgroundColor: "#fff",
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonCancelText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalButtonConfirmText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});
