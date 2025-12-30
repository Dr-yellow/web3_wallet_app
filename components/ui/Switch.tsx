/**
 * 通用switch按钮
 */
import { grayScale } from "@/constants/theme/base";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const SWITCH_WIDTH = 32;
const SWITCH_HEIGHT = 18;
const THUMB_SIZE = 16;
const PADDING = 1.5;
const TRAVEL_DISTANCE = SWITCH_WIDTH - THUMB_SIZE - PADDING * 2;

export default function CustomSwitch({
  value,
  onValueChange,
  disabled = false,
}: CustomSwitchProps) {
  // 0 = off, 1 = on
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 120,
      overshootClamping: false,
    });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [grayScale[300], grayScale[100]] // Off: Dark Gray, On: White
    );

    return {
      backgroundColor,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = progress.value * TRAVEL_DISTANCE;
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [grayScale[200], grayScale[500]] // Off: Light Gray, On: Black
    );

    return {
      transform: [{ translateX }],
      backgroundColor,
    };
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    justifyContent: "center",
    paddingHorizontal: PADDING,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: grayScale[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 2,
  },
});
