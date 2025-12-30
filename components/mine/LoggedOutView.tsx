import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { SettingSection } from "@/components/ui/SettingList";
import { useI18n } from "@/hooks/use-i-18n";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { MineFooter } from "./MineFooter";

interface LoggedOutViewProps {
  onLogin: () => void;
}

/**
 * 未登录状态视图
 * 展示欢迎信息、登录/注册按钮以及基础设置列表。
 */
export function LoggedOutView({ onLogin }: LoggedOutViewProps) {
  const { t } = useI18n();
  const settings = [
    {
      icon: <Feather name="sliders" size={20} color="#fff" />,
      title: t("preference.title"),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="account-plus-outline"
          size={20}
          color="#fff"
        />
      ),
      title: t("mine.invite_friends"),
    },
    {
      icon: <Ionicons name="help-circle-outline" size={22} color="#fff" />,
      title: t("mine.help_feedback"),
    },
    {
      icon: <Feather name="shield" size={20} color="#fff" />,
      title: t("mine.security_privacy"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <ThemedText style={styles.welcomeText}>
          {t("mine.welcome")}{" "}
          <View style={styles.logoContainer}>
            <LinearGradient colors={["#fff", "#666"]} style={styles.logoIcon} />
          </View>{" "}
          GM Wallet
        </ThemedText>
      </View>

      {/* Login Button */}
      <Button
        title={t("mine.login_register")}
        variant="light"
        style={styles.loginButton}
        textStyle={styles.loginButtonText}
        onPress={onLogin}
      />

      {/* Basic Settings */}
      <View style={styles.settingsContainer}>
        <SettingSection items={settings} />
      </View>

      <MineFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    marginBottom: 40,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  settingsContainer: {
    marginTop: 20,
  },
});
