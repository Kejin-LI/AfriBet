import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Flame, Link2, MessageCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProbabilityChart } from '@/components/ProbabilityChart';
import { Sparkline } from '@/components/Sparkline';
import { useI18n } from '@/features/i18n/useI18n';
import { formatCompactNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { marketService } from '@/services/marketService';
import type { Locale, Market, OutcomeId } from '@/types/domain';

const pageCopy: Record<
  Locale,
  {
    featured: string;
    hotRank: string;
    topMarkets: string;
    volume: string;
    traders: string;
    heat: string;
    comments: string;
    explore: string;
    ends: string;
    tradeVolume: string;
  }
> = {
  sw: {
    featured: 'Soko kuu',
    hotRank: 'Mada moto',
    topMarkets: 'Masoko yote moto',
    volume: 'Kiasi',
    traders: 'Washiriki',
    heat: 'Joto',
    comments: 'Majadiliano',
    explore: 'Yote',
    ends: 'Mwisho',
    tradeVolume: 'Kiasi',
  },
  en: {
    featured: 'Featured market',
    hotRank: 'Hot topics',
    topMarkets: 'All hot markets',
    volume: 'Volume',
    traders: 'Traders',
    heat: 'Heat',
    comments: 'Discussion',
    explore: 'All',
    ends: 'Ends',
    tradeVolume: 'Volume',
  },
  zh: {
    featured: '精选市场',
    hotRank: '热门话题',
    topMarkets: '所有热门市场',
    volume: '成交量',
    traders: '交易者',
    heat: '热度',
    comments: '讨论',
    explore: '全部',
    ends: '截止',
    tradeVolume: '交易量',
  },
};

type MarketComment = {
  id: string;
  author: string;
  avatar: string;
  createdAt: string;
  body: Record<Locale, string>;
};

const marketComments: Record<string, MarketComment[]> = {
  'yanga-win-derby': [
    {
      id: 'yanga-1',
      author: 'DarSignal',
      avatar: 'DS',
      createdAt: '2026-08-11T12:35:00.000Z',
      body: {
        sw: 'Yanga iko juu, lakini derby huwa na mshangao.',
        en: 'Yanga looks stronger, but derby matches rarely stay predictable.',
        zh: 'Yanga 近期更强，但德比很难完全按状态判断。',
      },
    },
    {
      id: 'yanga-2',
      author: 'Mikocheni Odds',
      avatar: 'MO',
      createdAt: '2026-08-11T08:20:00.000Z',
      body: {
        sw: 'Simba ikitangaza kikosi kamili, bei inaweza kurudi chini.',
        en: 'If Simba confirms a full squad, this price can cool down fast.',
        zh: '如果 Simba 公布完整阵容，价格可能很快回落。',
      },
    },
    {
      id: 'yanga-3',
      author: 'Azam Watcher',
      avatar: 'AW',
      createdAt: '2026-08-08T18:20:00.000Z',
      body: {
        sw: 'Mashabiki wanaongeza volume, si taarifa zote ni signal.',
        en: 'Fan momentum is adding volume, but not every rumor is signal.',
        zh: '球迷情绪推高了成交量，但不是每条传闻都是有效信号。',
      },
    },
    {
      id: 'yanga-4',
      author: 'CoastQuant',
      avatar: 'CQ',
      createdAt: '2026-07-30T10:30:00.000Z',
      body: {
        sw: 'Derby za mwisho zilikuwa karibu kuliko bei ya sasa inavyoonyesha.',
        en: 'Recent derbies were closer than the current price suggests.',
        zh: '最近几场德比比当前价格暗示的更接近。',
      },
    },
  ],
  'usd-tzs-2700': [
    {
      id: 'tzs-1',
      author: 'FX Dar',
      avatar: 'FX',
      createdAt: '2026-08-11T11:10:00.000Z',
      body: {
        sw: 'Waagizaji bado wanasukuma mahitaji ya dola.',
        en: 'Import demand is still keeping dollar pressure alive.',
        zh: '进口需求还在支撑美元压力。',
      },
    },
    {
      id: 'tzs-2',
      author: 'Shilling Desk',
      avatar: 'SD',
      createdAt: '2026-08-10T22:00:00.000Z',
      body: {
        sw: 'BOT ikiingilia, soko linaweza kubadilika haraka.',
        en: 'A Bank of Tanzania signal could flip this market quickly.',
        zh: '如果坦桑尼亚央行释放信号，这个市场会很快反转。',
      },
    },
    {
      id: 'tzs-3',
      author: 'Kariakoo Macro',
      avatar: 'KM',
      createdAt: '2026-08-06T09:00:00.000Z',
      body: {
        sw: 'Mahitaji ya mafuta yanaweza kuweka shinikizo hadi wiki ijayo.',
        en: 'Fuel demand can keep pressure elevated into next week.',
        zh: '燃油需求可能让汇率压力延续到下周。',
      },
    },
    {
      id: 'tzs-4',
      author: 'TZ Flow',
      avatar: 'TF',
      createdAt: '2026-07-28T15:45:00.000Z',
      body: {
        sw: 'Liquidity ni nyembamba, order chache zinaweza kusogeza bei.',
        en: 'Liquidity is thin, so a few orders can move the price.',
        zh: '流动性偏薄，少量订单就可能推动价格。',
      },
    },
  ],
  'dar-rainfall-weekend': [
    {
      id: 'rain-1',
      author: 'Dar Radar',
      avatar: 'DR',
      createdAt: '2026-08-11T13:05:00.000Z',
      body: {
        sw: 'Ramani za mvua zinaonyesha Dar inaweza kupata mvua nzito.',
        en: 'Rain maps keep pointing to a wet Dar weekend.',
        zh: '降雨图继续指向达累斯萨拉姆湿润周末。',
      },
    },
    {
      id: 'rain-2',
      author: 'Pwani Weather',
      avatar: 'PW',
      createdAt: '2026-08-10T17:30:00.000Z',
      body: {
        sw: 'Hali ya hewa ya pwani hubadilika haraka, kuwa makini.',
        en: 'Coastal weather changes fast, so this still carries risk.',
        zh: '沿海天气变化很快，这个市场仍有风险。',
      },
    },
    {
      id: 'rain-3',
      author: 'Zanzibar Sky',
      avatar: 'ZS',
      createdAt: '2026-08-07T07:15:00.000Z',
      body: {
        sw: 'Mifumo ya upepo inaweza kusukuma mvua kuelekea kaskazini.',
        en: 'Wind patterns could push the rain band north.',
        zh: '风场可能把雨带推向北侧。',
      },
    },
    {
      id: 'rain-4',
      author: 'Meteo Desk',
      avatar: 'MD',
      createdAt: '2026-07-25T12:00:00.000Z',
      body: {
        sw: 'Modeli za wiki iliyopita zilipinduka ndani ya saa 24.',
        en: 'Last week’s model flipped within 24 hours.',
        zh: '上周模型曾在 24 小时内快速反转。',
      },
    },
  ],
  'diamond-platnumz-collab': [
    {
      id: 'diamond-1',
      author: 'Bongo Pulse',
      avatar: 'BP',
      createdAt: '2026-08-11T10:15:00.000Z',
      body: {
        sw: 'Tetesi za collab zinapanda TikTok na Instagram.',
        en: 'Collab rumors are spreading across TikTok and Instagram.',
        zh: '合作传闻正在 TikTok 和 Instagram 发酵。',
      },
    },
    {
      id: 'diamond-2',
      author: 'Wasafi Watch',
      avatar: 'WW',
      createdAt: '2026-08-09T19:20:00.000Z',
      body: {
        sw: 'Bado hakuna tangazo rasmi, kwa hiyo soko lina kelele nyingi.',
        en: 'No official signal yet, so this is mostly attention-driven.',
        zh: '还没有官方信号，目前更多是注意力驱动。',
      },
    },
    {
      id: 'diamond-3',
      author: 'Music Alpha',
      avatar: 'MA',
      createdAt: '2026-08-05T14:40:00.000Z',
      body: {
        sw: 'Playlist leaks zinaongeza imani, lakini source si thabiti.',
        en: 'Playlist leaks add confidence, but the source is weak.',
        zh: '歌单泄露增加了信心，但来源并不稳定。',
      },
    },
    {
      id: 'diamond-4',
      author: 'Dar Culture',
      avatar: 'DC',
      createdAt: '2026-07-20T09:10:00.000Z',
      body: {
        sw: 'Diamond mara nyingi hutumia teaser kabla ya tangazo kubwa.',
        en: 'Diamond often teases before a major announcement.',
        zh: 'Diamond 通常会在重大官宣前先放预热信号。',
      },
    },
  ],
  'btc-75k-august': [
    {
      id: 'btc-1',
      author: 'Crypto Dar',
      avatar: 'CD',
      createdAt: '2026-08-11T12:00:00.000Z',
      body: {
        sw: 'BTC inavutia tena, lakini volatility iko juu.',
        en: 'BTC momentum is back, but volatility is still elevated.',
        zh: 'BTC 动能回来了，但波动仍然很高。',
      },
    },
    {
      id: 'btc-2',
      author: 'Chain Desk',
      avatar: 'CH',
      createdAt: '2026-08-10T14:30:00.000Z',
      body: {
        sw: 'Wafanyabiashara wengi wanasubiri kuvuka 72K kwanza.',
        en: 'A lot of traders want to see $72K break first.',
        zh: '很多交易者想先看到 72K 被突破。',
      },
    },
    {
      id: 'btc-3',
      author: 'Macro Blocks',
      avatar: 'MB',
      createdAt: '2026-08-04T16:05:00.000Z',
      body: {
        sw: 'ETF flows bado ni signal muhimu kuliko tweets.',
        en: 'ETF flows still matter more than tweets here.',
        zh: 'ETF 资金流在这里仍比社媒消息更关键。',
      },
    },
    {
      id: 'btc-4',
      author: 'Onchain TZ',
      avatar: 'OT',
      createdAt: '2026-07-18T11:45:00.000Z',
      body: {
        sw: 'Open interest iko juu, liquidations zinaweza kuongeza mwendo.',
        en: 'Open interest is high, so liquidations can accelerate moves.',
        zh: '未平仓合约较高，清算可能放大走势。',
      },
    },
  ],
  'fuel-price-rise-august': [
    {
      id: 'fuel-1',
      author: 'Energy Desk',
      avatar: 'ED',
      createdAt: '2026-08-11T13:20:00.000Z',
      body: {
        sw: 'Bei za mafuta duniani bado zinaweka presha kwenye soko la ndani.',
        en: 'Global fuel prices are still putting pressure on local pricing.',
        zh: '国际燃油价格仍在给本地价格带来压力。',
      },
    },
    {
      id: 'fuel-2',
      author: 'Transport TZ',
      avatar: 'TT',
      createdAt: '2026-08-10T18:10:00.000Z',
      body: {
        sw: 'Daladala na logistics zinaweza kuanza kuonyesha impact mapema.',
        en: 'Transport and logistics costs may show impact early.',
        zh: '公共交通和物流成本可能会更早体现影响。',
      },
    },
    {
      id: 'fuel-3',
      author: 'Macro Coast',
      avatar: 'MC',
      createdAt: '2026-08-06T11:30:00.000Z',
      body: {
        sw: 'Soko lina-price in ongezeko, lakini tangazo rasmi ndilo muhimu.',
        en: 'The market is pricing a rise, but the official notice is what matters.',
        zh: '市场已在计入上涨，但关键还是官方公告。',
      },
    },
  ],
  'taifa-stars-afcon-qualify': [
    {
      id: 'taifa-1',
      author: 'Goal Dar',
      avatar: 'GD',
      createdAt: '2026-08-11T09:40:00.000Z',
      body: {
        sw: 'Mechi za nyumbani zinaweza kubadilisha odds haraka sana.',
        en: 'Home fixtures can change these odds very quickly.',
        zh: '主场赛程可能会很快改变赔率。',
      },
    },
    {
      id: 'taifa-2',
      author: 'CAF Watch',
      avatar: 'CW',
      createdAt: '2026-08-09T16:25:00.000Z',
      body: {
        sw: 'Kundi bado liko wazi, hakuna upande salama kwa sasa.',
        en: 'The group is still open, so neither side is safe yet.',
        zh: '小组形势仍然开放，目前没有哪一边是稳的。',
      },
    },
    {
      id: 'taifa-3',
      author: 'Sports Quant',
      avatar: 'SQ',
      createdAt: '2026-08-05T08:00:00.000Z',
      body: {
        sw: 'Depth ya kikosi ndiyo risk kubwa kuliko form ya sasa.',
        en: 'Squad depth is the bigger risk than current form.',
        zh: '阵容深度比当前状态更像主要风险。',
      },
    },
  ],
  'zanzibar-tourism-million': [
    {
      id: 'zanzibar-1',
      author: 'Island Flow',
      avatar: 'IF',
      createdAt: '2026-08-11T07:55:00.000Z',
      body: {
        sw: 'Bookings za hoteli zinaonekana imara kuelekea msimu ujao.',
        en: 'Hotel bookings look solid heading into the next season.',
        zh: '进入下个旅游季前，酒店预订看起来较强。',
      },
    },
    {
      id: 'zanzibar-2',
      author: 'Tourism TZ',
      avatar: 'TZ',
      createdAt: '2026-08-08T20:35:00.000Z',
      body: {
        sw: 'Flight capacity ndiyo signal muhimu zaidi wiki hizi.',
        en: 'Flight capacity is the key signal over the next few weeks.',
        zh: '未来几周航班运力是最关键的信号。',
      },
    },
    {
      id: 'zanzibar-3',
      author: 'StoneTown Data',
      avatar: 'SD',
      createdAt: '2026-07-29T12:10:00.000Z',
      body: {
        sw: 'Mwaka unaweza kumaliza vizuri kama high season haitapungua.',
        en: 'The year can finish strong if high season demand holds.',
        zh: '如果旺季需求保持，今年收尾可能会很强。',
      },
    },
  ],
  'tanzania-2027-ruling-party-nominee': [
    {
      id: 'politics-1',
      author: 'Bunge Watch',
      avatar: 'BW',
      createdAt: '2026-08-11T13:45:00.000Z',
      body: {
        sw: 'Jina linaloongoza lina liquidity kubwa, lakini soko la siasa hubadilika haraka.',
        en: 'The leading name has most liquidity, but political markets can turn quickly.',
        zh: '领先人选流动性最高，但政治市场变化会很快。',
      },
    },
    {
      id: 'politics-2',
      author: 'Policy Desk',
      avatar: 'PD',
      createdAt: '2026-08-10T21:05:00.000Z',
      body: {
        sw: 'Volume ya wagombea mbadala inaanza kupanda baada ya mijadala ya ndani.',
        en: 'Alternative candidates are gaining volume after internal discussions.',
        zh: '内部讨论后，替代候选人的成交量开始上升。',
      },
    },
    {
      id: 'politics-3',
      author: 'TZ Civic',
      avatar: 'TC',
      createdAt: '2026-08-07T10:30:00.000Z',
      body: {
        sw: 'Soko hili linahitaji kusoma taarifa rasmi, si uvumi pekee.',
        en: 'This market needs official-signal tracking, not only rumor flow.',
        zh: '这个市场需要跟踪官方信号，不能只看传闻。',
      },
    },
  ],
  'nbc-premier-league-winner': [
    {
      id: 'league-1',
      author: 'League Desk',
      avatar: 'LD',
      createdAt: '2026-08-11T12:15:00.000Z',
      body: {
        sw: 'Yanga ina bei ya juu, lakini transfer window bado haijafungwa.',
        en: 'Yanga is priced high, but the transfer window is not closed.',
        zh: 'Yanga 价格偏高，但转会窗口还没有关闭。',
      },
    },
    {
      id: 'league-2',
      author: 'Simba Pulse',
      avatar: 'SP',
      createdAt: '2026-08-10T15:40:00.000Z',
      body: {
        sw: 'Simba ikikamilisha striker mpya, odds zinaweza kusogea.',
        en: 'If Simba lands a new striker, odds can move.',
        zh: '如果 Simba 签下新前锋，赔率可能会变化。',
      },
    },
    {
      id: 'league-3',
      author: 'Azam Data',
      avatar: 'AD',
      createdAt: '2026-08-06T18:00:00.000Z',
      body: {
        sw: 'Azam ina thamani kama soko litazidi kuwa la timu mbili tu.',
        en: 'Azam has value if the market keeps over-focusing on two clubs.',
        zh: '如果市场过度聚焦两强，Azam 可能有价值。',
      },
    },
  ],
  'usd-tzs-year-end-range': [
    {
      id: 'range-1',
      author: 'FX Range',
      avatar: 'FR',
      createdAt: '2026-08-11T08:25:00.000Z',
      body: {
        sw: 'Range ya kati inaonekana safest, lakini tail ya juu haipaswi kupuuzwa.',
        en: 'The middle range looks safest, but the upper tail should not be ignored.',
        zh: '中间区间看起来最稳，但上行尾部风险不能忽视。',
      },
    },
    {
      id: 'range-2',
      author: 'Macro Dar',
      avatar: 'MD',
      createdAt: '2026-08-09T13:15:00.000Z',
      body: {
        sw: 'Import demand na fuel prices zinaweza kuamua mwisho wa mwaka.',
        en: 'Import demand and fuel prices may decide the year-end range.',
        zh: '进口需求和燃油价格可能决定年底区间。',
      },
    },
    {
      id: 'range-3',
      author: 'Shilling Lab',
      avatar: 'SL',
      createdAt: '2026-08-04T09:50:00.000Z',
      body: {
        sw: 'BOT intervention ndiyo variable kubwa kwa range ya chini.',
        en: 'BOT intervention is the big variable for the lower range.',
        zh: '央行干预是低区间的关键变量。',
      },
    },
  ],
};

function getHotScore(market: Market) {
  return Math.round(market.volume / 1000 * 0.45 + market.traders / 100 * 0.25 + Math.abs(market.change24h) * 8);
}

function getTodayVolume(market: Market) {
  return market.volume;
}

const outcomeTextClasses = [
  'text-sky-600 dark:text-sky-300',
  'text-violet-600 dark:text-violet-300',
  'text-amber-600 dark:text-amber-300',
  'text-orange-600 dark:text-orange-300',
  'text-cyan-600 dark:text-cyan-300',
];

const outcomeBarClasses = [
  'bg-sky-400/30',
  'bg-violet-400/30',
  'bg-amber-400/30',
  'bg-orange-400/30',
  'bg-cyan-400/30',
];

function getOutcomeTextClass(outcomeId: OutcomeId, index: number) {
  if (outcomeId === 'yes') {
    return 'text-emerald-600 dark:text-emerald-300';
  }

  if (outcomeId === 'no') {
    return 'text-rose-600 dark:text-rose-300';
  }

  return outcomeTextClasses[index % outcomeTextClasses.length];
}

function getOutcomeBarClass(outcomeId: OutcomeId, index: number) {
  if (outcomeId === 'yes') {
    return 'bg-emerald-400/30';
  }

  if (outcomeId === 'no') {
    return 'bg-rose-400/30';
  }

  return outcomeBarClasses[index % outcomeBarClasses.length];
}

function formatDollarVolume(value: number) {
  if (value >= 1_000_000) {
    return `$ ${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `$ ${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  }

  return `$ ${value}`;
}

function formatCommentTime(value: string, locale: Locale) {
  const now = new Date('2026-08-11T16:00:00.000Z');
  const date = new Date(value);
  const diffMs = Math.max(now.getTime() - date.getTime(), 0);
  const diffHours = Math.max(1, Math.floor(diffMs / (60 * 60 * 1000)));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffHours < 24) {
    if (locale === 'zh') {
      return `${diffHours}小时内`;
    }
    return `${diffHours}h ago`;
  }

  if (diffDays < 7) {
    if (locale === 'zh') {
      return `${diffDays}天前`;
    }
    return `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : locale === 'sw' ? 'sw-TZ' : 'en-US', {
    year: 'numeric',
    month: locale === 'zh' ? 'numeric' : 'short',
    day: 'numeric',
  }).format(date);
}

function formatDeadline(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : locale === 'sw' ? 'sw-TZ' : 'en-US', {
    year: 'numeric',
    month: locale === 'zh' ? 'numeric' : 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function HomePage() {
  const { locale, t } = useI18n();
  const copy = pageCopy[locale];
  const [markets, setMarkets] = useState<Market[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    marketService.listMarkets({ locale, category: 'all' }).then((items) => {
      setMarkets(items);
      setLoading(false);
    });
  }, [locale]);

  const hotMarkets = useMemo(() => [...markets].sort((a, b) => getTodayVolume(b) - getTodayVolume(a)), [markets]);
  const activeMarket = hotMarkets[activeIndex % Math.max(hotMarkets.length, 1)];
  const activeComments = activeMarket ? marketComments[activeMarket.id] ?? [] : [];
  const rollingComments = activeComments.length > 0 ? [...activeComments, ...activeComments] : [];

  useEffect(() => {
    if (hotMarkets.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % hotMarkets.length);
    }, 30000);

    return () => window.clearInterval(timer);
  }, [hotMarkets.length]);

  if (loading || !activeMarket) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-[330px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.055]" />
        <div className="hot-market-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/[0.055]" />
          ))}
        </div>
      </div>
    );
  }

  const hotTopicMarkets = hotMarkets.slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="trending-shell">
        <div className="grid grid-rows-[1fr_auto] gap-2">
          <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.065] shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
            <div className="trending-card-grid">
              <div className="trending-card-left border-b border-white/10 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-sm font-black text-[#071018]">
                      {activeMarket.localizedContent[locale].title.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white/42">
                        {t(`markets.${activeMarket.category}` as never)} · {copy.featured}
                      </div>
                      <h1 className="mt-1 line-clamp-2 text-xl font-black leading-tight tracking-[-0.025em] text-white">
                        {activeMarket.localizedContent[locale].title}
                      </h1>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 text-white/35">
                    <Link2 className="h-4 w-4" />
                    <Bookmark className="h-4 w-4" />
                  </div>
                </div>

                <div className="divide-y divide-white/10 rounded-xl border border-white/10">
                  {activeMarket.outcomes.map((outcome, index) => (
                    <OutcomeRow
                      key={outcome.id}
                      label={outcome.label[locale]}
                      probability={outcome.probability}
                      textClassName={getOutcomeTextClass(outcome.id, index)}
                    />
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <Metric label={copy.heat} value={getHotScore(activeMarket).toLocaleString()} />
                  <Metric label={copy.volume} value={formatCompactNumber(activeMarket.volume, locale)} />
                  <Metric label={copy.traders} value={formatCompactNumber(activeMarket.traders, locale)} />
                </div>

                <div
                  className="comment-marquee mt-3 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] p-3"
                >
                  <div className="mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100/70">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {copy.comments}
                  </div>
                  <div className="h-[86px] overflow-hidden">
                    <div key={`${activeMarket.id}-${locale}`} className="comment-marquee-track grid gap-2">
                      {rollingComments.map((comment, index) => (
                        <div key={`${comment.id}-${index}`} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2">
                          <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[10px] font-black text-cyan-100">
                            {comment.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="truncate font-black text-white/82">{comment.author}</span>
                              <span className="shrink-0 text-white/34">{formatCommentTime(comment.createdAt, locale)}</span>
                            </div>
                            <p className="whitespace-normal break-words text-xs leading-5 text-white/62">{comment.body[locale]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex min-h-[300px] flex-col p-4">
                <div className="mb-2 flex items-center text-xs font-semibold text-white/45">
                  <span>{activeMarket.localizedContent[locale].description}</span>
                </div>

                <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/10 bg-black/10 p-3">
                  <ProbabilityChart market={activeMarket} locale={locale} className="min-h-0 flex-1" />
                  <div className="mt-1 flex shrink-0 justify-end text-[11px] font-bold text-white/34">
                    {formatDeadline(activeMarket.endsAt, locale)} {copy.ends}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 pl-1">
            {hotMarkets.map((market, index) => {
              const isActive = index === activeIndex % hotMarkets.length;
              return (
                <button
                  key={market.id}
                  type="button"
                  aria-label={`${copy.featured} ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'relative h-1.5 overflow-hidden rounded-full transition',
                    isActive ? 'w-8 bg-cyan-300/20' : 'w-1.5 bg-white/25 hover:bg-cyan-200/45',
                  )}
                >
                  {isActive ? (
                    <span
                      key={`${market.id}-${activeIndex}`}
                      className="carousel-progress-fill absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="grid grid-rows-[1fr_auto] gap-2">
          <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.065] p-3 shadow-[0_12px_35px_rgba(0,0,0,0.14)]">
            <div className="mb-2 flex items-center justify-between">
              <SectionTitle icon={<Flame className="h-4 w-4 text-rose-300" />} title={copy.hotRank} compact />
              <Link to={`/${locale}/markets`} className="text-xs font-bold text-white/42 hover:text-white">
                {copy.explore}
              </Link>
            </div>
            <div className="grid flex-1 gap-1" style={{ gridTemplateRows: `repeat(${hotTopicMarkets.length}, minmax(0, 1fr))` }}>
              {hotTopicMarkets.map((market, index) => (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'grid h-full grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-2 text-left transition',
                    index === activeIndex % hotMarkets.length ? 'bg-rose-300/12' : 'hover:bg-white/[0.06]',
                  )}
                >
                  <span className={cn('text-xs font-black', index < 3 ? 'text-rose-300' : 'text-white/32')}>{index + 1}</span>
                  <span className="truncate text-xs font-semibold text-white/78">{market.localizedContent[locale].title}</span>
                  <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-black text-white/42">
                    {copy.volume} {formatCompactNumber(getTodayVolume(market), locale)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="h-1.5" aria-hidden="true" />
        </aside>
      </section>

      <section>
        <SectionTitle icon={<TrendingUp className="h-4 w-4" />} title={copy.topMarkets} />
        <div className="hot-market-grid">
          {hotMarkets.map((market) => <MiniMarketCard key={market.id} market={market} />)}
        </div>
      </section>
    </div>
  );
}

function OutcomeRow({ label, probability, textClassName }: { label: string; probability: number; textClassName: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-2 px-3 py-2.5">
      <span className={cn('truncate text-sm font-bold', textClassName)}>{label}</span>
      <span className="text-right text-base font-black text-white">{probability}%</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2">
      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-white/32">{label}</div>
      <div className="mt-0.5 text-xs font-black text-white">{value}</div>
    </div>
  );
}

function MiniMarketCard({ market }: { market: Market }) {
  const { locale, t } = useI18n();
  const copy = pageCopy[locale];
  const visibleOutcomes = market.outcomes.slice(0, 4);

  return (
    <Link
      to={`/${locale}/markets/${market.id}`}
      className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-white/[0.085]"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-xs font-bold text-cyan-100/70">{t(`markets.${market.category}` as never)}</span>
      </div>
      <h3 className="line-clamp-2 min-h-[40px] text-sm font-black leading-5 text-white">{market.localizedContent[locale].title}</h3>
      <div className="mt-3 grid gap-1.5">
        {visibleOutcomes.map((outcome, index) => (
          <MiniOutcome
            key={outcome.id}
            label={outcome.label[locale]}
            probability={outcome.probability}
            textClassName={getOutcomeTextClass(outcome.id, index)}
            barClassName={getOutcomeBarClass(outcome.id, index)}
          />
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <span className="text-xs font-semibold text-white/45">{formatDollarVolume(market.volume)} {copy.tradeVolume}</span>
        <Sparkline values={market.sparkline} className="h-8 w-24 opacity-80" />
      </div>
    </Link>
  );
}

function MiniOutcome({
  label,
  probability,
  textClassName,
  barClassName,
}: {
  label: string;
  probability: number;
  textClassName: string;
  barClassName: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-slate-950/[0.045] ring-1 ring-slate-900/[0.05] dark:bg-white/[0.04] dark:ring-white/[0.06]">
      <div
        className={cn('absolute inset-y-0 left-0 rounded-lg shadow-[inset_-1px_0_0_rgba(255,255,255,0.28)]', barClassName)}
        style={{ width: `${probability}%` }}
      />
      <div className="relative grid grid-cols-[minmax(0,1fr)_42px] items-center px-2 py-1.5">
        <span className={cn('truncate text-xs font-bold', textClassName)}>{label}</span>
        <span className="text-right text-xs font-black text-white">{probability}%</span>
      </div>
    </div>
  );
}

function SectionTitle({ title, icon, compact }: { title: string; icon?: React.ReactNode; compact?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', compact ? 'mb-0' : 'mb-3')}>
      {icon ? <span className="text-cyan-200">{icon}</span> : null}
      <h2 className={cn('font-black tracking-tight text-white', compact ? 'text-sm' : 'text-lg')}>{title}</h2>
    </div>
  );
}
