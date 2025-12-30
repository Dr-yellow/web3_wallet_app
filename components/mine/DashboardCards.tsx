import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { grayScale } from "@/constants/theme/base";
import { useI18n } from "@/hooks/use-i-18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * 仪表盘卡片组件
 * 展示网络费用余额和邀请码等关键信息。
 */
export function DashboardCards() {
  const { t } = useI18n();

  return (
    <ThemedView style={styles.cardsRow}>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardLabel}>
            {t("mine.network_fee_balance")}
          </ThemedText>
          <MaterialCommunityIcons name="account-group" size={20} color="#fff" />
        </View>
        <ThemedText style={styles.cardValue}>$1257.06</ThemedText>
        <ThemedText style={styles.cardSubValue}>
          {t("mine.one_account")}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardLabel}>
            {t("mine.invite_code")}
          </ThemedText>
          <MaterialCommunityIcons name="content-copy" size={20} color="#fff" />
        </View>
        <ThemedText style={styles.cardValue}>AD130lx</ThemedText>
        <ThemedText style={styles.cardSubValue}></ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  card: {
    flex: 1,
    backgroundColor: grayScale[300],
    borderRadius: 20,
    padding: 16,
    minHeight: 110,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    color: grayScale[200],
    fontSize: 13,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardSubValue: {
    color: grayScale[200],
    fontSize: 11,
    marginTop: 4,
  },
});
