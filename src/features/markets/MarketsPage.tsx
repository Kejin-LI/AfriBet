import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { MarketCard } from '@/components/MarketCard';
import { useI18n } from '@/features/i18n/useI18n';
import { marketService } from '@/services/marketService';
import type { Market, MarketCategory } from '@/types/domain';
import { cn } from '@/lib/utils';

const categories: Array<MarketCategory | 'all'> = ['all', 'football', 'economy', 'politics', 'crypto', 'entertainment', 'weather'];

export function MarketsPage() {
  const { locale, t } = useI18n();
  const params = new URLSearchParams(window.location.search);
  const initialCategory = (params.get('category') as MarketCategory | null) ?? 'all';
  const [category, setCategory] = useState<MarketCategory | 'all'>(initialCategory);
  const [query, setQuery] = useState('');
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    marketService.listMarkets({ locale, category, query }).then((items) => {
      setMarkets(items);
      setLoading(false);
    });
  }, [category, locale, query]);

  const title = useMemo(() => (category === 'all' ? t('markets.title') : t(`markets.${category}` as never)), [category, t]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.26em] text-cyan-100/50">{t('app.country')}</div>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white">{title}</h1>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-3 backdrop-blur-2xl">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition',
                category === item
                  ? 'border-cyan-200/40 bg-cyan-300/15 text-cyan-50'
                  : 'border-white/10 bg-white/5 text-white/55 hover:bg-white/10',
              )}
            >
              {item === 'all' ? t('markets.all') : t(`markets.${item}` as never)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4">
          <Search className="h-4 w-4 text-white/38" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('markets.search')}
            className="h-12 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </div>
      </div>

      {loading ? (
        <div className="hot-market-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/[0.06]" />
          ))}
        </div>
      ) : markets.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-10 text-center text-white/55">
          {t('markets.empty')}
        </div>
      ) : (
        <div className="hot-market-grid">
          {markets.map((market) => <MarketCard key={market.id} market={market} />)}
        </div>
      )}
    </div>
  );
}
