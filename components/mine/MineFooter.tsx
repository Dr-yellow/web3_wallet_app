import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { grayScale } from "@/constants/theme/base";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

/**
 * “我的”页面底部组件
 * 展示品牌 Logo、版本号、参与开发链接以及官方网站。
 */
export function MineFooter() {
  return (
    <ThemedView style={styles.footer}>
      <ThemedView style={styles.logoContainer}>
        <LinearGradient
          colors={["#fff", "#666"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoIcon}
        />
        <ThemedText style={styles.footerBrand}>GM Wallet</ThemedText>
      </ThemedView>
      <ThemedText style={styles.versionText}>当前版本：1.13.0</ThemedText>
      <TouchableOpacity>
        <ThemedText style={styles.devLink}>参与开发</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.urlLink}>https://www.gmwallet.me</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 100,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  footerBrand: {
    fontSize: 18,
    fontWeight: 700,
  },
  versionText: {
    color: grayScale[200],
    fontSize: 13,
    marginBottom: 16,
  },
  devLink: {
    color: grayScale[200],
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  urlLink: {
    fontSize: 12,
  },
});
