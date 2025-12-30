import { ThemedText } from "@/components/themed-text";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export interface AppOtpInputProps {
  code: string[];
  length?: number;
  error?: string;
  focusedColors?: string[];
  secureTextEntry?: boolean;
}

const DEFAULT_FOCUSED_COLORS = [
  "#FFE26C",
  "#82FFF9",
  "#FF815E",
  "#9FFFDD",
  "#A1FFFE",
];

export function AppOtpInput({
  code,
  length = 6,
  error,
  focusedColors = DEFAULT_FOCUSED_COLORS,
  secureTextEntry = false,
}: AppOtpInputProps) {
  const renderContent = (index: number) => {
    if (index >= code.length) return null;
    if (secureTextEntry) {
      return <View style={styles.secureDot} />;
    }
    return <ThemedText style={styles.otpText}>{code[index]}</ThemedText>;
  };

  return (
    <View style={styles.otpContainer}>
      {Array(length)
        .fill(0)
        .map((_, index) => {
          const isFocused = index === code.length && !error;
          const hasValue = index < code.length;
          const isError = !!error;

          let borderColor = "#1F1F1F";
          if (isError) borderColor = "#BB4545"; // Red for error
          else if (hasValue) borderColor = "#1F1F1F";

          return (
            <View key={index} style={styles.inputBoxWrapper}>
              {isFocused ? (
                <LinearGradient
                  colors={focusedColors as any}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.focusedBorder}
                >
                  <View style={styles.inputBoxInterior}>
                    {renderContent(index)}
                  </View>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.inputBox,
                    { borderColor },
                    hasValue && styles.hasValueBox,
                  ]}
                >
                  {renderContent(index)}
                </View>
              )}
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputBoxWrapper: {
    height: 64,
    width: 55,
  },
  focusedBorder: {
    flex: 1,
    padding: 1.6,
    borderRadius: 12,
  },
  inputBoxInterior: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10.5,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  inputBox: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#1F1F1F",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  hasValueBox: {
    borderColor: "#1F1F1F",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  secureDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
});
