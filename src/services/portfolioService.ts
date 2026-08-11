import { portfolio } from '@/mocks/portfolio';
import type { Locale, Portfolio } from '@/types/domain';

export interface PortfolioService {
  getPortfolio(userId: string, locale: Locale): Promise<Portfolio>;
}

export const mockPortfolioService: PortfolioService = {
  async getPortfolio() {
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    return portfolio;
  },
};

export const portfolioService = mockPortfolioService;

