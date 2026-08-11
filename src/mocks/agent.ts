import type { AgentInsight } from '@/types/domain';

export const agentInsights: AgentInsight[] = [
  {
    id: 'brief-derby',
    type: 'daily-brief',
    marketId: 'yanga-win-derby',
    confidence: 'high',
    title: {
      sw: 'Derby inaongoza leo',
      en: 'The derby leads today',
      zh: '今日德比市场领先',
    },
    body: {
      sw: 'Masoko ya Yanga na Simba yana shughuli kubwa baada ya taarifa za kikosi na majeruhi.',
      en: 'Yanga and Simba markets show the strongest activity after squad and injury updates.',
      zh: 'Yanga 与 Simba 相关市场在阵容和伤病更新后活跃度最高。',
    },
    riskTags: ['high-volatility'],
  },
  {
    id: 'mover-tzs',
    type: 'market-mover',
    marketId: 'usd-tzs-2700',
    confidence: 'medium',
    title: {
      sw: 'Shilingi inasukuma masoko ya FX',
      en: 'Shilling pressure is moving FX markets',
      zh: '坦桑尼亚先令压力正在推动汇率市场',
    },
    body: {
      sw: 'USD/TZS imesogea pointi 2 baada ya dola kuimarika na mahitaji ya uagizaji kuongezeka.',
      en: 'USD/TZS moved 2 points after stronger dollar positioning and import-demand pressure.',
      zh: '美元仓位走强与进口需求压力后，USD/TZS 概率上移 2 点。',
    },
    riskTags: ['ending-soon', 'high-volatility'],
  },
  {
    id: 'risk-entertainment',
    type: 'risk-alert',
    marketId: 'diamond-platnumz-collab',
    confidence: 'medium',
    title: {
      sw: 'Soko la burudani lina ukungu wa kanuni',
      en: 'Entertainment market has rule ambiguity',
      zh: '娱乐市场存在规则歧义',
    },
    body: {
      sw: 'Chanzo rasmi cha tangazo ni muhimu. Tetesi pekee hazitoshi kwa settlement.',
      en: 'Official announcement sources matter. Rumors alone should not move settlement.',
      zh: '该市场需依赖官方宣布来源，单纯传闻不应触发结算。',
    },
    riskTags: ['ambiguous-rules'],
  },
];

