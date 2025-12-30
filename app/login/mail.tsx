import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { sendEmailCode } from "@/api/app/auth";
import { PageScroll } from "@/components/page/PageScroll";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/Button";
import { grayScale } from "@/constants/theme/base";
import { useAuth } from "@/context/AuthContext";

const COMMON_EMAIL_SUFFIXES = [
  "@gmail.com",
  "@outlook.com",
  "@icloud.com",
  "@qq.com",
  "@163.com",
  "@hotmail.com",
  "@yahoo.com",
];

/**
 * 邮箱登录页面
 * 登录流程的第一步，用户输入邮箱地址。
 */
export default function MailLoginScreen() {
  const { performLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 简单的邮箱格式校验
  const isValidEmail = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  // 计算补全建议
  const suggestions = useMemo(() => {
    if (!email) return [];

    // 如果已经包含完整的邮箱域名（简单的判断，比如已经有 @x.x），则不再提示，或者可以根据需求调整
    // 这里采用只要有匹配就提示的策略

    const atIndex = email.indexOf("@");

    let prefix = email;
    let suffixMatch = "";

    if (atIndex !== -1) {
      prefix = email.substring(0, atIndex);
      suffixMatch = email.substring(atIndex); // 包含 @
    }

    if (!prefix) return []; // 只有 @ 或空时不提示前缀

    const matches = COMMON_EMAIL_SUFFIXES.filter((suffix) =>
      suffix.startsWith(suffixMatch)
    );

    return matches.map((suffix) => `${prefix}${suffix}`);
  }, [email]);

  const handleSelectSuggestion = (suggestion: string) => {
    setEmail(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleTextChange = (text: string) => {
    setEmail(text);
    // 当有输入且不是在进行非常精确的完整匹配时（可选），显示建议
    setShowSuggestions(true);
  };

  const handleNext = async () => {
    if (!isValidEmail) return;
    try {
      await sendEmailCode(email);
      router.push({ pathname: "/login/otp", params: { email } });
    } catch (error: any) {
      Alert.alert("请求失败", error?.msg || "未知错误");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "输入您的邮箱" }} />
      {/* 使用 TouchableWithoutFeedback 关闭点击空白处的建议框，或者通过 UI 布局处理 */}
      <PageScroll>
        <ThemedView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.flex}
          >
            <View style={styles.content}>
              {/* 邮箱输入区域 */}
              <View style={[styles.inputWrapper, { zIndex: 10 }]}>
                <TextInput
                  style={[
                    styles.input,
                    { fontSize: email.length > 10 ? 16 : 32 },
                  ]}
                  placeholder="邮箱地址"
                  placeholderTextColor={grayScale[200]}
                  value={email}
                  onChangeText={handleTextChange}
                  autoFocus
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#fff"
                  onBlur={() => {
                    // 延时关闭，确保点击建议项能触发
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />

                {/* 自动补全下拉框 */}
                {showSuggestions && suggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      style={{ maxHeight: 200 }}
                    >
                      {suggestions.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() => handleSelectSuggestion(item)}
                        >
                          <ThemedText style={styles.suggestionText}>
                            {item}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* 下一步按钮 */}
              <Button
                title="下一步"
                variant="light"
                size="lg"
                onPress={handleNext}
                disabled={!isValidEmail}
              />

              <ThemedText style={styles.helperText}>
                未注册的邮箱将自动用于创建账户
              </ThemedText>

              {/* 分隔线 */}
              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <ThemedText style={styles.dividerText}>或者</ThemedText>
                <View style={styles.line} />
              </View>

              {/* 社交登录按钮组 */}
              <View style={styles.socialContainer}>
                <SocialButton
                  icon={<AntDesign name="google" size={20} color="#fff" />}
                  title="通过Google继续"
                  onPress={() => {
                    performLogin();
                    router.back();
                  }}
                />
                <SocialButton
                  icon={<Ionicons name="logo-apple" size={24} color="#fff" />}
                  title="通过Apple ID继续"
                />
                <SocialButton
                  icon={
                    <MaterialCommunityIcons
                      name="wallet"
                      size={22}
                      color="#fff"
                    />
                  }
                  title="通过区块链钱包继续"
                  onPress={() => router.push("/login/verify")}
                />
              </View>
            </View>

            {/* 底部协议声明 */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                注册即表示你同意并接受GM Wallet的
                <ThemedText style={styles.linkText}>《服务条款》</ThemedText>和
                <ThemedText style={styles.linkText}>《隐私政策》</ThemedText>。
              </ThemedText>
            </View>
          </KeyboardAvoidingView>
        </ThemedView>
      </PageScroll>
    </>
  );
}

function SocialButton({
  icon,
  title,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.socialButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.socialIconWrapper}>{icon}</View>
      <ThemedText style={styles.socialButtonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 48,
    position: "relative", // Needed for absolute positioning context
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 50, // Slightly below the input
    left: 16,
    right: 0,
    backgroundColor: "#1c1c1e",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    zIndex: 1000,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  suggestionText: {
    fontSize: 16,
    color: "#fff",
  },
  nextButton: {
    height: 64,
    borderRadius: 32,
    marginBottom: 24,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  helperText: {
    textAlign: "center",
    color: grayScale[200],
    fontSize: 15,
    marginBottom: 48,
    marginTop: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#444",
    fontSize: 13,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: grayScale[300],
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 24,
  },
  socialIconWrapper: {
    width: 40,
  },
  socialButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    marginRight: 40, // Balance the icon offset
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    marginTop: 40,
  },
  footerText: {
    textAlign: "left",
    color: grayScale[200],
    fontSize: 13,
    lineHeight: 20,
  },
  linkText: {
    color: "#fff",
    fontSize: 13,
  },
});
