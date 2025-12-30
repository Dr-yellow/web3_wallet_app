import { grayScale } from "@/constants/theme/base";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../themed-text";

export interface TabItem {
  id: string;
  label: string;
}

interface SecondaryTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function SecondaryTabs({
  tabs,
  activeTab,
  onTabChange,
}: SecondaryTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              isActive ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.8}
          >
            <ThemedText
              style={[
                styles.tabText,
                isActive ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: grayScale[100],
  },
  inactiveTab: {
    backgroundColor: grayScale[300],
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: grayScale[500],
  },
  inactiveTabText: {
    color: grayScale[100],
  },
});
