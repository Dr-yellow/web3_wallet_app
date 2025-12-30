/**
 * 可折叠的 accordion 组件
 */
import { grayScale } from "@/constants/theme/base";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../themed-text";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export interface AppAccordionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function AppAccordion({
  title,
  children,
  initiallyExpanded = false,
  containerStyle,
  headerStyle,
  contentStyle,
}: AppAccordionProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const rotateValue = useDerivedValue(() => {
    return withTiming(expanded ? 180 : 0, { duration: 300 });
  });

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[styles.header, headerStyle]}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        {typeof title === "string" ? (
          <ThemedText style={styles.title}>{title}</ThemedText>
        ) : (
          title
        )}
        <View style={styles.iconWrapper}>
          <Animated.View style={animatedIconStyle}>
            <Ionicons
              name="chevron-down"
              size={20}
              color={grayScale[200]}
              style={styles.expandIcon}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  iconWrapper: {
    backgroundColor: grayScale[300],
    borderRadius: 14,
    padding: 4,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  expandIcon: {
    textAlign: "center",
  },
  content: {
    overflow: "hidden",
  },
});
