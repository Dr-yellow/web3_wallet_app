import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  getCurrentWalletData,
  getCurrentWalletId,
  getWalletAccounts,
} from "@/utils/wallet/wallet-storage";

import { toast } from "sonner-native";

import { useMultiChain } from "@/context/MultiChainContext";
import { decryptMnemonic } from "@/utils/wallet/crypto-help";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TransferPenddingScreen() {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const { tronWebProvider } = useMultiChain();
  const [loading, setLoading] = useState(false);

  const { symbol, symbol_address, tokenAmount, recipientAddress } =
    useLocalSearchParams();

  const [currentWalletInfo, setCurrentWalletInfo] = useState<{
    address: string;
    network: string;
  } | null>(null);

  // 转账状态：签名中 -> 广播 -> 确认中 -> 成功/失败
  type TransferStatus =
    | "signing"
    | "broadcasting"
    | "confirming"
    | "success"
    | "failed";
  const [transferStatus, setTransferStatus] =
    useState<TransferStatus>("signing");
  const [signatureProgress, setSignatureProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("11:20");

  // 旋转动画
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

  // 开始旋转动画
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, [rotateAnim]);

  // 转账执行函数
  const transferErc10Token = useCallback(
    async (privateKeyString: string) => {
      setLoading(true);
      try {
        // 阶段1: 设置地址和准备交易 (30%)
        setTransferStatus("signing");
        setSignatureProgress(0.3);

        tronWebProvider.setAddress(
          tronWebProvider.address.fromPrivateKey(privateKeyString) as string
        );

        const amount = tronWebProvider.toSun(
          parseFloat(tokenAmount as string)
        ) as unknown as number;
        const receiverAddress = recipientAddress as string;

        // 阶段2: 构建交易 (45%)
        setSignatureProgress(0.45);
        const tx = await tronWebProvider.transactionBuilder.sendTrx(
          receiverAddress,
          amount
        );

        // 阶段3: 签名交易 (55%)
        setSignatureProgress(0.55);
        const signedTx = await tronWebProvider.trx.sign(tx, privateKeyString);

        // 阶段4: 广播交易 (70%)
        setTransferStatus("broadcasting");
        setSignatureProgress(0.7);
        const result = await tronWebProvider.trx.sendRawTransaction(signedTx);

        // 阶段5: 确认交易 (85%)
        setTransferStatus("confirming");
        setSignatureProgress(0.85);

        if (result.result) {
          setTransferStatus("success");
          setSignatureProgress(1);
          toast.success("发送成功");
          router.replace({
            pathname: "/transfer/send_success",
            params: {
              symbol: symbol,
              tokenAmount: tokenAmount,
            },
          });
        } else {
          setTransferStatus("failed");
          toast.error("发送失败");
          throw new Error("交易发送失败");
        }
      } catch (error) {
        console.error("transferErc10Token error", error);
        setTransferStatus("failed");
        throw error; // 重新抛出错误以便上层处理
      } finally {
        setLoading(false);
      }
    },
    [tokenAmount, recipientAddress, tronWebProvider]
  );

  // 确认并执行转账
  const handleConfirm = useCallback(async () => {
    if (!symbol_address) {
      throw new Error("缺少转账参数");
    }

    try {
      const currentWalletData = await getCurrentWalletData();
      if (!currentWalletData) {
        throw new Error("未找到钱包数据");
      }

      const privateKey = decryptMnemonic(
        currentWalletData.encryptedData as string,
        currentWalletData.walletId as string,
        currentWalletData.salt as string
      );

      if (!privateKey) {
        throw new Error("私钥解密失败");
      }

      await transferErc10Token(privateKey);
    } catch (error) {
      console.error("handleConfirm error", error);
      throw error; // 重新抛出错误以便上层处理
    }
  }, [symbol_address, transferErc10Token]);

  // 执行转账流程
  useEffect(() => {
    let isCancelled = false;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

    const executeTransfer = async () => {
      try {
        // 初始化状态
        setTransferStatus("signing");
        setSignatureProgress(0);

        // 设置超时保护（30秒）
        timeoutTimer = setTimeout(() => {
          if (!isCancelled) {
            isCancelled = true;
            setTransferStatus("failed");
            toast.error("转账超时，请检查网络连接");
          }
        }, 30000);

        await handleConfirm();

        // 转账成功，清除超时
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }
      } catch (error) {
        console.error("转账执行错误", error);
        if (!isCancelled) {
          setTransferStatus("failed");
          const errorMessage =
            error instanceof Error ? error.message : "转账失败，请重试";
          toast.error(errorMessage);
        }
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }
      }
    };

    executeTransfer();

    return () => {
      isCancelled = true;
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
      }
    };
  }, [handleConfirm]);

  // 获取状态文本
  const getStatusText = () => {
    switch (transferStatus) {
      case "signing":
        return "签名中...";
      case "broadcasting":
        return "广播中...";
      case "confirming":
        return "确认中...";
      case "success":
        return "成功";
      case "failed":
        return "失败";
      default:
        return "签名中...";
    }
  };

  // 旋转动画插值
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3D Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/transfer/pending-3d-image.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <ThemedText style={styles.amountText}>
            {tokenAmount || "0"}{" "}
            <ThemedText style={styles.symbolText}>
              {symbol || "USDT"}
            </ThemedText>
          </ThemedText>
        </View>

        {/* Processing Status */}
        <View style={styles.processingContainer}>
          <ThemedText style={styles.processingText}>
            正在处理... 预估{estimatedTime}完成
          </ThemedText>
        </View>
      </ScrollView>

      {/* Footer Section */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {/* Network Fee Section */}
        <View style={styles.networkFeeContainer}>
          <ThemedText style={styles.networkFeeLabel}>网络费用</ThemedText>
          <View style={styles.feeInfoRow}>
            <ThemedText style={styles.feeAmount}>6.2 TRX</ThemedText>
            <ThemedText style={styles.savingsText}>节约8%</ThemedText>
          </View>
        </View>

        {/* Signature Progress Card and Cancel Button Row */}
        <View style={styles.signatureRow}>
          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Signature Progress Card */}
          <View style={styles.signatureCard}>
            <View style={styles.signatureProgressBg}>
              <View
                style={[
                  styles.signatureProgressFill,
                  { width: `${signatureProgress * 100}%` },
                ]}
              >
                <ThemedText style={styles.signingText}>
                  {getStatusText()}
                </ThemedText>
              </View>
            </View>
            {transferStatus !== "success" && (
              <View style={styles.progressIndicator}>
                <Animated.View
                  style={[
                    styles.progressCircle,
                    { transform: [{ rotate: spin }] },
                  ]}
                >
                  <View style={styles.progressCircleInner} />
                </Animated.View>
              </View>
            )}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 90,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  amountContainer: {
    alignItems: "center",
    marginTop: -12,
    marginBottom: 20,
  },
  amountText: {
    fontSize: 30,
    fontWeight: "400",
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.021,
    lineHeight: 33.6,
  },
  symbolText: {
    fontSize: 30,
    fontWeight: "400",
    color: "#999",
  },
  processingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  processingText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#999",
    textAlign: "center",
    letterSpacing: -0.0105,
    lineHeight: 12,
  },
  footer: {
    paddingHorizontal: 18.5,
  },
  networkFeeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  networkFeeLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#999",
  },
  feeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  feeAmount: {
    fontSize: 15,
    fontWeight: "400",
    color: "#999",
  },
  savingsText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#00A478",
  },
  signatureRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  signatureCard: {
    flex: 1,
    position: "relative",
    height: 91.31,
    marginLeft: 0,
  },
  signatureProgressBg: {
    height: 51.67,
    backgroundColor: "#1F1F1F",
    borderRadius: 38,
    overflow: "hidden",
    marginTop: 39.64,
    position: "relative",
  },
  signatureProgressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 13,
    minWidth: 104,
  },
  signingText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    lineHeight: 18,
  },
  progressIndicator: {
    position: "absolute",
    right: 29.1,
    top: 56.69,
    width: 17.74,
    height: 17.74,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircle: {
    width: 17.74,
    height: 17.74,
    borderRadius: 8.87,
    borderWidth: 1.5,
    borderColor: "#fff",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  progressCircleInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -4,
  },
  cancelButton: {
    width: 51.92,
    height: 51.67,
    borderRadius: 25.96,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
});
