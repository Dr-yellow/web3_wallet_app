// 用户偏好context

import i18n, { getAppLanguage, setAppLanguage } from "@/i18n";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserPreferenceContextType {
  locale: string;
  updateLocale: (lang: string) => Promise<void>;
}

const UserPreferenceContext = createContext<UserPreferenceContextType>({
  locale: "en",
  updateLocale: async () => {},
});

export const UserPreferenceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    const initLocale = async () => {
      const storedLang = await getAppLanguage();
      // Ensure i18n instance is updated
      i18n.locale = storedLang;
      setLocale(storedLang);
    };
    initLocale();
  }, []);

  const updateLocale = async (lang: string) => {
    await setAppLanguage(lang);
    setLocale(lang);
  };

  return (
    <UserPreferenceContext.Provider value={{ locale, updateLocale }}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

export const useUserPreference = () => useContext(UserPreferenceContext);
