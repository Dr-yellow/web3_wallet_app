import { grayScale } from "@/constants/theme/base";
import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../../themed-text";

export interface TabItem {
  id: string;
  label: string;
}

interface PrimaryTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function PrimaryTabs({
  tabs,
  activeTab,
  onTabChange,
}: PrimaryTabsProps) {
  const [tabLayouts, setTabLayouts] = useState<{
    [key: string]: { x: number; width: number };
  }>({});

  const translateX = useSharedValue(0);
  const width = useSharedValue(0);

  const handleLayout = (id: string, event: LayoutChangeEvent) => {
    const { x, width: w } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({
      ...prev,
      [id]: { x, width: w },
    }));
  };

  useEffect(() => {
    const activeLayout = tabLayouts[activeTab];
    if (activeLayout) {
      // 使用 withTiming 代替 withSpring，移除回弹效果并加快速度
      translateX.value = withTiming(activeLayout.x, {
        duration: 250,
        easing: Easing.bezier(0.33, 1, 0.68, 1), // 顺滑的减速曲线
      });
      width.value = withTiming(activeLayout.width, {
        duration: 250,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
    }
  }, [activeTab, tabLayouts]);

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: width.value,
      opacity: width.value > 0 ? 1 : 0,
    };
  });

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            onLayout={(e) => handleLayout(tab.id, e)}
            activeOpacity={0.7}
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
      <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1b1b1b",
    paddingHorizontal: 16,
    height: 48,
    alignItems: "center",
    position: "relative",
  },
  tab: {
    marginRight: 24,
    height: "100%",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  activeTabText: {
    color: grayScale[100],
  },
  inactiveTabText: {
    color: grayScale[200],
  },
  underline: {
    position: "absolute",
    bottom: 0,
    height: 2,
    backgroundColor: grayScale[100],
  },
});
