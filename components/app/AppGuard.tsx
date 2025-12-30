import { useAuth } from "@/context/AuthContext";
import { usePathname, useSegments } from "expo-router";
import { useEffect } from "react";

/**
 * AppGuard 负责处理基于认证状态的重定向逻辑。
 * 白名单中的路径无需登录即可访问。
 */
export function AppGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, loginModal } = useAuth();
  const pathname = usePathname();
  const segments = useSegments();

  // 定义无需认证即可访问的公共路径
  // 注意：expo-router 的 usePathname 不包含 (tabs) 等组名，所以需要结合 useSegments 判定
  const isTabPath =
    segments[0] === "(tabs)" ||
    pathname === "/home" ||
    pathname === "/mine" ||
    pathname === "/";

  // 所有登录流程相关的页面（包括引导弹窗）都定义为公共路径
  const isLoginPath =
    pathname.startsWith("/login") || pathname.includes("/guide/");

  const isWalletSetupPath = pathname.startsWith("/wallet-setup");

  const isPublicPath = isTabPath || isLoginPath || isWalletSetupPath;

  // if (!isLoggedIn && !isLoggedIn) {
  //   // 如果未登录且尝试访问私有路径，重定向到登录引导弹窗
  //   // loginModal();
  //   return <Redirect href="/login" />;
  // }

  useEffect(() => {
    if (!isLoggedIn && !isPublicPath) {
      // 如果未登录且尝试访问私有路径，重定向到登录引导弹窗
      loginModal();
    }
  }, [isLoggedIn, isPublicPath]);

  return isLoading ? null : <>{children}</>;
}
