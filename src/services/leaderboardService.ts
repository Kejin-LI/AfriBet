import { leaderboard } from '@/mocks/leaderboard';
import type { Leaderboard, Locale } from '@/types/domain';

export interface LeaderboardService {
  getSeasonLeaderboard(locale: Locale): Promise<Leaderboard>;
}

export const mockLeaderboardService: LeaderboardService = {
  async getSeasonLeaderboard() {
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    return leaderboard;
  },
};

export const leaderboardService = mockLeaderboardService;

