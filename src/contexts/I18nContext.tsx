import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { detectPreferredLocale, ensureLocaleResources, normalizeLocale, translateUiText, type AppLocale } from '../i18n';

interface I18nContextType {
  locale: AppLocale;
  isEnglish: boolean;
  setLocale: (locale: AppLocale) => void;
  t: (input: string) => string;
  formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
}

const I18N_STORAGE_KEY = 'ds_locale';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getInitialLocale(): AppLocale {
  return detectPreferredLocale();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(getInitialLocale);
  const [translationVersion, setTranslationVersion] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(I18N_STORAGE_KEY, locale);
    }
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    let active = true;

    if (locale !== 'en-US') {
      return () => {
        active = false;
      };
    }

    void ensureLocaleResources(locale).then(() => {
      if (active) {
        setTranslationVersion((value) => value + 1);
      }
    });

    return () => {
      active = false;
    };
  }, [locale]);

  const setLocale = useCallback((nextLocale: AppLocale) => {
    const normalized = normalizeLocale(nextLocale);
    if (normalized === locale) {
      return;
    }

    if (normalized === 'en-US') {
      void ensureLocaleResources(normalized).then(() => {
        setLocaleState(normalized);
      });
      return;
    }

    setLocaleState(normalized);
  }, [locale]);

  const t = useCallback((input: string) => translateUiText(input, locale), [locale, translationVersion]);

  const formatDate = useCallback((value: string | number | Date, options?: Intl.DateTimeFormatOptions) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return typeof value === 'string' ? value : '';
    }
    return new Intl.DateTimeFormat(locale, options).format(date);
  }, [locale]);

  const contextValue = useMemo(() => ({
    locale,
    isEnglish: locale === 'en-US',
    setLocale,
    t,
    formatDate,
  }), [formatDate, locale, setLocale, t]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
