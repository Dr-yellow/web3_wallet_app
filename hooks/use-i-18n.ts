import { useUserPreference } from "@/context/UserPreferenceContext";
import i18n from "@/i18n";
import { TLocale } from "@/i18n/types";
import { TranslateOptions } from "i18n-js";

// Hook to use I18n and trigger re-renders on language change
export const useI18n = (type?: keyof TLocale) => {
  const { locale, updateLocale } = useUserPreference();
  return {
    t: (scope: string, options?: TranslateOptions) => i18n.t(scope, { locale, ...options }),
    locale,
    changeLanguage: updateLocale,
  };
};
