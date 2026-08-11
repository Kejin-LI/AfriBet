import type { Locale } from '@/types/domain';

const localeMap: Record<Locale, string> = {
  sw: 'sw-TZ',
  en: 'en-US',
  zh: 'zh-CN',
};

export function formatCompactNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(localeMap[locale], {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(localeMap[locale], {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = 'DEMO') {
  if (currency === 'DEMO') {
    return `${formatNumber(value, locale)} DC`;
  }
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateShort(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeMap[locale], {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
