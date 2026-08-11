import { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { Locale } from '@/types/domain';
import { translations, type TranslationKey } from './translations';

export const supportedLocales: Locale[] = ['sw', 'en', 'zh'];
export const defaultLocale: Locale = 'sw';

export function isSupportedLocale(value: string | undefined): value is Locale {
  return Boolean(value && supportedLocales.includes(value as Locale));
}

export function useI18n() {
  const locale = useAppStore((state) => state.locale);
  const setLocale = useAppStore((state) => state.setLocale);

  const t = useCallback(
    (key: TranslationKey) => translations[locale]?.[key] ?? translations.en[key],
    [locale],
  );

  return { locale, setLocale, t };
}
