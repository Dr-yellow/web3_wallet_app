import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    checkFirstLaunch();
  }, []);
  const checkFirstLaunch = async () => {
    // 检查是否设置了全局密码
    const globalPassword = await SecureStore.getItemAsync("globalPassword");
    setIsFirstLaunch(!!globalPassword);
    console.log("globalPassword", globalPassword);
  };

  const handleAddAccount = () => {
    // 如果未设置全局密码，跳转到设置密码页面
    console.log("isFirstLaunch", isFirstLaunch);
    if (!isFirstLaunch) {
      router.push("/wallet-setup/global_password");
      return;
    }
    router.push("/wallet-setup/name-wallet");
  };

  const handleImportAccount = async () => {
    if (!isFirstLaunch) {
      router.push("/wallet-setup/global_password");
      return;
    }
    router.push("/wallet-setup/AddAcountScreen");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={{ flex: 1 }}>
        <Image
          style={styles.top}
          source={require("../../assets/images/wallet_banner.png")}
        />
        <View
          style={[
            CommomStyle.paddingHorizontal,

            {
              marginBottom: 40,
            },
          ]}
        >
          <Text style={[styles.title]}>
            基于资产语意层构建的新一代区块链钱包
          </Text>
        </View>
        <View
          style={[
            CommomStyle.column,
            CommomStyle.paddingHorizontal,
            CommomStyle.gap20,
          ]}
        >
          <TouchableOpacity
            style={ButtonStyle.primary}
            onPress={handleAddAccount}
            activeOpacity={0.7}
          >
            <Text style={ButtonStyle.primaryText}>创建新钱包</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ButtonStyle.default}
            onPress={handleImportAccount}
            activeOpacity={0.7}
          >
            <Text style={ButtonStyle.defaultText}>导入现有钱包</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={styles.bottom}>
          继续使用，即表示你同意并接受GM Wallet的
          <Text style={styles.bottomText}>《服务条款》</Text>和
          <Text style={styles.bottomText}>《隐私政策》</Text>。
        </Text>
      </View>
    </SafeAreaView>
  );
}
const ButtonStyle = StyleSheet.create({
  primary: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 26,
    width: "100%",
  },
  default: {
    backgroundColor: "#1D1D1D",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 26,
    width: "100%",
  },
  primaryText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "700",
  },
  defaultText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});

const CommomStyle = StyleSheet.create({
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  paddingHorizontal: {
    paddingHorizontal: 12,
  },
  h10: {
    height: 10,
  },
  gap10: {
    gap: 10,
  },
  gap20: {
    gap: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    flexDirection: "column",
  },
  top: {
    width: "100%",
  },
  title: {
    color: "#A7A7A9",
    fontFamily: "Noto Sans SC",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 21.527,
  },
  bottom: {
    color: "#B0B0B0",
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: -0.91,
    marginHorizontal: 19,
    // marginBottom: 37,
  },
  bottomText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
