import { ThemedView } from "@/components/themed-view";
import { useMultiChain } from "@/context/MultiChainContext";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NameWallet() {
  const router = useDebouncedNavigation();
  const insets = useSafeAreaInsets();
  const [walletName, setWalletName] = useState("");
  const { currentChain } = useMultiChain();
  const route = useRoute();
  // 生成默认钱包名称
  const getDefaultWalletName = () => {
    const chainSymbol = currentChain.symbol;
    console.log("currentChain", currentChain);
    const wallets = (route.params as any)?.existingWalletsCount || 0;
    console.log("chainSymbol", chainSymbol);
    console.log("wallets", wallets);
    return `${chainSymbol}-${wallets + 1}`;
  };

  useEffect(() => {
    // 设置默认钱包名称
    if (!walletName) {
      setWalletName(getDefaultWalletName());
    }
  }, []);
  const [agreed, setAgreed] = useState(false);
  const handleServiceAgreement = () => {
    router.push("/service-agreement");
  };
  const handleNext = () => {
    if (!walletName.trim()) {
      Alert.alert("错误", "请输入钱包名称");
      return;
    }

    if (!agreed) {
      Alert.alert("提示", "请先阅读并同意服务协议");
      return;
    }

    router.push({
      pathname: "./secure-wallet",
      params: { walletName },
    });
  };
  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "添加钱包",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#000",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerIcon}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 标题和说明 */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>
              {/* 创建 {currentChain.name} 钱包 */}
              创建钱包
            </Text>
            <Text style={styles.description}>
              请您给钱包设置一个钱包名，设置完成后输入钱包密码即可进行创建。
            </Text>
          </View>

          {/* 钱包名称输入 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>钱包名称</Text>
            <TextInput
              style={styles.input}
              value={walletName}
              onChangeText={setWalletName}
              placeholder="请输入钱包名称"
              placeholderTextColor="#666666"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* 服务协议 */}
          <View style={styles.agreementSection}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color="#FFFFFF"
                  />
                )}
              </View>
              <Text style={styles.agreementText}>我已阅读并同意</Text>
              <TouchableOpacity onPress={handleServiceAgreement}>
                <Text style={styles.agreementLink}>服务协议</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 下一步按钮 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!walletName.trim() || !agreed) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!walletName.trim() || !agreed}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>下一步</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  titleSection: {
    marginBottom: 32,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    color: "#9E9E9E",
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 32,
  },
  label: {
    color: "#FFFFFF",
    marginBottom: 12,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#3C3C3C",
  },
  agreementSection: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#666666",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  agreementText: {
    color: "#FFFFFF",
    marginRight: 4,
  },
  agreementLink: {
    color: "#2196F3",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2C",
  },
  nextButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.8)",
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});
