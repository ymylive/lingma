import { normalizeLocale, translateUiText, type AppLocale } from '../i18n';

const LOCALE_STORAGE_KEY = 'ds_locale';

export function getRuntimeLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return 'zh-CN';
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'zh-CN' || stored === 'en-US') {
    return stored;
  }

  const browserLocale = window.navigator.language?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
  return normalizeLocale(browserLocale);
}

export function isEnglishRuntimeLocale(): boolean {
  return getRuntimeLocale() === 'en-US';
}

export function localizeRuntimeText(input: string, englishFallback?: string): string {
  if (!input) {
    return input;
  }

  const locale = getRuntimeLocale();
  if (locale === 'zh-CN') {
    return input;
  }

  const translated = translateUiText(input, locale);
  if (translated !== input) {
    return translated;
  }

  return englishFallback || input;
}

export function pickRuntimeText(zh: string, en: string): string {
  return isEnglishRuntimeLocale() ? en : zh;
}
