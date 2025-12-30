import { PageScroll } from "@/components/page/PageScroll";
import SwitchRow from "@/components/ui/SwitchRow";
import { useI18n } from "@/hooks/use-i-18n";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function NotificationSettingScreen() {
  const { t } = useI18n();

  const [enabled, setEnabled] = useState(true);
  const [sendToken, setSendToken] = useState(false);
  const [receiveToken, setReceiveToken] = useState(true);
  const [other, setOther] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: t("notification.title"), // 通知推送
          headerBackTitle: "",
        }}
      />
      <PageScroll>
        <View>
          <SwitchRow
            label={t("notification.enable")}
            value={enabled}
            onChange={setEnabled}
            style={{ marginBottom: 16 }}
          />

          <SwitchRow
            label={t("notification.send")}
            value={sendToken}
            onChange={setSendToken}
            disabled={!enabled}
          />

          <SwitchRow
            label={t("notification.receive")}
            value={receiveToken}
            onChange={setReceiveToken}
            disabled={!enabled}
          />

          <SwitchRow
            label={t("notification.other")}
            value={other}
            onChange={setOther}
            disabled={!enabled}
          />
        </View>
      </PageScroll>
    </>
  );
}
