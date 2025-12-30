import { Platform, StyleSheet } from "react-native";
import { grayScale } from "./base";

/**
 * 全局通用预览样式
 * 建议在组件中通过解构或直接引用的方式使用，保持视觉一致性。
 */
export const CommonStyles = StyleSheet.create({
  // 基础页面容器
  page: {
    flex: 1,
    // backgroundColor: grayScale[500],
  },
  rowContainer: {
    paddingHorizontal: 16,
  },
  // 安全区域滚动容器
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 100 : 40,
  },
  // 标准分段容器 (带左右间距)
  flexContainer: {
    paddingHorizontal: 16,
  },
  // 底部按钮固定容器
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    backgroundColor: "transparent",
  },

  // 列表/项 相关样式
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: grayScale[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  // 文本 样式
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: grayScale[100],
  },
  body: {
    fontSize: 15,
    color: grayScale[100],
    fontWeight: "400",
  },
  secondaryText: {
    fontSize: 14,
    color: grayScale[200],
    fontWeight: "400",
  },
  caption: {
    fontSize: 12,
    color: grayScale[200],
  },

  // 分割线
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    width: "100%",
  },

  // 阴影/玻璃感占位 (由于RN阴影较复杂，这里提供基础透明度)
  glassPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeBg: {
    backgroundColor: grayScale[300],
  }
});

// 也可以导出原子样式用于组合
export const TextStyles = {
  h1: { fontSize: 32, fontWeight: "700" as const, color: "#fff" },
  h2: { fontSize: 24, fontWeight: "700" as const, color: "#fff" },
  h3: { fontSize: 18, fontWeight: "600" as const, color: "#fff" },
  p: { fontSize: 15, color: grayScale[200] },
};
