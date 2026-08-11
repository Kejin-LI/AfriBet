import type { Portfolio } from '@/types/domain';

export const portfolio: Portfolio = {
  userId: 'demo-user',
  demoBalance: 100000,
  realBalance: 0,
  currency: 'DEMO',
  kycStatus: 'not-started',
  totalPnl: 4210,
  winRate: 64,
  rank: 34,
  positions: [
    {
      id: 'pos-1',
      marketId: 'yanga-win-derby',
      outcomeId: 'yes',
      amount: 8000,
      entryProbability: 53,
      currentProbability: 58,
      unrealizedPnl: 1185,
      mode: 'demo',
      createdAt: '2026-08-10T09:30:00.000Z',
    },
    {
      id: 'pos-2',
      marketId: 'usd-tzs-2700',
      outcomeId: 'yes',
      amount: 5000,
      entryProbability: 50,
      currentProbability: 52,
      unrealizedPnl: 294,
      mode: 'demo',
      createdAt: '2026-08-10T15:45:00.000Z',
    },
  ],
  settledTrades: [],
};
