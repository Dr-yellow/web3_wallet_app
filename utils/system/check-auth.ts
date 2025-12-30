import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

export const checkBiometricSupport = async () => {
  const isAuthenticated = await LocalAuthentication.hasHardwareAsync();
  if (!isAuthenticated) {
    Alert.alert("此设备不支持生物识别");
    return false;
  }
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    Alert.alert("用户未注册生物识别");
    return false;
  }
  return true;
};

export const authenticate = async () => {
  const isAuthenticated = await checkBiometricSupport();
  if (!isAuthenticated) return;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "使用指纹或面部ID解锁",
    cancelLabel: "取消",
    disableDeviceFallback: false,

    //   addroid 新增参数
    promptSubtitle: "请确认你的身份",
    promptDescription: "请将允许你访问敏感信息",
  });

  return result;
};
