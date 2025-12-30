import { grayScale } from "@/constants/theme/base";
import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../themed-text";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "dark" | "light" | "primary" | "secondary" | "danger";
  size?: "default" | "lg";
  disabled?: boolean;
}

/**
 * 通用按钮组件
 * 支持暗色和亮色两种主要变体，具备禁用状态。
 */
export function Button({
  title,
  onPress,
  style,
  textStyle,
  variant = "light",
  size = "default",
  disabled = false,
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case "dark":
      case "secondary":
        return styles.dark;
      case "light":
        return styles.light;
      case "primary":
        return styles.primary;
      case "danger":
        return styles.danger;
      default:
        return styles.dark;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "lg":
        return styles.lg;
      default:
        return styles.defaultSize;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "dark":
      case "secondary":
      case "danger":
        return styles.darkText;
      case "light":
      case "primary":
        return styles.lightText;
      default:
        return styles.darkText;
    }
  };

  const getSizeTextStyle = () => {
    switch (size) {
      case "lg":
        return styles.lgText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        getButtonStyle(),
        getSizeStyle(),
        style,
        disabled && { opacity: 0.5 },
      ]}
    >
      <ThemedText style={[getTextStyle(), getSizeTextStyle(), textStyle]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  light: {
    backgroundColor: grayScale[100],
    alignItems: "center",
    justifyContent: "center",
  },
  lightText: {
    color: grayScale[500],
    fontWeight: "500",
  },
  dark: {
    backgroundColor: grayScale[300],
    alignItems: "center",
    justifyContent: "center",
  },
  darkText: {
    color: grayScale[100],
    fontWeight: "500",
  },
  primary: {
    backgroundColor: grayScale[100],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: grayScale[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  danger: {
    backgroundColor: "#F44336",
    alignItems: "center",
    justifyContent: "center",
  },
  // Sizes
  defaultSize: {
    paddingHorizontal: 16,
    paddingVertical: 7.5,
    borderRadius: 24,
  },
  defaultText: {
    fontSize: 13,
  },
  lg: {
    height: 56,
    borderRadius: 28,
  },
  lgText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
