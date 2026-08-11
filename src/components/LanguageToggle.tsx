import { useState } from 'react';
import { Check, Globe2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n, supportedLocales } from '@/features/i18n/useI18n';
import { languageNames } from '@/features/i18n/translations';
import type { Locale } from '@/types/domain';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const navigate = useNavigate();
  const params = useParams();

  function switchLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    const currentPath = window.location.pathname;
    const currentLocale = params.locale;
    const nextPath = currentLocale
      ? currentPath.replace(`/${currentLocale}`, `/${nextLocale}`)
      : `/${nextLocale}${currentPath}`;
    navigate(nextPath + window.location.search, { replace: true });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t('common.language')}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-4 text-sm font-semibold text-white/85 backdrop-blur-2xl transition hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
      >
        <Globe2 className="h-4 w-4 text-cyan-200" />
        {languageNames[locale]}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-50 w-56 rounded-3xl border border-white/14 bg-[#101522]/90 p-2 shadow-2xl backdrop-blur-2xl">
          {supportedLocales.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => switchLocale(item)}
              className={cn(
                'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-white/75 transition hover:bg-white/10',
                item === locale && 'bg-white/10 text-white',
              )}
            >
              {languageNames[item]}
              {item === locale ? <Check className="h-4 w-4 text-emerald-300" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

