import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProbabilityPillProps = {
  label: string;
  probability: number;
  tone?: 'yes' | 'no' | 'neutral';
  change?: number;
};

export function ProbabilityPill({ label, probability, tone = 'neutral', change }: ProbabilityPillProps) {
  const positive = typeof change === 'number' && change >= 0;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3',
        tone === 'yes' && 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
        tone === 'no' && 'border-rose-300/20 bg-rose-300/10 text-rose-100',
        tone === 'neutral' && 'border-white/10 bg-white/5 text-white',
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black tracking-tight">{probability}%</span>
        {typeof change === 'number' ? (
          <span className={cn('flex items-center gap-1 text-xs', positive ? 'text-emerald-300' : 'text-rose-300')}>
            {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {positive ? '+' : ''}
            {change}
          </span>
        ) : null}
      </div>
    </div>
  );
}

