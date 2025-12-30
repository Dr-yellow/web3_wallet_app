import {
  getAccountIdentity,
  loginByStartWallet,
  verifyWalletLogin,
} from "@/api/app/auth";
import {
  AuthWalletLoginStartResponse,
  AuthWalletLoginVerifyRequest,
} from "@/api/type/login";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { API_CODE } from "@/constants/auth";
import { grayScale } from "@/constants/theme/base";
import { useAuth } from "@/context/AuthContext";
import { useMultiChain } from "@/context/MultiChainContext";
import { tokenStore } from "@/utils/auth/tokenStore";
import { decryptMnemonic } from "@/utils/wallet/crypto-help";
import {
  getCurrentWalletData,
  getCurrentWalletId,
  getWalletAccounts,
} from "@/utils/wallet/wallet-storage";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Trx } from "tronweb";

function signMessage(msg: string, privateKey: string) {
  const signature = Trx.signMessageV2(msg, privateKey); // sign the message hash, not message
  return signature;
}

function buildMessage(msg: AuthWalletLoginStartResponse): string {
  const chain_name = "TRON";
  const text = [
    `${msg.domain} wants you to sign in with your ${chain_name} account:`,
    msg.address,
    "",
    msg.statement,
    "",
    `URI: ${msg.uri}`,
    `Version: ${msg.version}`,
    `Chain ID: ${msg.chain_id}`,
    `Nonce: ${msg.nonce}`,
    `Issued At: ${msg.issued_at}`,
    `Expiration Time: ${msg.expiration_time}`,
  ]
    .filter((line, idx, arr) => {
      return !(line === "" && arr[idx - 1] === "");
    })
    .join("\n");

  return text;
}

export default function VerifySignatureScreen() {
  const router = useRouter();
  const { tronWebProvider } = useMultiChain();
  const { setUserData } = useAuth();

  const [currentWalletInfo, setCurrentWalletInfo] = useState<{
    address: string;
    network: string;
  } | null>(null);
  const [signText, setSignText] = useState<string | null>(null);
  const [verifyParams, setVerifyParams] =
    useState<AuthWalletLoginVerifyRequest | null>(null);

  const getAllWallets = async () => {
    const currentWalletId = await getCurrentWalletId();
    if (currentWalletId) {
      // setCurrentWalletId(currentWalletId);
      const walletAccounts = await getWalletAccounts(currentWalletId);

      walletAccounts.forEach(async (account) => {
        if (account.tron) {
          setCurrentWalletInfo({
            address: account.tron.address,
            network: "tron",
          });
        }
      });
    }
  };

  useEffect(() => {
    getAllWallets();
  }, []);
  useEffect(() => {
    if (currentWalletInfo) {
      getSignature({
        address: currentWalletInfo.address, //TC4XgnLdQivxp9fnkDZeuLRrYVjFLbeiRr
        chain_id: "728126428",
      });
    }
  }, [currentWalletInfo]);
  const getTronPubKeyFromPrivateKey = (privateKeyHex: string): string => {
    const priKeyBytes =
      tronWebProvider.utils.code.hexStr2byteArray(privateKeyHex);
    const pubKeyBytes2 =
      tronWebProvider.utils.crypto.getPubKeyFromPriKey(priKeyBytes);

    return tronWebProvider.utils.code.byteArray2hexStr(pubKeyBytes2);
  };
  const getSignature = async ({
    address,
    chain_id,
  }: {
    address: string;
    chain_id: string;
  }) => {
    try {
      const currentWalletData = await getCurrentWalletData();
      const privateKey = decryptMnemonic(
        currentWalletData?.encryptedData as string,
        currentWalletData?.walletId as string,
        currentWalletData?.salt as string
      );

      const pkToAddress = getTronPubKeyFromPrivateKey(privateKey as string);

      // 请求
      const res = await loginByStartWallet({
        address,
        chain_id,
      });

      if (res?.code === API_CODE.SUCCESS) {
        const signatureText = buildMessage(res.data);
        setSignText(signatureText);
        const signature = signMessage(signatureText, privateKey as string);

        const messageBase64 = Buffer.from(signatureText, "utf8").toString(
          "base64"
        );

        const verifyParams = {
          message: messageBase64,
          signature: signature,
          public_key: pkToAddress,
          raw_message: res.data,
        };
        setVerifyParams(verifyParams);
      }
    } catch (error) {
      console.error("getSignature error", error);
      return null;
    }
  };

  const handleConfirm = useCallback(async () => {
    try {
      if (verifyParams) {
        const verifyRes = await verifyWalletLogin(verifyParams);
        if (verifyRes?.code === API_CODE.SUCCESS) {
          const { access_token, refresh_token, user_id } = verifyRes.data;
          await tokenStore.set(access_token, refresh_token, user_id);
          const userInfo = await getAccountIdentity();
          await setUserData(userInfo.data);
          router.dismissAll();
        }
      }
    } catch (error) {
      console.error("handleConfirm error", error);
    }
  }, [verifyParams]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "离线签名登录" }} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Signature Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/guide1.png")} // Using similar asset or placeholder
            style={styles.signatureIcon}
            resizeMode="contain"
          />
        </View>

        {/* Domain Info */}
        <View style={styles.domainContainer}>
          <View style={styles.logoAndText}>
            <View style={styles.gmLogo}>
              <LinearGradient
                colors={["#fff", "#666"]}
                style={styles.logoGradient}
              />
            </View>
            <ThemedText style={styles.domainText}>
              verify.gmwallet.me
            </ThemedText>
          </View>
        </View>

        {/* Network Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>网络</ThemedText>
          <TouchableOpacity style={styles.selectorRow}>
            <View style={styles.selectorLeft}>
              <View
                style={[
                  styles.networkIcon,
                  {
                    backgroundColor:
                      currentWalletInfo?.network === "tron"
                        ? "#FF0012"
                        : "#627EEA",
                  },
                ]}
              >
                {currentWalletInfo?.network === "tron" ? (
                  <MaterialCommunityIcons
                    name="triangle"
                    size={14}
                    color="#fff"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="ethereum"
                    size={14}
                    color="#fff"
                  />
                )}
              </View>
              <ThemedText style={styles.selectorText}>
                {currentWalletInfo?.network}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={grayScale[200]} />
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#00A478"
            />
            <ThemedText style={styles.infoText}>
              离线签名不产生矿工费
            </ThemedText>
          </View>
        </View>

        {/* Wallet Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>当前钱包</ThemedText>
          <TouchableOpacity style={styles.selectorRow}>
            <View style={styles.selectorLeft}>
              <ThemedText style={styles.addressText} numberOfLines={2}>
                {currentWalletInfo?.address}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={grayScale[200]} />
          </TouchableOpacity>
        </View>

        {/* Signature Data */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>签名数据</ThemedText>
          <View style={styles.dataContainer}>
            <ThemedText style={styles.dataDescription}>
              {signText || ""}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.cancelButtonText}>取消</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <ThemedText style={styles.confirmButtonText}>确认</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  signatureIcon: {
    width: 200,
    height: 120,
  },
  domainContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoAndText: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  gmLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
  },
  logoGradient: {
    flex: 1,
  },
  domainText: {
    fontSize: 24,
    fontWeight: "600",
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginBottom: 8,
  },
  selectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  networkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectorText: {
    fontSize: 17,
    fontWeight: "500",
    color: grayScale[100],
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#00A478",
    marginLeft: 6,
  },
  addressText: {
    fontSize: 15,
    color: grayScale[200],
    lineHeight: 22,
    flex: 1,
  },
  dataContainer: {
    backgroundColor: "transparent",
  },
  dataTitle: {
    fontSize: 15,
    color: grayScale[200],
    marginBottom: 16,
  },
  dataDescription: {
    fontSize: 15,
    color: grayScale[200],
    lineHeight: 22,
    marginBottom: 16,
  },
  dataWarning: {
    fontSize: 15,
    color: "#444",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: grayScale[300],
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  confirmButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});
