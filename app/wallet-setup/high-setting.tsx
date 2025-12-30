import { ThemedView } from "@/components/themed-view";
import { useMultiChain } from "@/context/MultiChainContext";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { getCurrentWalletData, saveWalletAccounts } from "@/utils/wallet";
import { decryptMnemonic } from "@/utils/wallet/crypto-help";
import { derivePrivateKey } from "@/utils/wallet/evm-wallet";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { mnemonicToSeedSync } from "@scure/bip39";
import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
    <TouchableOpacity
      style={styles.optionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AddAcountScreen() {
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

  const handleImportCloudBackup = () => {
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
      return;
    }
    if (
      isNaN(Number(account)) ||
      isNaN(Number(change)) ||
      isNaN(Number(addressIndex))
    ) {
      Alert.alert("提示", "请输入正确的路径");
      return;
    }
    const accountNumber = parseInt(account);
    const changeNumber = parseInt(change);
    const addressIndexNumber = parseInt(addressIndex);

    const ethPath = `m/44'/60'/${accountNumber}'/${changeNumber}/${addressIndexNumber}`;
    const tronPath = `m/44'/195'/${accountNumber}'/${changeNumber}/${addressIndexNumber}`;
    console.log("ethPath", ethPath);
    console.log("tronPath", tronPath);
    createAccount({ ethPath, tronPath, index: accountNumber });
  }, [setLoading, account, change, addressIndex]);

  return (
    <ThemedView style={[styles.container]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "高级设置",
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
      {/* 选项卡片列表 */}
      <View style={styles.optionsContainer}>
        <OptionCard
          icon="cookie-settings"
          title="自定义路径"
          description="m/44'/coin_type'/0'/0/0"
          onPress={handleImportCloudBackup}
        />
        <OptionCard
          icon="open-in-new"
          title="快速前往账户"
          description="跳转到指定区块链账户"
          onPress={handleImportMnemonic}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handlePasswordCancel}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalBody}>
              <Text style={styles.modalHint}>请输入账户路径</Text>

              <View style={styles.pathContainer}>
                <Text style={styles.pathText}>m/44'/coin_type'/</Text>
                <TextInput
                  style={styles.pathInput}
                  value={account}
                  onChangeText={setAccount}
                  placeholder="account"
                  placeholderTextColor="#666666"
                  keyboardType="numeric"
                  autoFocus
                  maxLength={3}
                />
                <Text style={styles.pathText}>/ </Text>
                <TextInput
                  style={styles.pathInput}
                  value={change}
                  onChangeText={setChange}
                  placeholder="change"
                  placeholderTextColor="#666666"
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.pathText}> / </Text>
                <TextInput
                  style={styles.pathInput}
                  value={addressIndex}
                  onChangeText={setAddressIndex}
                  placeholder="address_index"
                  placeholderTextColor="#666666"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handlePasswordCancel}
                >
                  <Text style={styles.modalButtonCancelText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.modalButtonConfirm,
                    loading && styles.modalButtonDisabled,
                  ]}
                  onPress={handlePathConfirm}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonConfirmText}>
                    {loading ? "创建中..." : "确认"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  optionsContainer: {
    marginTop: StatusBar.currentHeight || 0,
    gap: 36,
    paddingHorizontal: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 0,
  },
  optionIconContainer: {
    width: 41,
    height: 41,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 17,
  },
  optionContent: {
    flex: 1,
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 18,
    letterSpacing: -0.07,
  },
  optionDescription: {
    fontSize: 15,
    fontWeight: "400",
    color: "#999999",
    letterSpacing: -0.07,
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "60%",
  },

  modalBody: {
    paddingHorizontal: 20,
  },
  modalHint: {
    color: "#9E9E9E",
    marginBottom: 20,
    lineHeight: 20,
  },

  pathContainer: {
    backgroundColor: "#121212",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  pathText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter",
  },

  pathInput: {
    backgroundColor: "#1d1d1d",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: "#FFFFFF",
    fontSize: 16,
    minWidth: 70,
    textAlign: "center",
    marginHorizontal: 2,
    height: 32,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#141414",
  },
  modalButtonConfirm: {
    backgroundColor: "#fff",
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonCancelText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 17,
  },
  modalButtonConfirmText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 17,
  },
});
