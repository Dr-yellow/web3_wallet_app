import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";

import { DashboardCards } from "@/components/mine/DashboardCards";
import { MineFooter } from "@/components/mine/MineFooter";
import { ProfileHeader } from "@/components/mine/ProfileHeader";
import { PageScroll } from "@/components/page/PageScroll";
import { SettingSection } from "@/components/ui/SettingList";

import { LoggedOutView } from "@/components/mine/LoggedOutView";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/hooks/use-i-18n";

import { useRouter } from "expo-router";

/**
 * “我的”页面组件
 * 负责展示用户信息、资产仪表盘以及系统设置列表。
 * 根据登录状态自动切换展示“已登录视图”或“未登录视图”。
 */
export default function MineScreen() {
  const { isLoggedIn, login, logout } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  const primarySettings = [
    {
      icon: <Feather name="sliders" size={20} color="#fff" />,
      title: t("preference.title"),
      onPress: () => router.push("/setting/preference"),
    },
    {
      icon: <MaterialCommunityIcons name="lan" size={20} color="#fff" />,
      title: t("network.title"),
      rightText: "3",
      onPress: () => router.push("/setting/network"),
    },
    {
      icon: <MaterialIcons name="apps" size={20} color="#fff" />,
      title: t("mine.connected_apps"),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="notebook-outline"
          size={20}
          color="#fff"
        />
      ),
      title: t("mine.address_book"),
    },
  ];

  const secondarySettings = [
    {
      icon: <Ionicons name="help-circle-outline" size={22} color="#fff" />,
      title: t("mine.help_feedback"),
    },
    {
      icon: <Feather name="shield" size={20} color="#fff" />,
      title: t("mine.security_privacy"),
    },
    {
      icon: <MaterialIcons name="logout" size={20} color="#fff" />,
      title: t("mine.logout"),
      onPress: () => logout(),
    },
  ];

  if (!isLoggedIn) {
    return (
      <PageScroll>
        <LoggedOutView onLogin={login} />
      </PageScroll>
    );
  }

  return (
    <PageScroll noHeader>
      <ProfileHeader />
      <DashboardCards />

      <SettingSection items={primarySettings} />
      <SettingSection items={secondarySettings} />

      <MineFooter />
    </PageScroll>
  );
}
