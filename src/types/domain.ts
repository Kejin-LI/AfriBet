export type Locale = 'sw' | 'en' | 'zh';

export type MarketCategory =
  | 'football'
  | 'economy'
  | 'crypto'
  | 'entertainment'
  | 'weather'
  | 'politics';

export type LocalizedText = Record<Locale, string>;

export type RiskTag =
  | 'low-liquidity'
  | 'ambiguous-rules'
  | 'ending-soon'
  | 'high-volatility';

export type MarketStatus = 'open' | 'closed' | 'settled';
export type TradeMode = 'demo' | 'real';
export type OutcomeId = string;

export type Market = {
  id: string;
  category: MarketCategory;
  localizedContent: Record<
    Locale,
    {
      title: string;
      description: string;
      rules: string;
      resolutionSource: string;
    }
  >;
  outcomes: Array<{
    id: OutcomeId;
    label: LocalizedText;
    probability: number;
  }>;
  volume: number;
  traders: number;
  endsAt: string;
  status: MarketStatus;
  mode: 'demo' | 'real-ready';
  agentSummary: LocalizedText;
  riskTags: RiskTag[];
  sparkline: number[];
  change24h: number;
};

export type Position = {
  id: string;
  marketId: string;
  outcomeId: OutcomeId;
  amount: number;
  entryProbability: number;
  currentProbability: number;
  unrealizedPnl: number;
  mode: TradeMode;
  createdAt: string;
};

export type Trade = {
  id: string;
  marketId: string;
  outcomeId: OutcomeId;
  mode: TradeMode;
  amount: number;
  entryProbability: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'failed';
};

export type Portfolio = {
  userId: string;
  demoBalance: number;
  realBalance?: number;
  currency: 'DEMO' | 'TZS' | 'USDC';
  kycStatus?: 'not-started' | 'pending' | 'approved' | 'rejected';
  positions: Position[];
  settledTrades: Trade[];
  totalPnl: number;
  winRate: number;
  rank: number;
};

export type AgentInsightType =
  | 'daily-brief'
  | 'market-mover'
  | 'risk-alert'
  | 'market-explanation';

export type AgentInsight = {
  id: string;
  type: AgentInsightType;
  marketId?: string;
  title: LocalizedText;
  body: LocalizedText;
  confidence: 'low' | 'medium' | 'high';
  riskTags?: RiskTag[];
};

export type Leaderboard = {
  seasonId: string;
  title: LocalizedText;
  endsAt: string;
  entries: LeaderboardEntry[];
};

export type LeaderboardEntry = {
  userId: string;
  displayName: string;
  country: 'TZ';
  rank: number;
  pnl: number;
  winRate: number;
  marketsTraded: number;
};

export type TradePreviewInput = {
  marketId: string;
  outcomeId: OutcomeId;
  amount: number;
  mode: TradeMode;
};

export type TradePreview = {
  marketId: string;
  outcomeId: OutcomeId;
  amount: number;
  entryProbability: number;
  potentialPayout: number;
  potentialProfit: number;
  maxLoss: number;
  mode: TradeMode;
};
