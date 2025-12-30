import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  AppTransactionItem,
  AppTransactionItemProps,
} from "./AppTransactionItem";

interface AppTransactionListProps {
  transactions: AppTransactionItemProps[];
  title?: string;
  onItemPress?: (item: AppTransactionItemProps) => void;
}

export function AppTransactionList({
  transactions,
  title,
  onItemPress,
}: AppTransactionListProps) {
  return (
    <View style={styles.container}>
      {title && <ThemedText style={styles.headerTitle}>{title}</ThemedText>}
      {transactions.map((item) => (
        <AppTransactionItem
          key={item.id}
          {...item}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 15,
    color: "#999",
    marginTop: 24,
    marginBottom: 8,
  },
});
