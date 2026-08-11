import { useEffect, useState } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AgentInsightCard } from '@/components/AgentInsightCard';
import { GlassCard } from '@/components/GlassCard';
import { ProbabilityPill } from '@/components/ProbabilityPill';
import { Sparkline } from '@/components/Sparkline';
import { TradeModal } from '@/components/TradeModal';
import { useI18n } from '@/features/i18n/useI18n';
import { formatCompactNumber, formatDateShort } from '@/lib/format';
import { cn } from '@/lib/utils';
import { agentService } from '@/services/agentService';
import { marketService } from '@/services/marketService';
import type { AgentInsight, Market, OutcomeId } from '@/types/domain';

const tradeButtonClasses = [
  'bg-sky-300 shadow-sky-500/20',
  'bg-violet-300 shadow-violet-500/20',
  'bg-amber-300 shadow-amber-500/20',
  'bg-orange-300 shadow-orange-500/20',
  'bg-cyan-300 shadow-cyan-500/20',
];

function getOutcomeTone(outcomeId: OutcomeId) {
  if (outcomeId === 'yes') {
    return 'yes';
  }

  if (outcomeId === 'no') {
    return 'no';
  }

  return 'neutral';
}

function getBuyLabel(locale: 'sw' | 'en' | 'zh', label: string) {
  if (locale === 'zh') {
    return `买 ${label}`;
  }

  if (locale === 'sw') {
    return `Nunua ${label}`;
  }

  return `Buy ${label}`;
}

export function MarketDetailPage() {
  const { marketId } = useParams();
  const { locale, t } = useI18n();
  const [market, setMarket] = useState<Market | null>(null);
  const [insight, setInsight] = useState<AgentInsight | null>(null);
  const [tradeOutcome, setTradeOutcome] = useState<OutcomeId | null>(null);

  useEffect(() => {
    if (!marketId) return;
    marketService.getMarket(marketId, locale).then(setMarket);
    agentService.getMarketExplanation(marketId, locale).then(setInsight);
  }, [locale, marketId]);

  if (!market) {
    return <div className="h-96 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.06]" />;
  }

  const content = market.localizedContent[locale];
  const leadingOutcome = market.outcomes[0]!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link to={`/${locale}/markets`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>
        <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10">
          <Share2 className="h-4 w-4" />
          {t('common.share')}
        </button>
      </div>

      <GlassCard variant="strong" padding="lg">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
            {t(`markets.${market.category}` as never)}
          </span>
          <span className="text-sm text-white/45">
            {t('market.ends')} {formatDateShort(market.endsAt, locale)}
          </span>
          <span className="text-sm text-white/45">
            {t('market.volume')} {formatCompactNumber(market.volume, locale)}
          </span>
        </div>
        <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
          {content.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">{content.description}</p>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_220px] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-2">
            {market.outcomes.map((outcome, index) => (
              <ProbabilityPill
                key={outcome.id}
                label={outcome.label[locale]}
                probability={outcome.probability}
                tone={getOutcomeTone(outcome.id)}
                change={index === 0 ? market.change24h : undefined}
              />
            ))}
          </div>
          <Sparkline values={market.sparkline} className="h-20 w-full opacity-90" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {market.outcomes.map((outcome, index) => (
            <button
              key={outcome.id}
              type="button"
              onClick={() => setTradeOutcome(outcome.id)}
              className={cn(
                'h-14 rounded-2xl text-base font-black text-[#071018] shadow-lg transition hover:scale-[1.01]',
                outcome.id === 'yes' && 'bg-emerald-300 shadow-emerald-500/20',
                outcome.id === 'no' && 'bg-rose-300 shadow-rose-500/20',
                outcome.id !== 'yes' && outcome.id !== 'no' && tradeButtonClasses[index % tradeButtonClasses.length],
              )}
            >
              {getBuyLabel(locale, outcome.label[locale])}
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        {insight ? <AgentInsightCard insight={insight} /> : null}
        <GlassCard>
          <h2 className="mb-3 text-xl font-black text-white">{t('market.rules')}</h2>
          <p className="text-sm leading-6 text-white/62">{content.rules}</p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
            {content.resolutionSource}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="mb-4 text-xl font-black text-white">{t('market.activity')}</h2>
        <div className="grid gap-3 text-sm text-white/58">
          <div className="rounded-2xl bg-white/5 p-4">
            DarSignal bought {leadingOutcome.label[locale]} at {Math.max(leadingOutcome.probability - 2, 1)}%
          </div>
          <div className="rounded-2xl bg-white/5 p-4">Agent flagged {market.riskTags[0] ?? 'normal'} risk</div>
        </div>
      </GlassCard>

      {tradeOutcome ? (
        <TradeModal market={market} outcomeId={tradeOutcome} mode="demo" onClose={() => setTradeOutcome(null)} />
      ) : null}
    </div>
  );
}
