import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ru" | "uz";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (obj: { en: string; ru: string; uz: string } | undefined | null) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const t = (obj: { en: string; ru: string; uz: string } | undefined | null) => {
    if (!obj) return "";
    return obj[lang] || obj.en;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
