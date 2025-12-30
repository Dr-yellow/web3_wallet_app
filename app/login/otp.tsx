import { loginByEmail } from "@/api/app/auth";
import { getUserInfo } from "@/api/app/user";
import { Page } from "@/components/page/Page";
import { ThemedText } from "@/components/themed-text";
import { FixedBottomButton } from "@/components/ui/FixedBottomButton";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { grayScale } from "@/constants/theme/base";
import { CommonStyles } from "@/constants/theme/styles";
import { useAuth } from "@/context/AuthContext";
import { tokenStore } from "@/utils/auth/tokenStore";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

const OTP_LENGTH = 6;

/**
 * 验证码输入页面
 * 用户输入发送到邮箱的 6 位数字验证码。
 */
export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [code, setCode] = useState<string[]>([]);
  const [error, setError] = useState("");
  const { setUserData } = useAuth();

  // 键盘点击逻辑：最多输入 6 位
  const handleKeyPress = (key: string) => {
    if (code.length < OTP_LENGTH) {
      const newCode = [...code, key];
      setCode(newCode);
      setError(""); // Clear error on new input
    }
  };

  // 退格键逻辑
  const handleBackspace = () => {
    setCode(code.slice(0, -1));
    setError("");
  };

  // 验证码输入完成
  const handleFinish = async () => {
    if (code.length === OTP_LENGTH) {
      try {
        const res = await loginByEmail({ code: code.join(""), email });
        const { access_token, refresh_token, user_id } = res.data;
        await tokenStore.set(access_token, refresh_token, user_id);
        const userInfo = await getUserInfo();
        await setUserData(userInfo.data);
        router.dismissAll();
      } catch (error: any) {
        Alert.alert("请求失败", error?.msg || "未知错误");
        setError(error.msg);
      }
    }
  };

  useEffect(() => {
    // 自动触发
    if (code.length === OTP_LENGTH) {
      handleFinish();
    }
  }, [code]);

  return (
    <>
      <Stack.Screen
        options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
      />
      <Page>
        <View style={styles.content}>
          <ThemedText style={styles.title}>验证邮箱</ThemedText>

          {/* 验证码输入框 */}
          <View style={styles.otpContainer}>
            {Array(OTP_LENGTH)
              .fill(0)
              .map((_, index) => {
                const isFocused = index === code.length && !error;
                const hasValue = index < code.length;
                const isError = !!error;

                let borderColor = "#1F1F1F";
                if (isError) borderColor = "#BB4545"; // Red for error
                else if (hasValue) borderColor = "#1F1F1F";

                return (
                  <View key={index} style={styles.inputBoxWrapper}>
                    {isFocused ? (
                      <LinearGradient
                        colors={[
                          "#FFE26C",
                          "#82FFF9",
                          "#FF815E",
                          "#9FFFDD",
                          "#A1FFFE",
                        ]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.focusedBorder}
                      >
                        <View style={styles.inputBoxInterior}>
                          <ThemedText style={styles.otpText}>
                            {code[index]}
                          </ThemedText>
                        </View>
                      </LinearGradient>
                    ) : (
                      <View
                        style={[
                          styles.inputBox,
                          { borderColor },
                          hasValue && styles.hasValueBox,
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.otpText,
                            isError && { color: "#BB4545" },
                          ]}
                        >
                          {code[index]}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                );
              })}
          </View>

          {/* Error Message or Resend Code */}
          <View style={styles.messageContainer}>
            {!!error ? (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : (
              <ThemedText style={styles.resendText}>
                没有收到验证码?{" "}
                <ThemedText style={styles.resendLink}>重新发送</ThemedText>
              </ThemedText>
            )}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <NumericKeypad
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
          />
          <FixedBottomButton
            disabled={code.length < OTP_LENGTH}
            title="完成"
            onPress={handleFinish}
          />
        </View>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    ...CommonStyles.rowContainer,
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  inputBoxWrapper: {
    height: 64,
    width: 55,
  },
  focusedBorder: {
    flex: 1,
    padding: 1.6,
    borderRadius: 12,
  },
  inputBoxInterior: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10.5,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  inputBox: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "1F1F1F",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  hasValueBox: {
    borderColor: "1F1F1F",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "700",
  },
  messageContainer: {
    alignItems: "center",
  },
  errorText: {
    color: "#BB4545",
    fontSize: 14,
  },
  resendText: {
    color: grayScale[200],
    fontSize: 15,
  },
  resendLink: {
    fontWeight: "600",
  },
  bottomContainer: {
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
});
