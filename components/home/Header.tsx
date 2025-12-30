import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
export default function Header() {
  const router = useRouter();
  const handleWalletSelect = () => {
    router.push("/wallet-manager/wallet-list");
  };
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={handleWalletSelect}>
        <ThemedView style={styles.walletSelector}>
          <ThemedView style={styles.walletIcon} />
          <ThemedText style={styles.walletText}>钱包1</ThemedText>
          <Ionicons name="caret-down" size={12} color="#fff" />
        </ThemedView>
      </TouchableOpacity>

      <ThemedView style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  walletSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6c47ff",
    marginRight: 8,
  },
  walletText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 16,
  },
});
