import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const { width } = Dimensions.get("window");
const OTP_LENGTH = 6;

/**
 * 验证码输入页面
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

  // 点击“完成”跳转到最终的确认密码页面
  const handleFinish = useCallback(() => {
    router.push({
      pathname: "/wallet-setup/comfirm_password",
      params: {
        pin: code.join(""),
      },
    });
  }, [code]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* 密码输入框：支持渐变边框聚焦效果 */}
        <View style={styles.otpContainer}>
          {Array(OTP_LENGTH)
            .fill(0)
            .map((_, index) => {
              const isFocused = index === code.length;
              const hasValue = index < code.length;

              return (
                <View key={index} style={styles.inputBoxWrapper}>
                  {isFocused ? (
                    <LinearGradient
                      colors={["#5EEAD4", "#F87171"]} // 聚焦时的渐变边框
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
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
                      style={[styles.inputBox, hasValue && styles.hasValueBox]}
                    >
                      <ThemedText style={styles.otpText}>
                        {code[index]}
                      </ThemedText>
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      </View>

      {/* 自定义数字键盘 */}
      <View style={styles.keypad}>
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          ["", "0", "delete"],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, colIndex) => {
              if (key === "") return <View key={colIndex} style={styles.key} />;

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={styles.key}
                  onPress={() =>
                    key === "delete" ? handleBackspace() : handleKeyPress(key)
                  }
                  activeOpacity={0.6}
                >
                  {key === "delete" ? (
                    <Ionicons name="backspace-outline" size={28} color="#fff" />
                  ) : (
                    <ThemedText style={styles.keyText}>{key}</ThemedText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* 底部确认按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.finishButton,
            code.length < OTP_LENGTH && styles.disabledButton,
          ]}
          onPress={handleFinish}
          disabled={code.length < OTP_LENGTH}
        >
          <ThemedText style={styles.finishButtonText}>下一步</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputBoxWrapper: {
    width: (width - 48 - 50) / 6,
    height: 64,
  },
  focusedBorder: {
    flex: 1,
    padding: 1.5,
    borderRadius: 12,
  },
  inputBoxInterior: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10.5,
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  hasValueBox: {
    borderColor: "rgba(255,255,255,0.3)",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "700",
  },
  keypad: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  key: {
    width: width / 3 - 20,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: 28,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  finishButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
