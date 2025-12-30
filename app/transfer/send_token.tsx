import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { grayScale } from "@/constants/theme/base";

import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const SendAddressRow = ({
  title,
  address,
}: {
  title: string;
  address: string;
}) => {
  const copyToClipboard = async (text: string, label: string) => {
    if (!text || text === "-") return;
    await Clipboard.setStringAsync(text);
    toast.success(`${label}已复制`);
  };
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionLabel}>{title}</ThemedText>
      <TouchableOpacity style={styles.selectorRow}>
        <View style={styles.selectorLeft}>
          <ThemedText style={styles.addressText} numberOfLines={2}>
            {address}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => copyToClipboard(address, title)}
          style={styles.copyBtn}
        >
          <MaterialCommunityIcons
            name="content-copy"
            size={16}
            color={grayScale[200]}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default function SendTokenScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { address, symbol, symbol_address, tokenAmount, recipientAddress } =
    useLocalSearchParams();

  const handleConfirm = useCallback(() => {
    router.push({
      pathname: "/transfer/transfer_pendding",
      params: {
        tokenAmount: tokenAmount,
        recipientAddress: recipientAddress,
        symbol: symbol,
        symbol_address: symbol_address,
      },
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "发送",
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Signature Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/transfer/send.png")} // Using similar asset or placeholder
            style={styles.signatureIcon}
            resizeMode="contain"
          />
        </View>

        {/* Domain Info */}
        <View style={styles.domainContainer}>
          <View style={styles.logoAndText}>
            <ThemedText style={styles.domainText}>
              {"-" + tokenAmount + " "}
            </ThemedText>
            <ThemedText style={[styles.domainText, { opacity: 0.5 }]}>
              {symbol}
            </ThemedText>
          </View>
        </View>

        {/* Wallet Section */}
        <SendAddressRow title="发送地址" address={address as string} />
        <SendAddressRow title="接收地址" address={recipientAddress as string} />

        <View style={styles.section}>
          <ThemedView style={styles.selectorRow}>
            <ThemedText>网络</ThemedText>
            <ThemedText>{symbol}</ThemedText>
          </ThemedView>
        </View>
        <View style={styles.section}>
          <ThemedView style={styles.selectorRow}>
            <ThemedText>网络费用</ThemedText>
            <ThemedText>7.5 TRX</ThemedText>
          </ThemedView>
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
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={loading}
        >
          <ThemedText style={styles.confirmButtonText}>
            {loading ? "正在发送..." : "确认"}
          </ThemedText>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
  },
  signatureIcon: {
    width: 178,
    height: 178,
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
    fontSize: 30,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    marginBottom: 10,
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
  headerIcon: {
    padding: 4,
  },
  copyBtn: {
    padding: 4,
  },
});
