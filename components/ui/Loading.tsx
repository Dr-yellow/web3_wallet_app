import { grayScale } from "@/constants/theme/base";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

interface LoadingProps {
  visible: boolean;
}

export function Loading({ visible }: LoadingProps) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#FFE26C" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
    backgroundColor: grayScale[300],
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
