import { PageScroll } from "@/components/page/PageScroll";
import { SettingItem } from "@/components/ui/SettingList";
import { CommonStyles } from "@/constants/theme/styles";
import { useI18n } from "@/hooks/use-i-18n";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function PreferenceScreen() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <>
      <Stack.Screen
        options={{
          title: t("preference.title"),
          headerBackTitle: "",
        }}
      />
      <PageScroll>
        <ScrollView contentContainerStyle={CommonStyles.scrollContent}>
          <SettingItem
            title={t("preference.display_language")}
            rightText={t("preference.language")}
            onPress={() => {
              router.push("/setting/language");
            }}
          />
          <SettingItem
            title={t("preference.currency")}
            rightText="美元/USD"
            onPress={() => {
              router.push("/setting/unit");
            }}
          />
          <SettingItem
            title={t("preference.notifications")}
            onPress={() => {
              router.push("/setting/notification");
            }}
          />
        </ScrollView>
      </PageScroll>
    </>
  );
}
