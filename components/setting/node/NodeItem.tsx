import { grayScale } from "@/constants/theme/base";
import { CommonStyles } from "@/constants/theme/styles";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../themed-text";

export interface NodeItemData {
  id: string;
  name: string;
  url: string;
  latency?: number;
  isSelected?: boolean;
}

interface NodeItemProps {
  item: NodeItemData;
  onPress: (item: NodeItemData) => void;
}

export function NodeItem({ item, onPress }: NodeItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, item.isSelected && styles.selectedContainer]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={styles.nameRow}>
          <ThemedText style={[styles.name]}>{item.name}</ThemedText>
        </View>
        <ThemedText style={styles.url}>{item.url}</ThemedText>
      </View>
      <View style={styles.right}>
        <ThemedText
          style={[styles.latency, item.isSelected && { fontWeight: "700" }]}
        >
          {item.latency ? `${item.latency}ms` : "--"}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  selectedContainer: {
    ...CommonStyles.activeBg,
    borderRadius: 36,
    paddingHorizontal: 16,
  },
  left: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  url: {
    fontSize: 13,
    color: grayScale[200],
  },
  right: {
    marginLeft: 16,
  },
  latency: {
    fontSize: 14,
    fontWeight: "500",
  },
});
