import { WalletCards } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useI18n } from '@/features/i18n/useI18n';
import { formatCurrency } from '@/lib/format';
import { markets } from '@/mocks/markets';
import { useAppStore } from '@/store/useAppStore';

export function PortfolioPage() {
  const { locale, t } = useI18n();
  const portfolio = useAppStore((state) => state.portfolio);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-cyan-100/50">
          <WalletCards className="h-4 w-4" />
          Demo mode
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white">{t('portfolio.title')}</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard label={t('home.demoBalance')} value={formatCurrency(portfolio.demoBalance, locale)} />
        <MetricCard label={t('portfolio.pnl')} value={formatCurrency(portfolio.totalPnl, locale)} tone="good" />
        <MetricCard label={t('portfolio.winRate')} value={`${portfolio.winRate}%`} />
        <MetricCard label={t('portfolio.rank')} value={`#${portfolio.rank}`} tone="gold" />
      </div>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">{t('portfolio.open')}</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/45">
            {t('portfolio.realDisabled')}
          </span>
        </div>
        <div className="grid gap-3">
          {portfolio.positions.map((position) => {
            const market = markets.find((item) => item.id === position.marketId);
            return (
              <div key={position.id} className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.045] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="font-bold text-white">{market?.localizedContent[locale].title}</div>
                  <div className="mt-2 text-sm text-white/45">
                    {position.outcomeId.toUpperCase()} · {position.entryProbability}% → {position.currentProbability}%
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-black text-white">{formatCurrency(position.amount, locale)}</div>
                  <div className="text-sm font-bold text-emerald-300">+{formatCurrency(position.unrealizedPnl, locale)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard variant="agent">
        <h2 className="mb-2 text-xl font-black text-white">{t('agent.title')}</h2>
        <p className="text-sm leading-6 text-white/62">
          {locale === 'sw'
            ? 'Unafanya vizuri zaidi kwenye masoko ya mpira kuliko FX. Punguza ukubwa wa nafasi pale tagi za volatility zinapoonekana.'
            : locale === 'zh'
              ? '你在足球市场上的表现好于汇率市场。出现高波动标签时，建议降低仓位规模。'
              : 'You perform better in football markets than FX markets. Keep position sizes smaller when volatility tags appear.'}
        </p>
      </GlassCard>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'gold' }) {
  return (
    <GlassCard padding="sm">
      <div className="text-xs uppercase tracking-[0.2em] text-white/42">{label}</div>
      <div className={tone === 'good' ? 'mt-2 text-2xl font-black text-emerald-300' : tone === 'gold' ? 'mt-2 text-2xl font-black text-amber-200' : 'mt-2 text-2xl font-black text-white'}>
        {value}
      </div>
    </GlassCard>
  );
}
