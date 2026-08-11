# 非洲版 Polymarket Web MVP 页面设计

## 1. 项目约束

### 1.1 产品定位

第一版是面向坦桑尼亚用户的本地事件预测平台：

- 虚拟资金模拟交易。
- 本地事件预测。
- 排行榜竞赛。
- Agent 市场解释。
- 多语言一键切换。
- 数据先使用 Mock，但代码结构必须兼容后续真实后端。

第一版不做真钱交易，但 UI 和数据模型要预留真钱模式能力，避免后续重构交易、余额、KYC、支付入口。

### 1.2 首发市场

- 国家：Tanzania。
- 默认语言：Swahili。
- 第一版语言：Swahili、English、中文。
- 第一版资金：虚拟资金。
- 后续兼容：真实后端、真钱余额、KYC、支付、钱包、交易 API。

## 2. 视觉方向

### 2.1 风格定义

推荐风格：`Premium Glass Trading Companion`。

核心气质：

- Apple 风格的高级毛玻璃。
- 金融交易产品的可信与克制。
- Agent 产品的智能解释感。
- 坦桑尼亚本地事件内容的鲜活度。

避免方向：

- 不做博彩 App 的强刺激红绿 UI。
- 不大面积堆非洲刻板元素。
- 不使用廉价霓虹、金币、赌场筹码风格。
- 不把页面塞满行情信息，MVP 要优先降低理解成本。

### 2.2 色彩系统

```text
--bg-page: #070A12;
--bg-surface: rgba(255, 255, 255, 0.08);
--bg-surface-strong: rgba(255, 255, 255, 0.12);
--border-glass: rgba(255, 255, 255, 0.14);
--text-primary: #F8FAFC;
--text-secondary: #AAB4C8;
--text-muted: #6F7A91;
--primary: #7C5CFF;
--primary-soft: rgba(124, 92, 255, 0.18);
--cyan: #22D3EE;
--cyan-soft: rgba(34, 211, 238, 0.16);
--success: #3DDC97;
--danger: #FF5C7A;
--warning: #FBBF24;
--tanzania-green: #20C997;
--sand-gold: #D6A84F;
```

使用原则：

- 蓝紫作为主色，表达智能与高级感。
- 青蓝用于实时数据、Agent、市场变化。
- 绿色用于 Tanzania 本地身份和盈利状态，但不要过度博彩化。
- 金色只用于排行榜、奖励、Top 3。
- 红色只用于亏损、风险、错误状态。

### 2.3 字体与排版

字体建议：

- 英文：Inter / SF Pro Display fallback。
- 中文：PingFang SC / Noto Sans SC。
- Swahili：Inter 可覆盖拉丁扩展字符。

字号：

```text
Display: 40 / 48, weight 700
H1: 32 / 40, weight 700
H2: 24 / 32, weight 700
H3: 20 / 28, weight 650
Body: 16 / 24, weight 400
Body Small: 14 / 20, weight 400
Caption: 12 / 16, weight 500
Metric: 36 / 40, weight 750
```

设计注意：

- Swahili 和英文长度接近，但中文更短。组件不能按中文长度设计。
- 所有按钮至少支持 1.5 倍英文长度。
- 市场标题最多显示 2 行，详情页完整展示。

### 2.4 圆角、阴影、毛玻璃

```text
radius-xs: 8px
radius-sm: 12px
radius-md: 18px
radius-lg: 24px
radius-xl: 32px
blur-glass: 24px
shadow-card: 0 20px 60px rgba(0, 0, 0, 0.35)
shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.22)
```

卡片标准：

```css
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.14);
backdrop-filter: blur(24px);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
border-radius: 24px;
```

## 3. 信息架构

### 3.1 顶层导航

移动端底部 Tab：

- Home
- Markets
- Agent
- Portfolio
- Leaderboard

顶部通用区：

- Logo / 平台名。
- Tanzania 标签。
- 虚拟资金余额。
- 语言切换按钮。
- 用户入口。

桌面端：

- 左侧导航栏。
- 中间主内容。
- 右侧显示 Agent Summary / Leaderboard / Portfolio Snapshot。

### 3.2 页面清单

MVP 页面：

1. Home：首页。
2. Markets：市场列表。
3. Market Detail：市场详情。
4. Trade Modal：交易确认弹窗。
5. Portfolio：持仓。
6. Leaderboard：排行榜。
7. Agent：Agent 助手。
8. Language Switcher：语言切换面板。
9. Onboarding：新手引导。

后台页面不进入第一版 Web 用户端，但数据结构要预留市场管理字段。

## 4. 页面设计

### 4.1 Home

目标：让用户 10 秒内理解“今天可以预测什么、我有多少钱、Agent 推荐什么”。

模块：

- Hero Glass Card
  - 标题：`Predict Tanzania's next big moments`
  - 副标题：`Trade with virtual funds. Learn the market before real money.`
  - CTA：`Start predicting`
  - 余额：`100,000 Demo Cash`

- Today by Agent
  - 3 个 Agent 推荐市场。
  - 每条包含：市场标题、当前概率、变化原因、风险标签。

- Hot Markets
  - 3-5 张市场卡。
  - 优先足球、汇率、娱乐。

- Categories
  - Football、Economy、Crypto、Entertainment、Weather。

- Leaderboard Preview
  - 展示 Top 3 和用户当前排名。

核心交互：

- 点击市场卡进入 Market Detail。
- 点击 `Why this moved?` 打开 Agent 解释。
- 点击语言按钮弹出 Language Switcher。

### 4.2 Markets

目标：提供可浏览、可筛选的市场入口。

模块：

- Search Bar：搜索球队、汇率、艺人、事件。
- Category Tabs：All / Football / Economy / Crypto / Entertainment / Weather。
- Filter Chips：Ending soon / High volume / Agent picked / Low risk。
- Market Card List。

Market Card 结构：

```text
[Category] [Ends in 2d]
Will USD/TZS close above 2,700 this Friday?

YES 64%    NO 36%
Volume 42K Demo Cash · 1.2K traders

Agent: Naira weakened after oil price news.
```

状态：

- Loading：玻璃骨架屏。
- Empty：推荐切换分类或清空搜索。
- Error：展示重试按钮，不展示技术错误。

### 4.3 Market Detail

目标：帮助用户理解市场、判断风险并完成模拟交易。

页面结构：

- Header
  - 返回按钮。
  - 分类标签。
  - 分享按钮。

- Market Title
  - 完整问题。
  - 截止时间。
  - 结算来源。

- Probability Panel
  - YES 大概率数字。
  - NO 概率。
  - 24h change。
  - 简化历史曲线。

- Trade Action
  - `Buy YES`
  - `Buy NO`
  - 第一版显示 `Demo trading` 标签。

- Agent Explanation
  - `Why is YES at 64%?`
  - 3 条原因。
  - 1 条风险提示。

- Rules
  - 结算规则。
  - 数据来源。
  - 争议说明。

- Activity
  - 最新模拟成交。
  - 价格变化。

真钱兼容：

- 当前显示 Demo Balance。
- 数据模型预留 Real Balance、KYC Status、Payment Status。
- 交易按钮组件保留 `mode = demo | real`。

### 4.4 Trade Modal

目标：低认知完成一次预测。

结构：

```text
Buy YES
Will Tanzania win the next Simba/Yanga derby match?

Current probability: 58%
Your demo balance: 100,000

Amount input
[1,000] [5,000] [10,000] [Max]

If YES wins:
Potential payout: 17,240
Potential profit: 7,240

[Confirm demo trade]
```

设计规则：

- 明确标注 `Demo trade`，避免用户误以为真钱。
- 金额输入保留货币适配能力。
- 确认前展示最大收益、最大亏损、结算时间。
- 成功后显示轻量动效和 `View position`。

错误状态：

- 余额不足。
- 市场已关闭。
- 网络失败。
- 价格已变化，需重新确认。

### 4.5 Portfolio

目标：展示用户资产、持仓和复盘。

模块：

- Balance Card
  - Demo Cash。
  - Total PnL。
  - Win rate。
  - Rank。

- Open Positions
  - 市场标题。
  - YES/NO。
  - 入场概率。
  - 当前概率。
  - 浮动盈亏。

- Settled
  - 已结算预测。
  - 盈亏。
  - 结果。

- Learning Insight
  - Agent 总结：`You perform better in football markets than FX markets.`

真钱兼容：

- 资产区预留 `Demo` / `Real` 切换。
- 真实模式下增加 Deposit、Withdraw、KYC 提示。

### 4.6 Leaderboard

目标：驱动模拟交易留存和传播。

模块：

- Season Header
  - `Tanzania Demo Season 1`
  - 奖励说明。
  - 剩余时间。

- My Rank
  - 当前排名。
  - PnL。
  - 胜率。
  - 参与市场数。

- Ranking List
  - Top 100。
  - Top 3 使用金色层级，但保持克制。

- Share CTA
  - 生成排名分享卡。

反作弊提示：

- 展示 `Fair play monitored`。
- 规则入口：禁止多账号、刷榜、串通。

### 4.7 Agent

目标：把产品差异化从“预测网站”拉到“智能事件交易助手”。

模块：

- Daily Brief
  - 今日 5 个值得关注市场。
  - 每个市场一句原因。

- Market Movers
  - 概率变动最大的市场。
  - 变动解释。

- Risk Alerts
  - 低流动性。
  - 规则模糊。
  - 临近截止。
  - 新闻来源不足。

- Ask Agent
  - 输入框：`Ask why this market moved...`
  - 第一版可以 Mock 固定回答。

Agent 文案原则：

- 给解释，不给直接投资建议。
- 用 `This market moved because...`，避免 `You should buy...`。
- 对低置信度内容明确标注。

### 4.8 Language Switcher

目标：任意页面一键切换语言，不丢状态。

语言：

- Swahili，默认。
- English。
- 中文。

交互：

- 顶部按钮显示当前语言。
- 点击后打开玻璃面板。
- 切换后保留当前页面、市场、交易输入、登录态。
- URL 推荐：`/sw`、`/en`、`/zh`。

技术规则：

- UI 文案全部使用 i18n key。
- 市场内容支持 `localizedContent`。
- Agent 请求必须携带 `locale`。

## 5. 核心组件

### 5.1 AppShell

负责：

- 背景渐变。
- 顶部栏。
- 底部 Tab。
- 桌面布局。
- 语言状态。
- Demo/Real 模式状态。

### 5.2 GlassCard

基础玻璃卡片组件。

Props：

```ts
type GlassCardProps = {
  variant?: 'default' | 'strong' | 'agent' | 'warning';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
};
```

### 5.3 MarketCard

Props：

```ts
type MarketCardProps = {
  market: Market;
  locale: Locale;
  onOpen: (marketId: string) => void;
};
```

展示：

- 标题。
- 分类。
- YES/NO 概率。
- 成交量。
- 截止时间。
- Agent 摘要。

### 5.4 ProbabilityPill

显示 YES/NO 概率，支持上涨/下跌状态。

### 5.5 TradeButton

统一处理 Demo/Real 模式。

```ts
type TradeMode = 'demo' | 'real';
```

第一版只启用 demo，但保留 real 参数。

### 5.6 AgentInsightCard

展示 Agent 解释、风险、推荐。

状态：

- loading。
- ready。
- lowConfidence。
- error。

### 5.7 LanguageToggle

负责语言切换，不直接写业务逻辑。

## 6. 数据模型

### 6.1 Market

```ts
type Locale = 'sw' | 'en' | 'zh';

type Market = {
  id: string;
  category: 'football' | 'economy' | 'crypto' | 'entertainment' | 'weather';
  localizedContent: Record<Locale, {
    title: string;
    description: string;
    rules: string;
    resolutionSource: string;
  }>;
  outcomes: Array<{
    id: 'yes' | 'no';
    label: Record<Locale, string>;
    probability: number;
  }>;
  volume: number;
  traders: number;
  endsAt: string;
  status: 'open' | 'closed' | 'settled';
  mode: 'demo' | 'real-ready';
  agentSummary: Record<Locale, string>;
  riskTags: Array<'low-liquidity' | 'ambiguous-rules' | 'ending-soon' | 'high-volatility'>;
};
```

### 6.2 Portfolio

```ts
type Portfolio = {
  userId: string;
  demoBalance: number;
  realBalance?: number;
  currency: 'DEMO' | 'TZS' | 'USDC';
  kycStatus?: 'not-started' | 'pending' | 'approved' | 'rejected';
  positions: Position[];
};
```

### 6.3 Trade

```ts
type Trade = {
  id: string;
  marketId: string;
  outcomeId: 'yes' | 'no';
  mode: 'demo' | 'real';
  amount: number;
  entryProbability: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'failed';
};
```

## 7. Mock 与真实后端兼容策略

第一版必须把 Mock 数据隔离在 service 层，UI 组件不能直接 import mock JSON。

推荐结构：

```text
src/
  app/
  components/
  features/
    markets/
    portfolio/
    agent/
    leaderboard/
    i18n/
  services/
    marketService.ts
    portfolioService.ts
    agentService.ts
    tradeService.ts
  mocks/
    markets.ts
    portfolio.ts
    leaderboard.ts
```

Service 约定：

```ts
interface MarketService {
  listMarkets(params: ListMarketParams): Promise<Market[]>;
  getMarket(id: string): Promise<Market>;
}

interface TradeService {
  previewTrade(input: TradePreviewInput): Promise<TradePreview>;
  submitTrade(input: SubmitTradeInput): Promise<Trade>;
}
```

第一版实现：

- `mockMarketService`
- `mockTradeService`
- `mockPortfolioService`
- `mockAgentService`

后续接后端：

- 替换为 `apiMarketService`
- UI 不改。
- 数据模型不变或只做适配器转换。

## 8. 多语言实现要求

第一版语言：

```ts
type Locale = 'sw' | 'en' | 'zh';
const DEFAULT_LOCALE = 'sw';
```

推荐文案文件：

```text
locales/
  en/common.json
  en/home.json
  en/market.json
  en/trade.json
  sw/...
  zh/...
```

规则：

- 禁止组件硬编码展示文案。
- 市场内容与 UI 文案分开。
- Agent 文案按 locale 返回。
- 切换语言不清空 Trade Modal 输入。
- 新增页面必须同步新增三种语言 key。

## 9. 交互与动效

推荐动效：

- 卡片 hover：轻微上浮或 `scale(1.01)`。
- 按钮 press：`scale(0.98)`。
- 概率变化：数字平滑滚动。
- Agent 分析：玻璃 shimmer。
- 交易成功：轻量光晕 + 成功提示。

避免：

- 强闪烁。
- 赌场式金币雨。
- 大面积红绿跳动。
- 过度复杂图表。

## 10. 状态设计

### 10.1 Loading

- 页面级：玻璃骨架屏。
- Agent：`Analyzing market signals...`
- 交易：按钮 loading，并锁定重复提交。

### 10.2 Empty

- Markets 无结果：建议切换分类或清空搜索。
- Portfolio 无持仓：推荐 3 个新手市场。
- Leaderboard 无数据：提示赛季即将开始。

### 10.3 Error

- 网络失败：展示重试。
- 市场关闭：禁用交易按钮，显示原因。
- 价格变化：要求用户重新确认。
- 多语言资源缺失：fallback 到英文。

## 11. 可访问性

- 文本对比度满足 WCAG AA。
- 所有交互元素支持键盘 focus。
- 不只依赖颜色表达涨跌，要同时使用箭头或文字。
- Trade Modal 支持 Esc 关闭和焦点陷阱。
- 语言切换按钮必须有明确 aria-label。
- 图表必须有文本摘要。

## 12. MVP 验收标准

页面验收：

- Home、Markets、Market Detail、Trade Modal、Portfolio、Leaderboard、Agent、Language Switcher 可完整点击。
- 默认斯瓦希里语。
- 可切换 English / Swahili / 中文。
- 语言切换不丢当前页面状态。
- 用户可完成一次虚拟资金交易。
- Portfolio 能看到持仓变化。
- Leaderboard 能展示模拟排名。
- Agent 能展示市场解释、异动、风险。

技术验收：

- UI 不直接依赖 mock 文件。
- 数据访问全部经过 service 层。
- 交易组件支持 `demo` / `real` 模式参数。
- 余额模型支持 `demoBalance` 和未来 `realBalance`。
- 所有 UI 文案使用 i18n key。
- 市场内容支持 locale。
- 组件在移动端 375px 宽度下可用。
- 桌面端 1440px 下布局不空散。

## 13. 建议开发顺序

1. 建立项目骨架、主题变量、i18n、Mock service。
2. 实现 AppShell、GlassCard、LanguageToggle。
3. 实现 Home 和 Markets。
4. 实现 Market Detail 和 Trade Modal。
5. 实现 Portfolio。
6. 实现 Leaderboard。
7. 实现 Agent 页面。
8. 补齐 loading、empty、error、响应式和可访问性。
