import { commonPatternsEn, commonTranslationsEn } from './commonTranslations';
import { contentPatternsEn, contentTranslationsEn } from './contentTranslations';
import { practicePatternsEn, practiceTranslationsEn } from './practiceTranslations';

export type AppLocale = 'zh-CN' | 'en-US';

const exactTranslations = {
  'en-US': {
    ...commonTranslationsEn,
    ...contentTranslationsEn,
    ...practiceTranslationsEn,
  },
} as const satisfies Partial<Record<AppLocale, Record<string, string>>>;

const patternTranslations = {
  'en-US': [
    ...commonPatternsEn,
    ...contentPatternsEn,
    ...practicePatternsEn,
  ],
} as const;

export function normalizeLocale(value: unknown): AppLocale {
  return value === 'en-US' ? 'en-US' : 'zh-CN';
}

export function translateUiText(input: string, locale: AppLocale): string {
  if (!input || locale === 'zh-CN') {
    return input;
  }

  const exact = exactTranslations[locale]?.[input];
  if (exact) {
    return exact;
  }

  const patterns = patternTranslations[locale] || [];
  for (const item of patterns) {
    const match = input.match(item.pattern);
    if (match) {
      return item.replace(...match.slice(1));
    }
  }

  return input;
}
