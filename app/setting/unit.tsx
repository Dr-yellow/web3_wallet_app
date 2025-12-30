import { PageScroll } from "@/components/page/PageScroll";
import { SelectionList } from "@/components/ui/SelectionList";
import { useI18n } from "@/hooks/use-i-18n";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

interface UnitItem {
  id: string;
  label: string;
}

const CURRENCIES: UnitItem[] = [
  { id: "USD", label: "美元 / USD" },
  { id: "CNY", label: "人民币 / CNY" },
  { id: "EUR", label: "欧元 / EUR" },
  { id: "JPY", label: "日元 / JPY" },
  { id: "HKD", label: "港币 / HKD" },
  { id: "GBP", label: "英镑 / GBP" },
];

export default function UnitSettingScreen() {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string>("");

  const handleSelect = (item: UnitItem) => {
    setSelectedId(item.id);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("unit.title"),
          headerBackTitle: "",
        }}
      />
      <PageScroll>
        <ScrollView>
          <SelectionList
            data={CURRENCIES}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </ScrollView>
      </PageScroll>
    </>
  );
}
