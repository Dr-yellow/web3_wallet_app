import { Page } from "@/components/page/Page";
import { ThemedText } from "@/components/themed-text";
import { AppAccordion } from "@/components/ui/AppAccordion";
import { grayScale } from "@/constants/theme/base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { toast } from "sonner-native";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function TransactionDetailScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();

  let rawData: any = null;
  try {
    rawData = data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Parse transaction data error:", e);
  }

  if (!rawData) {
    return (
      <Page style={styles.center}>
        <ThemedText>加载中...</ThemedText>
      </Page>
    );
  }

  const receives = rawData.receives || [];
  const sends = rawData.sends || [];

  let type = "contract";
  if (receives.length > 0 && sends.length === 0) type = "receive";
  else if (sends.length > 0 && receives.length === 0) type = "send";

  const title =
    type === "receive" ? "收款" : type === "send" ? "发送" : "合约交互";
  const timeStr = rawData.timestamp
    ? new Date(rawData.timestamp * 1000).toLocaleString()
    : "-";

  const detail = {
    title,
    time: timeStr,
    network: (rawData.chain || "TRON").toUpperCase(),
    fee: `${rawData.tx?.fee || 0} ${String(
      rawData.tx?.fee_type || "TRX"
    ).toUpperCase()}`,
    hash: `${(rawData.tx_hash || "").slice(0, 8)}...${(
      rawData.tx_hash || ""
    ).slice(-8)}`,
    fullHash: rawData.tx_hash || "",
    from: rawData.tx?.from_address || rawData.other_address || "-",
    to: rawData.tx?.to_address || "-",
    status: rawData.tx?.status === 1 ? "success" : "failed",
    tokens: [
      ...receives.map((r: any) => ({
        symbol: (r.token_id || "TRX").toUpperCase(),
        amount: `+${r.amount}`,
        fiatAmount: "-",
        icon: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/assets/${
          r.token_id === "trx" ? "TRX" : r.token_id
        }/logo.png`, // Simplified icon logic
      })),
      ...sends.map((s: any) => ({
        symbol: (s.token_id || "TRX").toUpperCase(),
        amount: `-${s.amount}`,
        fiatAmount: "-",
        icon: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/assets/${
          s.token_id === "trx" ? "TRX" : s.token_id
        }/logo.png`,
      })),
    ],
    contractData: JSON.stringify(rawData.tx || {}, null, 2),
  };

  const copyToClipboard = async (text: string, label: string) => {
    if (!text || text === "-") return;
    await Clipboard.setStringAsync(text);
    toast.success(`${label}已复制`);
  };

  return (
    <Page>
      <Stack.Screen
        options={{
          headerShown: true,
          title: detail.title,
          headerBackTitle: "",
          headerStyle: { backgroundColor: grayScale[500] },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Token Amounts Section */}
        <View style={styles.amountsSection}>
          {detail.tokens.map((token, index) => (
            <View key={index} style={styles.amountRow}>
              <View style={styles.tokenInfo}>
                <Image
                  source={{ uri: token.icon }}
                  style={styles.tokenIcon}
                  defaultSource={require("@/assets/images/icon.png")} // Fallback icon
                />
                <ThemedText style={styles.tokenAmount}>
                  {token.amount}{" "}
                  <ThemedText style={styles.tokenSymbol}>
                    {token.symbol}
                  </ThemedText>
                </ThemedText>
              </View>
              <ThemedText style={styles.fiatAmount}>
                {token.fiatAmount}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Info Rows Section */}
        <View style={styles.infoSection}>
          <DetailAddressRow
            label="发送地址"
            address={detail.from}
            onCopy={() => copyToClipboard(detail.from, "发送地址")}
          />
          <DetailAddressRow
            label="接收地址"
            address={detail.to}
            onCopy={() => copyToClipboard(detail.to, "接收地址")}
          />

          <View style={styles.spacing} />

          <DetailRow label="时间" value={detail.time} />
          <DetailRow label="网络" value={detail.network} />
          <DetailRow label="网络费用" value={detail.fee} />
          <DetailRow
            label="交易哈希"
            value={detail.hash}
            isLink
            onPress={() => copyToClipboard(detail.fullHash, "交易哈希")}
          />

          {/* Expandable Contract Data */}
          <AppAccordion
            title="交易详情 (RAW)"
            containerStyle={styles.contractSection}
            contentStyle={styles.contractContent}
          >
            <ThemedText style={styles.contractText}>
              {detail.contractData}
            </ThemedText>
          </AppAccordion>
        </View>
      </ScrollView>
    </Page>
  );
}

function DetailRow({
  label,
  value,
  isLink,
  onPress,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  onPress?: () => void;
}) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TouchableOpacity disabled={!isLink} onPress={onPress}>
        <ThemedText style={[styles.value, isLink && styles.linkText]}>
          {value}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function DetailAddressRow({
  label,
  address,
  onCopy,
}: {
  label: string;
  address: string;
  onCopy: () => void;
}) {
  return (
    <View style={styles.addressRowContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.addressWrapper}>
        <ThemedText style={styles.addressText}>{address}</ThemedText>
        <TouchableOpacity onPress={onCopy} style={styles.copyBtn}>
          <MaterialCommunityIcons
            name="content-copy"
            size={16}
            color={grayScale[200]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  amountsSection: {
    paddingVertical: 32,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tokenInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: grayScale[300],
  },
  tokenAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  tokenSymbol: {
    fontSize: 20,
    fontWeight: "400",
    color: "#fff",
  },
  fiatAmount: {
    fontSize: 14,
    color: grayScale[200],
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  addressRowContainer: {
    marginBottom: 24,
  },
  addressWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    color: grayScale[100],
    lineHeight: 22,
    marginRight: 12,
  },
  copyBtn: {
    padding: 4,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: grayScale[200],
  },
  linkText: {
    textDecorationLine: "underline",
    color: grayScale[200],
  },
  spacing: {
    height: 16,
  },
  contractSection: {
    marginTop: 8,
  },
  contractContent: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
  },
  contractText: {
    fontSize: 14,
    color: grayScale[200],
    lineHeight: 20,
  },
});
