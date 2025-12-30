import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function SendSuccessScreen() {
  const router = useRouter();

  const { symbol = "TRX", tokenAmount = "100" } = useLocalSearchParams();

  const handleConfirm = () => {
    router.replace("/");
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",

          headerLeft: () => (
            <TouchableOpacity onPress={handleConfirm} style={styles.headerIcon}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Domain Info */}
        <View style={styles.domainContainer}>
          <View style={styles.logoAndText}>
            <ThemedText style={styles.domainText}>
              {tokenAmount + " "}
            </ThemedText>
            <ThemedText style={[styles.domainText, { opacity: 0.5 }]}>
              {symbol}
            </ThemedText>
          </View>
          <View>
            <ThemedText style={styles.successText}>处理完成</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <ThemedText style={styles.confirmButtonText}>完成</ThemedText>
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

    flex: 1,
    justifyContent: "center",
  },
  domainContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logoAndText: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 10,
  },

  domainText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#fff",
  },

  footer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
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
  successText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#00A478",
  },
});
