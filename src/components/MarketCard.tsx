import { Link } from 'react-router-dom';
import { Sparkline } from '@/components/Sparkline';
import { useI18n } from '@/features/i18n/useI18n';
import type { Market, OutcomeId } from '@/types/domain';
import { cn } from '@/lib/utils';

type MarketCardProps = {
  market: Market;
};

const outcomeTextClasses = [
  'text-sky-600 dark:text-sky-300',
  'text-violet-600 dark:text-violet-300',
  'text-amber-600 dark:text-amber-300',
  'text-orange-600 dark:text-orange-300',
  'text-cyan-600 dark:text-cyan-300',
];

const outcomeBarClasses = [
  'bg-sky-400/30',
  'bg-violet-400/30',
  'bg-amber-400/30',
  'bg-orange-400/30',
  'bg-cyan-400/30',
];

function getOutcomeTextClass(outcomeId: OutcomeId, index: number) {
  if (outcomeId === 'yes') {
    return 'text-emerald-600 dark:text-emerald-300';
  }

  if (outcomeId === 'no') {
    return 'text-rose-600 dark:text-rose-300';
  }

  return outcomeTextClasses[index % outcomeTextClasses.length];
}

function getOutcomeBarClass(outcomeId: OutcomeId, index: number) {
  if (outcomeId === 'yes') {
    return 'bg-emerald-400/30';
  }

  if (outcomeId === 'no') {
    return 'bg-rose-400/30';
  }

  return outcomeBarClasses[index % outcomeBarClasses.length];
}

function formatDollarVolume(value: number) {
  if (value >= 1_000_000) {
    return `$ ${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `$ ${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  }

  return `$ ${value}`;
}

export function MarketCard({ market }: MarketCardProps) {
  const { locale, t } = useI18n();
  const content = market.localizedContent[locale];
  const visibleOutcomes = market.outcomes.slice(0, 4);
  const tradeVolumeLabel = locale === 'zh' ? '交易量' : 'Volume';

  return (
    <Link
      to={`/${locale}/markets/${market.id}`}
      className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-white/[0.085]"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-xs font-bold text-cyan-100/70">{t(`markets.${market.category}` as never)}</span>
      </div>

      <h3 className="line-clamp-2 min-h-[40px] text-sm font-black leading-5 text-white">{content.title}</h3>

      <div className="mt-3 grid gap-1.5">
        {visibleOutcomes.map((outcome, index) => (
          <MarketOutcome
            key={outcome.id}
            label={outcome.label[locale]}
            probability={outcome.probability}
            textClassName={getOutcomeTextClass(outcome.id, index)}
            barClassName={getOutcomeBarClass(outcome.id, index)}
          />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <span className="text-xs font-semibold text-white/45">{formatDollarVolume(market.volume)} {tradeVolumeLabel}</span>
        <Sparkline values={market.sparkline} className="h-8 w-24 opacity-80" />
      </div>
    </Link>
  );
}

function MarketOutcome({
  label,
  probability,
  textClassName,
  barClassName,
}: {
  label: string;
  probability: number;
  textClassName: string;
  barClassName: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-slate-950/[0.045] ring-1 ring-slate-900/[0.05] dark:bg-white/[0.04] dark:ring-white/[0.06]">
      <div
        className={cn('absolute inset-y-0 left-0 rounded-lg shadow-[inset_-1px_0_0_rgba(255,255,255,0.28)]', barClassName)}
        style={{ width: `${probability}%` }}
      />
      <div className="relative grid grid-cols-[minmax(0,1fr)_42px] items-center px-2 py-1.5">
        <span className={cn('truncate text-xs font-bold', textClassName)}>{label}</span>
        <span className="text-right text-xs font-black text-white">{probability}%</span>
      </div>
    </div>
  );
}
