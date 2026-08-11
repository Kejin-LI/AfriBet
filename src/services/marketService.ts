import { markets } from '@/mocks/markets';
import type { Locale, Market, MarketCategory } from '@/types/domain';

export type ListMarketParams = {
  locale: Locale;
  category?: MarketCategory | 'all';
  query?: string;
  filter?: 'ending-soon' | 'high-volume' | 'agent-picked' | 'low-risk';
};

export interface MarketService {
  listMarkets(params: ListMarketParams): Promise<Market[]>;
  getMarket(id: string, locale: Locale): Promise<Market>;
}

const wait = async () => new Promise((resolve) => window.setTimeout(resolve, 120));

export const mockMarketService: MarketService = {
  async listMarkets(params) {
    await wait();
    const query = params.query?.trim().toLowerCase();
    return markets.filter((market) => {
      const matchesCategory = !params.category || params.category === 'all' || market.category === params.category;
      const text = market.localizedContent[params.locale].title.toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesFilter =
        !params.filter ||
        (params.filter === 'high-volume' && market.volume >= 80000) ||
        (params.filter === 'ending-soon' && market.riskTags.includes('ending-soon')) ||
        (params.filter === 'low-risk' && market.riskTags.length === 0) ||
        (params.filter === 'agent-picked' && market.agentSummary[params.locale].length > 0);
      return matchesCategory && matchesQuery && matchesFilter;
    });
  },

  async getMarket(id) {
    await wait();
    const market = markets.find((item) => item.id === id);
    if (!market) {
      throw new Error('Market not found');
    }
    return market;
  },
};

export const marketService = mockMarketService;

