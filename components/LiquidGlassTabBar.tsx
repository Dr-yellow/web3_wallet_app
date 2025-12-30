import { LiquidGlass } from "@/components/ui/LiquidGlass"; // 引入抽离后的通用玻璃组件
import { TabItem } from "@/type/navigation";
import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutRight,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

/**
 * 液态玻璃 TabBar
 * 使用抽离出的通用的 LiquidGlass 组件实现“液态玻璃”视觉质感
 */
export default function LiquidGlassTabBar(props: { tabs: TabItem[] }) {
  const { tabs } = props;
  const router = useRouter();
  const pathname = usePathname();

  // 判断当前路由是否匹配某个 Tab
  const isActive = (tabName: Href) => {
    if (tabName === "/") return pathname === "/";
    return pathname.startsWith(String(tabName));
  };

  return (
    <View style={styles.container}>
      {/* 使用通用的 LiquidGlass 组件 */}
      <LiquidGlass
        style={styles.glassContainer}
        containerStyle={styles.glassWrapper}
      >
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TabButton
              key={String(tab.name)}
              item={tab}
              active={isActive(tab.href)}
              onPress={() => router.push(tab.href)}
            />
          ))}
        </View>
      </LiquidGlass>
    </View>
  );
}

function TabButton({
  item,
  active,
  onPress,
}: {
  item: TabItem;
  active: boolean;
  onPress: () => void;
}) {
  // 选中态背景切换动画
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(active ? "#fff" : "rgba(0,0,0,0)", {
        duration: 200,
      }),
    };
  });

  return (
    <Animated.View
      layout={LinearTransition.duration(200)}
      style={[styles.tabButtonContainer, animatedContainerStyle]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={styles.tabButtonContent}
        activeOpacity={0.8}
      >
        {/* <IconSymbol
          size={24}
          name={item.icon as any} 
          color={active ? '#000' : '#fff'}
        /> */}
        <item.icon color={active ? "#000" : "#fff"} />
        {active && (
          <Animated.View
            entering={FadeInRight.duration(200)}
            exiting={FadeOutRight.duration(200)}
            style={styles.textContainer}
          >
            <Text style={styles.label} numberOfLines={1}>
              {item.title}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30, // 距离底部高度
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  glassWrapper: {
    borderRadius: 40,
    overflow: "hidden",
  },
  glassContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4.84,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 增强玻璃感深度
    overflow: "hidden",
    flexDirection: "row",
    padding: 3,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  tabButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    overflow: "hidden",
    minWidth: 60,
  },
  tabButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  textContainer: {
    marginLeft: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});
