import { Page } from "@/components/page/Page";
import { ThemedText } from "@/components/themed-text";
import { AppOtpInput } from "@/components/ui/AppOtpInput";
import { FixedBottomButton } from "@/components/ui/FixedBottomButton";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { CommonStyles } from "@/constants/theme/styles";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

const OTP_LENGTH = 6;

/**
 * 确认密码页面
 */
export default function ComfirmPasswordScreen() {
  const router = useRouter();
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const [code, setCode] = useState<string[]>([]);
  const [error, setError] = useState("");

  // 键盘点击逻辑：最多输入 6 位
  const handleKeyPress = (key: string) => {
    if (code.length < OTP_LENGTH) {
      const newCode = [...code, key];
      setCode(newCode);
      setError("");
    }
  };

  // 退格键逻辑
  const handleBackspace = () => {
    setCode(code.slice(0, -1));
    setError("");
  };

  // 点击“完成”跳转到最终的签名验证页
  const handleFinish = useCallback(async () => {
    const enteredPin = code.join("");
    if (pin === enteredPin) {
      try {
        await SecureStore.setItemAsync("globalPassword", pin);
        Alert.alert("密码设置成功！", undefined, [
          {
            text: "确定",
            onPress: () => router.replace("/wallet-setup/onboarding"),
          },
        ]);
      } catch (e) {
        Alert.alert("保存失败", "请重试");
      }
    } else {
      setError("两次输入的密码不一致");
      // Optional: clear code or keep it
    }
  }, [code, pin, router]);

  return (
    <>
      <Stack.Screen
        options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
      />
      <Page>
        <View style={styles.content}>
          <ThemedText style={styles.title}>确认密码</ThemedText>

          {/* 密码输入框 */}
          <AppOtpInput code={code} error={error} secureTextEntry={true} />

          <View style={styles.messageContainer}>
            {!!error ? (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : (
              <ThemedText style={styles.subtitle}>
                {/* 再次输入密码以确认 */}
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
    fontSize: 20,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 40,
    textAlign: "center",
  },
  messageContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
  },
  errorText: {
    color: "#BB4545",
    fontSize: 14,
  },
  bottomContainer: {
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
});
