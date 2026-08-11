import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useI18n } from '@/features/i18n/useI18n';
import { formatCurrency } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';
import type { Market, OutcomeId, TradeMode, TradePreview } from '@/types/domain';
import { tradeService } from '@/services/tradeService';
import { cn } from '@/lib/utils';

type TradeModalProps = {
  market: Market;
  outcomeId: OutcomeId;
  mode?: TradeMode;
  onClose: () => void;
};

const quickAmounts = [1000, 5000, 10000];

export function TradeModal({ market, outcomeId, mode = 'demo', onClose }: TradeModalProps) {
  const { locale, t } = useI18n();
  const portfolio = useAppStore((state) => state.portfolio);
  const submitDemoTrade = useAppStore((state) => state.submitDemoTrade);
  const [amount, setAmount] = useState(5000);
  const [preview, setPreview] = useState<TradePreview | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const outcome = market.outcomes.find((item) => item.id === outcomeId)!;
  const insufficient = amount > portfolio.demoBalance;

  useEffect(() => {
    let active = true;
    tradeService.previewTrade({ marketId: market.id, outcomeId, amount, mode }).then((result) => {
      if (active) {
        setPreview(result);
      }
    });
    return () => {
      active = false;
    };
  }, [amount, market.id, mode, outcomeId]);

  const title = useMemo(() => market.localizedContent[locale].title, [locale, market.localizedContent]);

  async function confirmTrade() {
    if (insufficient || status === 'loading') return;
    setStatus('loading');
    await tradeService.submitTrade({ marketId: market.id, outcomeId, amount, mode });
    submitDemoTrade({ marketId: market.id, outcomeId, amount, mode });
    setStatus('success');
    window.setTimeout(onClose, 850);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-3 backdrop-blur-sm sm:items-center">
      <GlassCard variant="strong" className="w-full max-w-lg animate-in">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-100/60">{t('trade.title')}</div>
            <h2 className="text-xl font-black tracking-tight text-white">
              {outcome.label[locale]} · {outcome.probability}%
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-5 text-sm leading-6 text-white/62">{title}</p>

        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/45">{t('trade.amount')}</label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="mb-3 h-14 w-full rounded-2xl border border-white/12 bg-white/[0.07] px-4 text-2xl font-black text-white outline-none transition focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20"
        />

        <div className="mb-5 grid grid-cols-4 gap-2">
          {quickAmounts.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAmount(item)}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10"
            >
              {formatCurrency(item, locale)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount(portfolio.demoBalance)}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10"
          >
            Max
          </button>
        </div>

        <div className="mb-5 grid gap-3 rounded-3xl border border-white/10 bg-black/14 p-4">
          <Metric label={t('trade.potentialPayout')} value={formatCurrency(preview?.potentialPayout ?? 0, locale)} />
          <Metric label={t('trade.potentialProfit')} value={formatCurrency(preview?.potentialProfit ?? 0, locale)} tone="good" />
          <Metric label={t('trade.maxLoss')} value={formatCurrency(preview?.maxLoss ?? 0, locale)} tone="bad" />
        </div>

        <p className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs leading-5 text-amber-100/80">
          {t('trade.demoOnly')}
        </p>

        <button
          type="button"
          disabled={insufficient || status === 'loading'}
          onClick={confirmTrade}
          className={cn(
            'h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-500 font-black text-[#071018] shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45',
            status === 'success' && 'from-emerald-300 to-cyan-300',
          )}
        >
          {status === 'success' ? t('trade.success') : t('trade.confirm')}
        </button>
      </GlassCard>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'bad' }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-white/48">{label}</span>
      <span className={cn('font-black text-white', tone === 'good' && 'text-emerald-300', tone === 'bad' && 'text-rose-300')}>
        {value}
      </span>
    </div>
  );
}

