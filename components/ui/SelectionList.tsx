import { grayScale } from "@/constants/theme/base";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../themed-text";

export interface SelectionItem {
  id: string;
  label: string;
  [key: string]: any; // Allow extra data
}

interface SelectionListProps<T extends SelectionItem> {
  data: T[];
  selectedId: string;
  onSelect: (item: T) => void;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  activeItemStyle?: StyleProp<ViewStyle>;
}

/**
 * 通用单选列表组件
 * 支持自定义渲染项，保留默认的圆角选中背景样式。
 */
export function SelectionList<T extends SelectionItem>({
  data,
  selectedId,
  onSelect,
  renderItem,
  containerStyle,
  itemStyle,
  activeItemStyle,
}: SelectionListProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      {data.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              itemStyle,
              isSelected && styles.selectedItem,
              isSelected && activeItemStyle,
            ]}
            activeOpacity={0.7}
            onPress={() => onSelect(item)}
          >
            {renderItem ? (
              renderItem(item, isSelected)
            ) : (
              <ThemedText style={styles.text}>{item.label}</ThemedText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 28,
    marginBottom: 4,
  },
  selectedItem: {
    backgroundColor: grayScale[300],
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});
