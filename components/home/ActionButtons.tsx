import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { grayScale } from "@/constants/theme/base";
import { useI18n } from "@/hooks/use-i-18n";

/**
 * 首页操作按钮组
 * 包括：转账、收款、扫一扫、交易记录
 */
export default function ActionButtons() {
  const { t } = useI18n();
  const router = useRouter();

  const actions = [
    {
      id: "transfer",
      label: t("home.transfer"),
      icon: <Feather name="arrow-up-right" size={24} color="#fff" />,
    },
    {
      id: "receive",
      label: t("home.receive"),
      icon: <Feather name="arrow-down-right" size={24} color="#fff" />,
    },
    {
      id: "scan",
      label: t("home.scan"),
      icon: <AntDesign name="scan" size={20} color="#fff" />,
    },
    {
      id: "history",
      label: t("home.history"),
      icon: <MaterialCommunityIcons name="history" size={24} color="#fff" />,
    },
  ];

  const handlePress = (id: string) => {
    if (id === "transfer") {
      router.push("/transfer");
    } else if (id === "history") {
      router.push("/history");
    } else if (id === "scan") {
      router.push("/wallet-setup/onboarding");
    }
  };

  return (
    <ThemedView style={styles.container}>
      {actions.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={() => handlePress(item.id)}
        >
          <ThemedView style={styles.iconCircle}>{item.icon}</ThemedView>
          <ThemedText style={styles.buttonText}>{item.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  buttonContainer: {
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: grayScale[300], // 深灰色圆圈
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
