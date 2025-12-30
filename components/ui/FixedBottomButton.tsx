import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { Button } from "./Button";

interface FixedBottomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export function FixedBottomButton({
  title,
  onPress,
  variant = "primary",
  containerStyle,
  disabled = false,
}: FixedBottomButtonProps) {
  return (
    <View style={[styles.footer, containerStyle]}>
      <Button
        title={title}
        onPress={onPress}
        variant={variant}
        size="lg"
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
});
