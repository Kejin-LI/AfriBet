import { Brain, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useI18n } from '@/features/i18n/useI18n';
import type { AgentInsight } from '@/types/domain';

type AgentInsightCardProps = {
  insight: AgentInsight;
};

const iconMap = {
  'daily-brief': Sparkles,
  'market-mover': TrendingUp,
  'risk-alert': ShieldAlert,
  'market-explanation': Brain,
};

export function AgentInsightCard({ insight }: AgentInsightCardProps) {
  const { locale, t } = useI18n();
  const Icon = iconMap[insight.type];

  return (
    <GlassCard variant={insight.type === 'risk-alert' ? 'warning' : 'agent'} padding="md">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-bold tracking-tight text-white">{insight.title[locale]}</h3>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              {t('common.confidence')}: {insight.confidence}
            </span>
          </div>
          <p className="text-sm leading-6 text-white/66">{insight.body[locale]}</p>
        </div>
      </div>
    </GlassCard>
  );
}

