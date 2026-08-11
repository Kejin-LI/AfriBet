import type { Leaderboard } from '@/types/domain';

export const leaderboard: Leaderboard = {
  seasonId: 'tanzania-demo-season-1',
  title: {
    sw: 'Msimu wa Majaribio Tanzania 1',
    en: 'Tanzania Demo Season 1',
    zh: '坦桑尼亚模拟赛季 1',
  },
  endsAt: '2026-08-31T23:59:00.000Z',
  entries: [
    { userId: 'u-1', displayName: 'DarSignal', country: 'TZ', rank: 1, pnl: 17680, winRate: 71, marketsTraded: 29 },
    { userId: 'u-2', displayName: 'KariakooEdge', country: 'TZ', rank: 2, pnl: 14920, winRate: 68, marketsTraded: 25 },
    { userId: 'u-3', displayName: 'ArushaQuant', country: 'TZ', rank: 3, pnl: 12140, winRate: 65, marketsTraded: 21 },
    { userId: 'u-4', displayName: 'ZanzibarBrief', country: 'TZ', rank: 4, pnl: 8950, winRate: 60, marketsTraded: 18 },
    { userId: 'demo-user', displayName: 'You', country: 'TZ', rank: 34, pnl: 4380, winRate: 63, marketsTraded: 9 },
    { userId: 'u-6', displayName: 'MwanzaPulse', country: 'TZ', rank: 35, pnl: 4210, winRate: 58, marketsTraded: 12 },
  ],
};

