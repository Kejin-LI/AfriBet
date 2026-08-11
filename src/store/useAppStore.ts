import { create } from 'zustand';
import { portfolio as initialPortfolio } from '@/mocks/portfolio';
import { markets } from '@/mocks/markets';
import type { Locale, OutcomeId, Portfolio, TradeMode } from '@/types/domain';

type AppState = {
  locale: Locale;
  portfolio: Portfolio;
  setLocale: (locale: Locale) => void;
  submitDemoTrade: (input: {
    marketId: string;
    outcomeId: OutcomeId;
    amount: number;
    mode: TradeMode;
  }) => void;
};

const storedLocale = localStorage.getItem('locale') as Locale | null;
const validLocales: Locale[] = ['sw', 'en', 'zh'];

function getOutcomeProbability(marketId: string, outcomeId: OutcomeId) {
  return markets
    .find((market) => market.id === marketId)
    ?.outcomes.find((outcome) => outcome.id === outcomeId)?.probability ?? 50;
}

export const useAppStore = create<AppState>((set) => ({
  locale: storedLocale && validLocales.includes(storedLocale) ? storedLocale : 'sw',
  portfolio: initialPortfolio,

  setLocale(locale) {
    localStorage.setItem('locale', locale);
    set({ locale });
  },

  submitDemoTrade(input) {
    set((state) => {
      const probability = getOutcomeProbability(input.marketId, input.outcomeId);
      const position = {
        id: `pos-${Date.now()}`,
        marketId: input.marketId,
        outcomeId: input.outcomeId,
        amount: input.amount,
        entryProbability: probability,
        currentProbability: probability,
        unrealizedPnl: 0,
        mode: input.mode,
        createdAt: new Date().toISOString(),
      };

      return {
        portfolio: {
          ...state.portfolio,
          demoBalance: Math.max(0, state.portfolio.demoBalance - input.amount),
          positions: [position, ...state.portfolio.positions],
        },
      };
    });
  },
}));
