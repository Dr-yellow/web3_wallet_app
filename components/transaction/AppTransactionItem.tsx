import { ThemedText } from "@/components/themed-text";
import { grayScale, greenScale } from "@/constants/theme/base";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export type TransactionType =
  | "send"
  | "receive"
  | "contract"
  | "cross-chain"
  | "sent"
  | "received";

export interface TransactionToken {
  symbol: string;
  amount: string;
  isPositive: boolean;
}

export interface AppTransactionItemProps {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  tokens: TransactionToken[];
  onPress?: () => void;
  rawData?: any;
}

export function AppTransactionItem({
  type,
  title,
  subtitle,
  tokens,
  onPress,
}: AppTransactionItemProps) {
  const renderIcon = () => {
    // Normalize types
    const displayType =
      type === "sent" ? "send" : type === "received" ? "receive" : type;

    switch (displayType) {
      case "send":
        return (
          <View style={styles.iconContainer}>
            <Feather name="arrow-up-right" size={24} color="#fff" />
          </View>
        );
      case "receive":
        return (
          <View style={styles.iconContainer}>
            <Feather name="arrow-down-right" size={24} color="#fff" />
          </View>
        );
      case "contract":
        return (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="web" size={24} color="#fff" />
          </View>
        );
      case "cross-chain":
        return (
          <View style={styles.iconContainerMulti}>
            <View style={[styles.iconCircle, { zIndex: 1, left: 0 }]}>
              <MaterialCommunityIcons name="ethereum" size={16} color="#fff" />
            </View>
            <View
              style={[
                styles.iconCircle,
                { zIndex: 0, left: 16, backgroundColor: "#3498db" },
              ]}
            >
              <MaterialCommunityIcons
                name="diamond-stone"
                size={14}
                color="#fff"
              />
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={24}
              color="#fff"
            />
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.leftSection}>
        {renderIcon()}
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        </View>
      </View>
      <View style={styles.rightSection}>
        {tokens &&
          tokens.map((token, index) => (
            <ThemedText
              key={index}
              style={[
                styles.amount,
                token.isPositive
                  ? { color: greenScale[100] }
                  : { color: "#fff" },
              ]}
            >
              {token.isPositive ? "+" : "-"}
              {token.amount} {token.symbol}
            </ThemedText>
          ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: grayScale[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainerMulti: {
    width: 44,
    height: 44,
    marginRight: 12,
    position: "relative",
    justifyContent: "center",
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1E2323",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderWidth: 2,
    borderColor: grayScale[500],
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: grayScale[200],
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
});
