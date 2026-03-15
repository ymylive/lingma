import { commonPatternsEn, commonTranslationsEn } from './commonTranslations';
import { contentPatternsEn, contentTranslationsEn } from './contentTranslations';
import { dataPatternsEn, dataTranslationsEn } from './dataTranslations';
import { exerciseTitleTranslationsEn } from './exerciseTitleTranslations';
import { generatedTranslationsEn } from './generatedTranslations';
import { lessonPatternsEn, lessonTranslationsEn } from './lessonTranslations';
import { pagePatternsEn, pageTranslationsEn } from './pageTranslations';
import { practicePatternsEn, practiceTranslationsEn } from './practiceTranslations';
import { servicePatternsEn, serviceTranslationsEn } from './serviceTranslations';
import { tutorialComponentPatternsEn, tutorialComponentTranslationsEn } from './tutorialComponentTranslations';
import { vibeCodingPatternsEn, vibeCodingTranslationsEn } from './vibeCodingTranslations';
import { visualizationPatternsEn, visualizationTranslationsEn } from './visualizationTranslations';

export type AppLocale = 'zh-CN' | 'en-US';

const exactTranslations = {
  'en-US': {
    ...commonTranslationsEn,
    ...contentTranslationsEn,
    ...exerciseTitleTranslationsEn,
    ...practiceTranslationsEn,
    ...vibeCodingTranslationsEn,
    ...serviceTranslationsEn,
    ...pageTranslationsEn,
    ...lessonTranslationsEn,
    ...tutorialComponentTranslationsEn,
    ...visualizationTranslationsEn,
    ...dataTranslationsEn,
    ...generatedTranslationsEn,
  },
} as const satisfies Partial<Record<AppLocale, Record<string, string>>>;

const patternTranslations = {
  'en-US': [
    ...commonPatternsEn,
    ...contentPatternsEn,
    ...practicePatternsEn,
    ...vibeCodingPatternsEn,
    ...servicePatternsEn,
    ...pagePatternsEn,
    ...lessonPatternsEn,
    ...tutorialComponentPatternsEn,
    ...visualizationPatternsEn,
    ...dataPatternsEn,
  ],
} as const;

const fragmentTranslations = {
  'en-US': Object.entries(exactTranslations['en-US']).sort((left, right) => right[0].length - left[0].length),
} as const satisfies Partial<Record<AppLocale, Array<[string, string]>>>;

const CJK_PATTERN = /[\u4e00-\u9fff]/;

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

  if (!CJK_PATTERN.test(input)) {
    return input;
  }

  let output = input;
  for (const [source, target] of fragmentTranslations[locale] || []) {
    if (source.length < 2 || !output.includes(source)) {
      continue;
    }
    output = output.split(source).join(target);
  }

  return output;
}
