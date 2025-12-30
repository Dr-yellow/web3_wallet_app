import { ThemedText } from "@/components/themed-text";
import { FixedBottomButton } from "@/components/ui/FixedBottomButton";
import { grayScale } from "@/constants/theme/base";
import { useI18n } from "@/hooks/use-i-18n";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function AddEvmNetworkScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "Ethereum",
    rpcUrl: "",
    chainId: "",
    symbol: "",
    explorer: "",
  });

  const handleConfirm = () => {
    // Implement save logic here
    console.log("Saving network:", formData);
    router.back();
  };

  const renderInput = (
    label: string,
    key: keyof typeof formData,
    placeholder: string
  ) => (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={grayScale[200]}
          value={formData[key]}
          onChangeText={(text) => setFormData({ ...formData, [key]: text })}
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("network.add_evm"),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderInput("网络名称", "name", "例如: Ethereum")}
          {renderInput("RPC URL", "rpcUrl", "例如: https://etc.rivet.link")}
          {renderInput("链 ID", "chainId", "例如: 0")}
          {renderInput("符号", "symbol", "例如: ETH")}
          {renderInput(
            "区块链浏览器",
            "explorer",
            "例如: https://ethereum.org"
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <FixedBottomButton title="确认" onPress={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    fontWeight: "500",
  },
  inputWrapper: {
    backgroundColor: "#1c1c1e",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 20,
    height: 56,
    justifyContent: "center",
  },
  input: {
    color: "#fff",
    fontSize: 15,
  },
});
