/**
 * i18n 前端本地文案国际化（接口文案应通过header之类传参告知后端处理）
 * 
 */

import { getItem, setItem } from "@/db/kv";
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import locales from "./locales";

// 初始化
const i18n = new I18n({
  ...locales
});

i18n.locale = getLocales()[0]?.languageCode ?? "en";
i18n.enableFallback = true;

const STORAGE_KEY = "app_language";

export const setAppLanguage = async (lang: string) => {
  i18n.locale = lang;
  try {
    await setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.error("Failed to save language preference:", error);
  }
};

export const getAppLanguage = async () => {
  const deviceLocale = getLocales()[0]?.languageCode || 'en';
  try {
    const savedLang = await getItem(STORAGE_KEY);
    return savedLang || deviceLocale;
  } catch (error) {
    return deviceLocale;
  }
};



// Context handles initialization
export default i18n;
