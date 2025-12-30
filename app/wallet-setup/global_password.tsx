import { Page } from "@/components/page/Page";
import { ThemedText } from "@/components/themed-text";
import { AppOtpInput } from "@/components/ui/AppOtpInput";
import { FixedBottomButton } from "@/components/ui/FixedBottomButton";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { CommonStyles } from "@/constants/theme/styles";
import { Stack, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

const OTP_LENGTH = 6;

/**
 * 全局密码设置页面
 * 用户输入 6 位数字密码。
 */
export default function GlobalPasswordScreen() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>([]);

  // 键盘点击逻辑：最多输入 6 位
  const handleKeyPress = (key: string) => {
    if (code.length < OTP_LENGTH) {
      setCode([...code, key]);
    }
  };

  // 退格键逻辑
  const handleBackspace = () => {
    setCode(code.slice(0, -1));
  };

  // 点击“下一步”跳转到确认密码页面
  const handleFinish = useCallback(() => {
    if (code.length === OTP_LENGTH) {
      router.push({
        pathname: "/wallet-setup/comfirm_password",
        params: {
          pin: code.join(""),
        },
      });
    }
  }, [code, router]);

  return (
    <>
      <Stack.Screen
        options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
      />
      <Page>
        <View style={styles.content}>
          <ThemedText style={styles.title}>创建密码</ThemedText>

          {/* 密码输入框 */}
          <AppOtpInput code={code} secureTextEntry={true} />

          <View style={styles.messageContainer}>
            <ThemedText style={styles.subtitle}>
              该密码将用于保护您的钱包资产安全
            </ThemedText>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <NumericKeypad
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
          />
          <FixedBottomButton
            disabled={code.length < OTP_LENGTH}
            title="下一步"
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
  bottomContainer: {
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
});
