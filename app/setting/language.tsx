import { PageScroll } from "@/components/page/PageScroll";
import { SelectionList } from "@/components/ui/SelectionList";
import { useI18n } from "@/hooks/use-i-18n";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

interface LanguageItem {
  id: string;
  label: string;
}

const LANGUAGES: LanguageItem[] = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" }, // Updated ID to match i18n config
  // { id: "zh-Hant", label: "中文(繁体)" },
  // { id: "ja", label: "日本語" },
  // { id: "de", label: "Deutsch" },
  // { id: "es", label: "Español" },
  // { id: "ru", label: "Русский" },
  // { id: "tr", label: "Türkçe" },
  // { id: "id", label: "Bahasa Indonesia" },
  // { id: "ar", label: "العربية" },
];

export default function LanguageSettingScreen() {
  const router = useRouter();
  const { t, locale, changeLanguage } = useI18n();
  const [selectedId, setSelectedId] = useState(locale); // Initialize with current locale
  const handleSelect = (item: LanguageItem) => {
    setSelectedId(item.id);
    changeLanguage(item.id);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("preference.display_language"),
          headerBackTitle: "",
        }}
      />
      <PageScroll>
        <ScrollView>
          <SelectionList
            data={LANGUAGES}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </ScrollView>
      </PageScroll>
    </>
  );
}
