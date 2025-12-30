import { grayScale } from "@/constants/theme/base";
import { CommonStyles } from "@/constants/theme/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../themed-text";
import { ThemedView } from "../../themed-view";

export interface NetworkItem {
  id: string;
  name: string;
  rpcUrl: string;
}

interface NetworkListProps {
  items: NetworkItem[];
  onPressItem?: (item: NetworkItem) => void;
}

export function NetworkList({ items, onPressItem }: NetworkListProps) {
  return (
    <View style={CommonStyles.flexContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[
            CommonStyles.listItem,
            index === items.length - 1 && CommonStyles.listItemLast,
          ]}
          onPress={() => onPressItem?.(item)}
          activeOpacity={0.7}
        >
          <ThemedView style={styles.left}>
            <ThemedText style={CommonStyles.title}>{item.name}</ThemedText>
            <ThemedText style={CommonStyles.secondaryText}>
              {item.rpcUrl}
            </ThemedText>
          </ThemedView>
          <View style={styles.rightIconWrap}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={grayScale[100]}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  left: {
    flex: 1,
    gap: 4,
  },
  rightIconWrap: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: grayScale[300],
  },
});
