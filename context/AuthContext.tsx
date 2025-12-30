import { Loading } from "@/components/ui/Loading";
import { decodeToken } from "@/utils/auth/jwt";
import { tokenStore } from "@/utils/auth/tokenStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

// 用户信息接口定义
interface User {
  id: string;
  name: string;
  avatar?: string;
}

// 认证上下文类型定义
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: () => Promise<void>; // 跳转到登录流程
  performLogin: () => Promise<void>; // 执行实际的登录逻辑（模拟成功）
  loginModal: () => Promise<void>; // 打开登录引导弹窗
  logout: () => Promise<void>; // 登出逻辑
  setUserData: (user: User) => Promise<void>;
  isLoading: boolean; // 是否正在加载初始化状态
  globalLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 认证状态提供者
 * 负责全局登录状态的维护、持久化以及初始化加载
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    loadAuthState();

    // 监听全局 Loading 事件
    const subscription = DeviceEventEmitter.addListener(
      "api_loading",
      (loading: boolean) => {
        setGlobalLoading(loading);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // 从本地存储加载登录状态
  const loadAuthState = async () => {
    try {
      const accessToken = await tokenStore.getAccess();
      if (accessToken) {
        // {"exp": 1766738748, "iat": 1766738448, "user_id": 11}
        console.log("decodeToken", decodeToken(accessToken));
      }

      const storedAuth = await AsyncStorage.getItem("auth_state");
      if (storedAuth) {
        const { isLoggedIn: storedIsLoggedIn, user: storedUser } =
          JSON.parse(storedAuth);
        setIsLoggedIn(storedIsLoggedIn);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("加载登录状态失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 进入邮箱登录流程
  const login = async () => {
    router.push("/login/mail");
  };

  // 设置用户信息并持久化
  const setUserData = async (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    await AsyncStorage.setItem(
      "auth_state",
      JSON.stringify({ isLoggedIn: true, user: userData })
    );
  };

  // 执行最终的登录动作（模拟获取账户数据并持久化）
  const performLogin = async () => {
    const mockUser = {
      id: "19482231",
      name: "HyperBit2559",
    };
    await setUserData(mockUser);
  };

  // 打开弹窗式的登录引导
  const loginModal = async () => {
    router.replace("/guide/login");
  };

  // 登出并清除本地存储
  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await tokenStore.clear();
    await AsyncStorage.removeItem("auth_state");
  };

  const showLoading = () => setGlobalLoading(true);
  const hideLoading = () => setGlobalLoading(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        performLogin,
        setUserData,
        logout,
        isLoading,
        loginModal,
        globalLoading,
        showLoading,
        hideLoading,
      }}
    >
      {children}
      <Loading visible={globalLoading} />
    </AuthContext.Provider>
  );
}

/**
 * 便捷 Hook 用于在组件中访问认证状态
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth 必须在 AuthProvider 内部使用");
  }
  return context;
}
