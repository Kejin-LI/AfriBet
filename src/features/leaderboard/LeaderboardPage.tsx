import { useEffect, useState } from 'react';
import { ShieldCheck, Trophy } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useI18n } from '@/features/i18n/useI18n';
import { formatCurrency, formatDateShort } from '@/lib/format';
import { leaderboardService } from '@/services/leaderboardService';
import type { Leaderboard } from '@/types/domain';
import { cn } from '@/lib/utils';

export function LeaderboardPage() {
  const { locale, t } = useI18n();
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);

  useEffect(() => {
    leaderboardService.getSeasonLeaderboard(locale).then(setLeaderboard);
  }, [locale]);

  if (!leaderboard) {
    return <div className="h-96 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.06]" />;
  }

  return (
    <div className="space-y-6">
      <GlassCard variant="strong" padding="lg" className="relative">
        <div className="absolute right-[-40px] top-[-60px] h-52 w-52 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-amber-100/65">
            <Trophy className="h-4 w-4" />
            {t('leaderboard.title')}
          </div>
          <h1 className="text-4xl font-black tracking-[-0.04em] text-white">{leaderboard.title[locale]}</h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100">
            <ShieldCheck className="h-4 w-4" />
            {t('leaderboard.fair')} · {t('leaderboard.ends')} {formatDateShort(leaderboard.endsAt, locale)}
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-3">
        {leaderboard.entries.slice(0, 3).map((entry) => (
          <GlassCard key={entry.userId} variant="warning" className="text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-amber-200 text-2xl font-black text-[#201505]">
              #{entry.rank}
            </div>
            <div className="text-xl font-black text-white">{entry.displayName}</div>
            <div className="mt-2 text-2xl font-black text-amber-200">{formatCurrency(entry.pnl, locale)}</div>
            <div className="mt-1 text-sm text-white/45">{entry.winRate}% · {entry.marketsTraded} markets</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div className="grid gap-2">
          {leaderboard.entries.map((entry) => (
            <div
              key={entry.userId}
              className={cn(
                'grid grid-cols-[54px_1fr_auto] items-center gap-3 rounded-2xl px-4 py-3',
                entry.userId === 'demo-user' ? 'border border-cyan-300/20 bg-cyan-300/10' : 'bg-white/[0.045]',
              )}
            >
              <div className="font-black text-white/72">#{entry.rank}</div>
              <div>
                <div className="font-bold text-white">{entry.displayName}</div>
                <div className="text-xs text-white/42">{entry.winRate}% win · {entry.marketsTraded} markets</div>
              </div>
              <div className="text-right font-black text-emerald-300">{formatCurrency(entry.pnl, locale)}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

