import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInRight,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { GUIDES } from "@/constants/guides";
import { grayScale } from "@/constants/theme/base";

const CARD_WIDTH = 218;
const CARD_HEIGHT = 145;

/**
 * 引导面板组件
 * 展示水平滚动的引导卡片，用于向用户介绍钱包功能。
 */
export default function GuidePanel() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  // 关闭引导面板，并持久化状态（示例逻辑）
  const closeGuide = async () => {
    await AsyncStorage.setItem("guide_last_closed", Date.now().toString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={SlideInUp.springify()} // 从上方滑入
      exiting={SlideOutDown} // 向下滑出
      style={styles.container}
    >
      <ThemedView style={styles.header}>
        <ThemedView>
          <ThemedText style={styles.title}>充分利用您的钱包</ThemedText>
          <ThemedText style={styles.subtitle}>
            查收您的Web3漫游指南手册
          </ThemedText>
        </ThemedView>
        <TouchableOpacity style={styles.closeButton} onPress={closeGuide}>
          <AntDesign name="close" size={12} color="#b5b5b5" />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {GUIDES.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInRight.delay(index * 100).duration(400)} // 依次淡入
          >
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => router.push(`/guide/${item.id}`)} // 跳转到模态详情页
            >
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </View>
              <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
  },
  subtitle: {
    color: "#A7A7A9",
    fontSize: 15,
    fontWeight: "400",
  },
  closeButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: grayScale[300],
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: grayScale[300],
    borderRadius: 24,
    // padding: 12,
    justifyContent: "space-between",
    paddingBottom: 13,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    height: 112,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});
