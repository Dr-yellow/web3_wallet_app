import { GlassContainer, GlassView } from "expo-glass-effect";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

interface LiquidGlassProps {
  children: React.ReactNode;
  style?: ViewStyle; // 应用于内层 GlassView 的样式
  containerStyle?: ViewStyle; // 应用于外层 GlassContainer 的样式
  spacing?: number; // 液态融合距离
  tintColor?: string; // 玻璃底色
  intensity?: "clear" | "regular"; // 玻璃质感强度
  isInteractive?: boolean; // 是否开启交互感
}

/**
 * 通用液态玻璃组件
 * 封装了 expo-glass-effect 的高级视觉效果，支持元素间的融合感。
 */
export function LiquidGlass({
  children,
  style,
  containerStyle,
  spacing = 20,
  tintColor = "rgba(255, 255, 255, 0.08)",
  intensity = "regular",
  isInteractive = true,
}: LiquidGlassProps) {
  return (
    <GlassContainer
      spacing={spacing}
      style={[styles.defaultWrapper, containerStyle]}
    >
      <GlassView
        glassEffectStyle={intensity}
        tintColor={tintColor}
        isInteractive={isInteractive}
        style={[styles.defaultGlass, style]}
      >
        {children}
      </GlassView>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  defaultWrapper: {
    borderRadius: 40,
    overflow: "hidden",
  },
  defaultGlass: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4.84,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    padding: 3,
  },
});
