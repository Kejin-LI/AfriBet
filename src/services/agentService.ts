import { agentInsights } from '@/mocks/agent';
import type { AgentInsight, Locale } from '@/types/domain';

export interface AgentService {
  getDailyBrief(locale: Locale): Promise<AgentInsight[]>;
  getMarketExplanation(marketId: string, locale: Locale): Promise<AgentInsight>;
  getRiskAlerts(locale: Locale): Promise<AgentInsight[]>;
}

const wait = async () => new Promise((resolve) => window.setTimeout(resolve, 120));

export const mockAgentService: AgentService = {
  async getDailyBrief() {
    await wait();
    return agentInsights.filter((item) => item.type === 'daily-brief');
  },

  async getMarketExplanation(marketId) {
    await wait();
    return (
      agentInsights.find((item) => item.marketId === marketId) ?? {
        id: `explain-${marketId}`,
        type: 'market-explanation',
        marketId,
        confidence: 'medium',
        title: {
          sw: 'Maelezo ya soko',
          en: 'Market explanation',
          zh: '市场解释',
        },
        body: {
          sw: 'Uwezekano huu unaonyesha mabadiliko ya bei, ushiriki, na ishara mpya za umma.',
          en: 'This probability reflects recent price movement, participation, and the latest public signals.',
          zh: '该概率综合了近期价格变化、参与度和最新公开信号。',
        },
      }
    );
  },

  async getRiskAlerts() {
    await wait();
    return agentInsights.filter((item) => item.type === 'risk-alert' || item.type === 'market-mover');
  },
};

export const agentService = mockAgentService;
