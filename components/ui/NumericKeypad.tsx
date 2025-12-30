import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  textColor?: string;
  backgroundColor?: string;
}

export function NumericKeypad({
  onKeyPress,
  onBackspace,
  textColor = "#fff",
  backgroundColor = "transparent",
}: NumericKeypadProps) {
  const handlePress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (key === "delete") {
      onBackspace();
    } else if (key !== "") {
      onKeyPress(key);
    }
  };

  return (
    <View style={[styles.keypad, { backgroundColor }]}>
      {[
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["", "0", "delete"],
      ].map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keypadRow}>
          {row.map((key, colIndex) => {
            if (key === "") return <View key={colIndex} style={styles.key} />;

            return (
              <TouchableOpacity
                key={colIndex}
                style={styles.key}
                onPress={() => handlePress(key)}
                activeOpacity={0.6}
              >
                {key === "delete" ? (
                  <Ionicons
                    name="backspace-outline"
                    size={28}
                    color={textColor}
                  />
                ) : (
                  <ThemedText style={[styles.keyText, { color: textColor }]}>
                    {key}
                  </ThemedText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    justifyContent: "flex-end",
    paddingBottom: 80,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  key: {
    width: width / 3,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: 32,
    fontWeight: "400",
  },
});
