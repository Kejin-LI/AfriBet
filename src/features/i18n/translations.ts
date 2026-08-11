import type { Locale } from '@/types/domain';

export type TranslationKey =
  | 'app.name'
  | 'app.country'
  | 'nav.home'
  | 'nav.markets'
  | 'nav.agent'
  | 'nav.portfolio'
  | 'nav.leaderboard'
  | 'home.heroTitle'
  | 'home.heroSubtitle'
  | 'home.start'
  | 'home.demoBalance'
  | 'home.todayAgent'
  | 'home.hotMarkets'
  | 'home.categories'
  | 'home.rankPreview'
  | 'markets.title'
  | 'markets.search'
  | 'markets.all'
  | 'markets.football'
  | 'markets.economy'
  | 'markets.crypto'
  | 'markets.entertainment'
  | 'markets.weather'
  | 'markets.politics'
  | 'markets.empty'
  | 'market.agentWhy'
  | 'market.rules'
  | 'market.activity'
  | 'market.buyYes'
  | 'market.buyNo'
  | 'market.volume'
  | 'market.traders'
  | 'market.ends'
  | 'trade.title'
  | 'trade.amount'
  | 'trade.potentialPayout'
  | 'trade.potentialProfit'
  | 'trade.maxLoss'
  | 'trade.confirm'
  | 'trade.demoOnly'
  | 'trade.success'
  | 'portfolio.title'
  | 'portfolio.open'
  | 'portfolio.settled'
  | 'portfolio.winRate'
  | 'portfolio.pnl'
  | 'portfolio.rank'
  | 'portfolio.realDisabled'
  | 'leaderboard.title'
  | 'leaderboard.ends'
  | 'leaderboard.fair'
  | 'agent.title'
  | 'agent.daily'
  | 'agent.movers'
  | 'agent.risks'
  | 'agent.ask'
  | 'common.yes'
  | 'common.no'
  | 'common.view'
  | 'common.loading'
  | 'common.back'
  | 'common.share'
  | 'common.language'
  | 'common.confidence'
  | 'onboarding.title'
  | 'onboarding.body';

export const languageNames: Record<Locale, string> = {
  sw: 'Kiswahili',
  en: 'English',
  zh: '中文',
};

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  sw: {
    'app.name': 'AfriBet',
    'app.country': 'Tanzania',
    'nav.home': 'Zinazovuma',
    'nav.markets': 'Masoko',
    'nav.agent': 'Agent',
    'nav.portfolio': 'Mkoba',
    'nav.leaderboard': 'Bao la Washindi',
    'home.heroTitle': 'Tabiri matukio makubwa yajayo Tanzania',
    'home.heroSubtitle': 'Tumia fedha za majaribio. Jifunze soko kabla ya fedha halisi.',
    'home.start': 'Anza kutabiri',
    'home.demoBalance': 'Salio la Majaribio',
    'home.todayAgent': 'Leo kutoka Agent',
    'home.hotMarkets': 'Masoko Yanayovuma',
    'home.categories': 'Makundi',
    'home.rankPreview': 'Nafasi ya msimu',
    'markets.title': 'Masoko',
    'markets.search': 'Tafuta timu, TZS, wasanii, matukio',
    'markets.all': 'Yote',
    'markets.football': 'Mpira',
    'markets.economy': 'Uchumi',
    'markets.crypto': 'Crypto',
    'markets.entertainment': 'Burudani',
    'markets.weather': 'Hali ya Hewa',
    'markets.politics': 'Siasa',
    'markets.empty': 'Hakuna soko lililopatikana. Jaribu kichujio kingine.',
    'market.agentWhy': 'Kwa nini uwezekano huu?',
    'market.rules': 'Kanuni',
    'market.activity': 'Mienendo',
    'market.buyYes': 'Nunua NDIYO',
    'market.buyNo': 'Nunua HAPANA',
    'market.volume': 'Kiasi',
    'market.traders': 'Washiriki',
    'market.ends': 'Mwisho',
    'trade.title': 'Thibitisha biashara ya majaribio',
    'trade.amount': 'Kiasi',
    'trade.potentialPayout': 'Malipo yanayowezekana',
    'trade.potentialProfit': 'Faida inayowezekana',
    'trade.maxLoss': 'Hasara ya juu',
    'trade.confirm': 'Thibitisha biashara ya majaribio',
    'trade.demoOnly': 'Biashara ya fedha halisi haijawashwa kwenye MVP hii.',
    'trade.success': 'Biashara ya majaribio imethibitishwa',
    'portfolio.title': 'Mkoba',
    'portfolio.open': 'Nafasi zilizo wazi',
    'portfolio.settled': 'Biashara zilizofungwa',
    'portfolio.winRate': 'Kiwango cha ushindi',
    'portfolio.pnl': 'Jumla ya PnL',
    'portfolio.rank': 'Nafasi',
    'portfolio.realDisabled': 'Salio la fedha halisi limehifadhiwa kwa baadaye.',
    'leaderboard.title': 'Bao la Washindi',
    'leaderboard.ends': 'Msimu unaisha',
    'leaderboard.fair': 'Uchezaji wa haki unafuatiliwa',
    'agent.title': 'Muhtasari wa Agent',
    'agent.daily': 'Muhtasari wa siku',
    'agent.movers': 'Masoko yaliyosogea',
    'agent.risks': 'Tahadhari za hatari',
    'agent.ask': 'Uliza kwa nini soko limesogea...',
    'common.yes': 'NDIYO',
    'common.no': 'HAPANA',
    'common.view': 'Tazama',
    'common.loading': 'Inapakia',
    'common.back': 'Rudi',
    'common.share': 'Shiriki',
    'common.language': 'Lugha',
    'common.confidence': 'Uhakika',
    'onboarding.title': 'Masoko ya utabiri kwa sekunde 60',
    'onboarding.body': 'Bei ni uwezekano. Nunua NDIYO au HAPANA kwa fedha za majaribio, kisha jifunze baada ya matokeo.',
  },
  en: {
    'app.name': 'AfriBet',
    'app.country': 'Tanzania',
    'nav.home': 'Trending',
    'nav.markets': 'Markets',
    'nav.agent': 'Agent',
    'nav.portfolio': 'Portfolio',
    'nav.leaderboard': 'Leaderboard',
    'home.heroTitle': "Predict Tanzania's next big moments",
    'home.heroSubtitle': 'Trade with virtual funds. Learn the market before real money.',
    'home.start': 'Start predicting',
    'home.demoBalance': 'Demo Balance',
    'home.todayAgent': 'Today by Agent',
    'home.hotMarkets': 'Hot Markets',
    'home.categories': 'Categories',
    'home.rankPreview': 'Season rank',
    'markets.title': 'Markets',
    'markets.search': 'Search teams, TZS, artists, events',
    'markets.all': 'All',
    'markets.football': 'Football',
    'markets.economy': 'Economy',
    'markets.crypto': 'Crypto',
    'markets.entertainment': 'Entertainment',
    'markets.weather': 'Weather',
    'markets.politics': 'Politics',
    'markets.empty': 'No markets found. Try another filter.',
    'market.agentWhy': 'Why this probability?',
    'market.rules': 'Rules',
    'market.activity': 'Activity',
    'market.buyYes': 'Buy YES',
    'market.buyNo': 'Buy NO',
    'market.volume': 'Volume',
    'market.traders': 'Traders',
    'market.ends': 'Ends',
    'trade.title': 'Confirm demo trade',
    'trade.amount': 'Amount',
    'trade.potentialPayout': 'Potential payout',
    'trade.potentialProfit': 'Potential profit',
    'trade.maxLoss': 'Max loss',
    'trade.confirm': 'Confirm demo trade',
    'trade.demoOnly': 'Real-money trading is not enabled in this MVP.',
    'trade.success': 'Demo trade confirmed',
    'portfolio.title': 'Portfolio',
    'portfolio.open': 'Open positions',
    'portfolio.settled': 'Settled trades',
    'portfolio.winRate': 'Win rate',
    'portfolio.pnl': 'Total PnL',
    'portfolio.rank': 'Rank',
    'portfolio.realDisabled': 'Real balance is reserved for later.',
    'leaderboard.title': 'Leaderboard',
    'leaderboard.ends': 'Season ends',
    'leaderboard.fair': 'Fair play monitored',
    'agent.title': 'Agent Brief',
    'agent.daily': 'Daily brief',
    'agent.movers': 'Market movers',
    'agent.risks': 'Risk alerts',
    'agent.ask': 'Ask why this market moved...',
    'common.yes': 'YES',
    'common.no': 'NO',
    'common.view': 'View',
    'common.loading': 'Loading',
    'common.back': 'Back',
    'common.share': 'Share',
    'common.language': 'Language',
    'common.confidence': 'Confidence',
    'onboarding.title': 'Prediction markets in 60 seconds',
    'onboarding.body': 'A price is a probability. Buy YES or NO with demo funds, then learn from settlement.',
  },
  zh: {
    'app.name': 'AfriBet',
    'app.country': '坦桑尼亚',
    'nav.home': '热门',
    'nav.markets': '市场',
    'nav.agent': 'Agent',
    'nav.portfolio': '持仓',
    'nav.leaderboard': '排行榜',
    'home.heroTitle': '预测坦桑尼亚的下一个关键时刻',
    'home.heroSubtitle': '先用虚拟资金交易，在真钱上线前理解市场。',
    'home.start': '开始预测',
    'home.demoBalance': '虚拟余额',
    'home.todayAgent': 'Agent 今日推荐',
    'home.hotMarkets': '热门市场',
    'home.categories': '分类',
    'home.rankPreview': '赛季排名',
    'markets.title': '市场',
    'markets.search': '搜索球队、先令、艺人、事件',
    'markets.all': '全部',
    'markets.football': '足球',
    'markets.economy': '经济',
    'markets.crypto': '加密',
    'markets.entertainment': '娱乐',
    'markets.weather': '天气',
    'markets.politics': '政治',
    'markets.empty': '没有找到市场，试试其他筛选。',
    'market.agentWhy': '为什么是这个概率？',
    'market.rules': '规则',
    'market.activity': '动态',
    'market.buyYes': '买 是',
    'market.buyNo': '买 否',
    'market.volume': '成交量',
    'market.traders': '交易者',
    'market.ends': '截止',
    'trade.title': '确认模拟交易',
    'trade.amount': '金额',
    'trade.potentialPayout': '潜在回款',
    'trade.potentialProfit': '潜在收益',
    'trade.maxLoss': '最大亏损',
    'trade.confirm': '确认模拟交易',
    'trade.demoOnly': '本 MVP 暂未开放真钱交易。',
    'trade.success': '模拟交易已确认',
    'portfolio.title': '持仓',
    'portfolio.open': '开放持仓',
    'portfolio.settled': '已结算交易',
    'portfolio.winRate': '胜率',
    'portfolio.pnl': '总收益',
    'portfolio.rank': '排名',
    'portfolio.realDisabled': '真实余额为后续版本预留。',
    'leaderboard.title': '排行榜',
    'leaderboard.ends': '赛季结束',
    'leaderboard.fair': '公平竞赛监控中',
    'agent.title': 'Agent 简报',
    'agent.daily': '每日简报',
    'agent.movers': '市场异动',
    'agent.risks': '风险提醒',
    'agent.ask': '询问这个市场为什么变动...',
    'common.yes': '是',
    'common.no': '否',
    'common.view': '查看',
    'common.loading': '加载中',
    'common.back': '返回',
    'common.share': '分享',
    'common.language': '语言',
    'common.confidence': '置信度',
    'onboarding.title': '60 秒理解预测市场',
    'onboarding.body': '价格就是概率。用虚拟资金买 YES 或 NO，再通过结算复盘学习。',
  },
};
