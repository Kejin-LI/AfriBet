import { markets } from '@/mocks/markets';
import type { OutcomeId, Trade, TradePreview, TradePreviewInput } from '@/types/domain';

export interface TradeService {
  previewTrade(input: TradePreviewInput): Promise<TradePreview>;
  submitTrade(input: TradePreviewInput): Promise<Trade>;
}

const wait = async () => new Promise((resolve) => window.setTimeout(resolve, 140));

function getProbability(marketId: string, outcomeId: OutcomeId) {
  const market = markets.find((item) => item.id === marketId);
  const outcome = market?.outcomes.find((item) => item.id === outcomeId);
  if (!outcome) {
    throw new Error('Outcome not found');
  }
  return outcome.probability;
}

export const mockTradeService: TradeService = {
  async previewTrade(input) {
    await wait();
    const probability = getProbability(input.marketId, input.outcomeId);
    const decimalPrice = Math.max(probability / 100, 0.01);
    const potentialPayout = Math.round(input.amount / decimalPrice);
    return {
      ...input,
      entryProbability: probability,
      potentialPayout,
      potentialProfit: potentialPayout - input.amount,
      maxLoss: input.amount,
    };
  },

  async submitTrade(input) {
    await wait();
    return {
      id: `trade-${Date.now()}`,
      ...input,
      entryProbability: getProbability(input.marketId, input.outcomeId),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };
  },
};

export const tradeService = mockTradeService;
