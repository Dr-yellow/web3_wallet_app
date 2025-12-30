// app/_layout.tsx 或你的 TabLayout 文件
import LiquidGlassTabBar from "@/components/LiquidGlassTabBar";
import { HomeNavIcon, PersonNavIcon } from "@/components/icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useI18n } from "@/hooks/use-i-18n";
import { TabItem } from "@/type/navigation";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  const tabs: TabItem[] = [
    {
      href: "/home",
      title: t("navigation.home"),
      name: "home",
      icon: HomeNavIcon,
    },
    {
      href: "/mine",
      title: t("navigation.mine"),
      name: "mine",
      icon: PersonNavIcon,
    },
  ];
  return (
    <>
      {/* 隐藏默认 TabBar */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen key={tab.name} name={tab.name} />
        ))}
      </Tabs>

      {/* 液态玻璃 TabBar */}
      <LiquidGlassTabBar tabs={tabs} />
    </>
  );
}
