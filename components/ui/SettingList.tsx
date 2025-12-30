import { grayScale } from "@/constants/theme/base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

export interface SettingItemProps {
  icon?: React.ReactNode;
  title: string;
  rightText?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

/**
 * 通用设置项组件
 * 展示图标、标题、右侧文本以及箭头。
 */
export function SettingItem({
  icon,
  title,
  rightText,
  onPress,
  showChevron = true,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <ThemedView style={styles.menuItemLeft}>
        {icon && <ThemedView style={styles.iconWrapper}>{icon}</ThemedView>}
        <ThemedText style={styles.menuItemTitle}>{title}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.menuItemRight}>
        {rightText && (
          <ThemedText style={styles.rightInfoText}>{rightText}</ThemedText>
        )}
        {showChevron && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={grayScale[100]}
          />
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

export interface SettingSectionProps {
  items: SettingItemProps[];
  title?: string;
}

/**
 * 通用设置分组组件
 * 封装一组 SettingItem，支持展示分组标题。
 */
export function SettingSection({ items, title }: SettingSectionProps) {
  return (
    <ThemedView style={styles.menuSection}>
      {title && <ThemedText style={styles.sectionTitle}>{title}</ThemedText>}
      {items.map((item, index) => (
        <SettingItem key={index} {...item} />
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  menuSection: {
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#666",
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 32,
    marginRight: 12,
    alignItems: "center",
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightInfoText: {
    color: grayScale[200],
    fontSize: 16,
    marginRight: 8,
  },
});
