import { ThemedText } from "@/components/themed-text";
import { GUIDES } from "@/constants/guides";
import { grayScale } from "@/constants/theme/base";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/**
 * 引导详情模态页面
 * 以半屏弹窗形式展示引导内容，支持通过手势向下滑动关闭。
 */
export default function GuideDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = GUIDES.find((g) => g.id === id);

  // 用于关闭动画的共享值
  const translateY = useSharedValue(0);

  // 关闭当前模态页
  const close = () => {
    router.back();
  };

  // 配置滑动手势：向下拉动超过阈值或速度较快时关闭
  const gesture = Gesture.Pan()
    .onChange((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150 || event.velocityY > 500) {
        translateY.value = withTiming(600, { duration: 200 }, () => {
          runOnJS(close)();
        });
      } else {
        // 未达阈值则弹回原位
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  // 绑定动画样式
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // 背景蒙层透明度随滑动减小
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - translateY.value / 600,
  }));

  if (!guide) return null;

  return (
    <View style={styles.container}>
      {/* 点击空白处关闭 */}
      <Pressable style={styles.dismiss} onPress={close} />

      {/* 背景模糊层 */}
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(300)}
          style={[styles.content, animatedStyle]}
        >
          {/* 顶部手势指示条 */}
          <View style={styles.handle} />

          <Image
            source={guide.image}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.textContent}>
            <ThemedText style={styles.title}>{guide.title}</ThemedText>
            <ThemedText style={styles.description}>
              {guide.description}
            </ThemedText>
            {guide.footer && (
              <ThemedText style={styles.footerText}>{guide.footer}</ThemedText>
            )}
          </View>

          {/* 执行引导页配置的操作 */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => guide.onPress(close)}
          >
            <ThemedText style={styles.buttonText}>
              {guide.buttonTitle}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  dismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    backgroundColor: grayScale[300],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
    alignItems: "center",
  },
  handle: {
    width: 50,
    height: 3,
    borderRadius: 2.5,
    backgroundColor: grayScale[200],
    marginBottom: 24,
  },
  image: {
    width: 240,
    height: 160,
    marginBottom: 24,
  },
  textContent: {
    width: "100%",
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    marginBottom: 28,
  },
  description: {
    fontWeight: 500,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: grayScale[200],
    lineHeight: 18,
  },
  button: {
    backgroundColor: grayScale[100],
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
});
