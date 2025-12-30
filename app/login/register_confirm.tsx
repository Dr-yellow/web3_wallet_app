import { Page } from "@/components/page/Page";
import { ThemedText } from "@/components/themed-text";
import { FixedBottomButton } from "@/components/ui/FixedBottomButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function RegisterConfirmScreen() {
  const router = useRouter();

  const handleCreateAccount = () => {};

  return (
    <>
      <Stack.Screen options={{ title: "", headerBackTitle: "" }} />
      <Page>
        <View style={styles.container}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>您尚未注册</ThemedText>

            <View style={styles.iconContainer}>
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                style={styles.iconBackground}
              >
                <Ionicons name="information" size={80} color="#fff" />
              </LinearGradient>
            </View>
          </View>

          <FixedBottomButton title="创建新账户" onPress={handleCreateAccount} />
        </View>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 60,
    color: "#fff",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100, // Push icon up a bit
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  footer: {
    paddingBottom: 40,
  },
  createButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
  },
  createButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
});
