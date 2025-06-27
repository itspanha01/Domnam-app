"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Locale } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'domnam-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    try {
      const storedLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Locale;
      if (storedLocale && ['en', 'km', 'zh'].includes(storedLocale)) {
        setLocale(storedLocale);
      }
    } catch (error) {
      console.error("Failed to parse locale from localStorage", error);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
  };

  const t = (key: string, replacements: Record<string, string> = {}): string => {
    let translation = translations[locale]?.[key] || translations['en'][key] || key;
    Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{${rKey}}`, replacements[rKey]);
    });
    return translation;
  };
  
  const value = {
    locale,
    setLocale: handleSetLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
