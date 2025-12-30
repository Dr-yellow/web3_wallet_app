import { ThemedView } from "@/components/themed-view";
import { AppTransactionList } from "@/components/transaction/AppTransactionList";
import React from "react";
import { StyleSheet } from "react-native";
import { TRANSACTIONS } from "./constants";

export default function RecentTransactions() {
  return (
    <ThemedView style={styles.container}>
      <AppTransactionList transactions={TRANSACTIONS} title="最近交易" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
});
