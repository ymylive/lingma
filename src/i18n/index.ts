export type AppLocale = 'zh-CN' | 'en-US';

type TranslationPattern = {
  pattern: RegExp;
  replace: (...segments: string[]) => string;
};

type LocaleResources = {
  exact: Record<string, string>;
  patterns: TranslationPattern[];
  fragments: Array<[string, string]>;
};

const I18N_STORAGE_KEY = 'ds_locale';
const CJK_PATTERN = /[\u4e00-\u9fff]/;
const localeResourceCache: Partial<Record<AppLocale, LocaleResources>> = {};
const localeResourcePromises = new Map<AppLocale, Promise<LocaleResources>>();

export function normalizeLocale(value: unknown): AppLocale {
  return value === 'en-US' ? 'en-US' : 'zh-CN';
}

export function detectPreferredLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return 'zh-CN';
  }

  const stored = window.localStorage.getItem(I18N_STORAGE_KEY);
  if (stored === 'zh-CN' || stored === 'en-US') {
    return stored;
  }

  return window.navigator.language?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
}

async function loadEnglishResources(): Promise<LocaleResources> {
  const [
    common,
    content,
    data,
    exerciseTitles,
    generated,
    lesson,
    page,
    practice,
    service,
    tutorialComponent,
    vibeCoding,
    visualization,
  ] = await Promise.all([
    import('./commonTranslations'),
    import('./contentTranslations'),
    import('./dataTranslations'),
    import('./exerciseTitleTranslations'),
    import('./generatedTranslations'),
    import('./lessonTranslations'),
    import('./pageTranslations'),
    import('./practiceTranslations'),
    import('./serviceTranslations'),
    import('./tutorialComponentTranslations'),
    import('./vibeCodingTranslations'),
    import('./visualizationTranslations'),
  ]);

  const exact = {
    ...common.commonTranslationsEn,
    ...content.contentTranslationsEn,
    ...exerciseTitles.exerciseTitleTranslationsEn,
    ...practice.practiceTranslationsEn,
    ...vibeCoding.vibeCodingTranslationsEn,
    ...service.serviceTranslationsEn,
    ...page.pageTranslationsEn,
    ...lesson.lessonTranslationsEn,
    ...tutorialComponent.tutorialComponentTranslationsEn,
    ...visualization.visualizationTranslationsEn,
    ...data.dataTranslationsEn,
    ...generated.generatedTranslationsEn,
  };

  const patterns = [
    ...common.commonPatternsEn,
    ...content.contentPatternsEn,
    ...practice.practicePatternsEn,
    ...vibeCoding.vibeCodingPatternsEn,
    ...service.servicePatternsEn,
    ...page.pagePatternsEn,
    ...lesson.lessonPatternsEn,
    ...tutorialComponent.tutorialComponentPatternsEn,
    ...visualization.visualizationPatternsEn,
    ...data.dataPatternsEn,
  ];

  return {
    exact,
    patterns,
    fragments: Object.entries(exact).sort((left, right) => right[0].length - left[0].length),
  };
}

export async function ensureLocaleResources(locale: AppLocale): Promise<void> {
  if (locale === 'zh-CN' || localeResourceCache[locale]) {
    return;
  }

  let pending = localeResourcePromises.get(locale);
  if (!pending) {
    pending = loadEnglishResources();
    localeResourcePromises.set(locale, pending);
  }

  const resources = await pending;
  localeResourceCache[locale] = resources;
}

function getLocaleResources(locale: AppLocale): LocaleResources | null {
  return localeResourceCache[locale] ?? null;
}

export function translateUiText(input: string, locale: AppLocale): string {
  if (!input || locale === 'zh-CN') {
    return input;
  }

  const resources = getLocaleResources(locale);
  if (!resources) {
    return input;
  }

  const exact = resources.exact[input];
  if (exact) {
    return exact;
  }

  for (const item of resources.patterns) {
    const match = input.match(item.pattern);
    if (match) {
      return item.replace(...match.slice(1));
    }
  }

  if (!CJK_PATTERN.test(input)) {
    return input;
  }

  let output = input;
  for (const [source, target] of resources.fragments) {
    if (source.length < 2 || !output.includes(source)) {
      continue;
    }
    output = output.split(source).join(target);
  }

  return output;
}
