import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useI18n } from '@/features/i18n/useI18n';

export function OnboardingPage() {
  const { locale, t } = useI18n();
  const cards = {
    sw: [
      ['1', 'Bei ni uwezekano', 'Bei ya NDIYO 58% ina maana soko linaona uwezekano wa 58%.'],
      ['2', 'Fedha za majaribio kwanza', 'MVP hutumia fedha pepe ili watumiaji wajifunze kabla ya njia za fedha halisi.'],
      ['3', 'Agent hueleza mabadiliko', 'Kila soko lina sababu inayoeleweka, kiwango cha uhakika na alama ya hatari.'],
    ],
    en: [
      ['1', 'Price is probability', 'A 58% YES price means the market currently estimates a 58% chance.'],
      ['2', 'Demo cash first', 'MVP uses virtual funds so users can learn before real-money rails arrive.'],
      ['3', 'Agent explains movement', 'Every market gets a readable reason, confidence, and risk label.'],
    ],
    zh: [
      ['1', '价格就是概率', '58% 的 YES 价格表示市场当前估计该事件有 58% 的发生概率。'],
      ['2', '先用虚拟资金', 'MVP 使用虚拟资金，让用户在真钱通道上线前先学习产品。'],
      ['3', 'Agent 解释异动', '每个市场都会有可读原因、置信度和风险标签。'],
    ],
  }[locale];

  return (
    <div className="space-y-6">
      <GlassCard variant="strong" padding="lg">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-white">{t('onboarding.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/62">{t('onboarding.body')}</p>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map(([step, title, body]) => (
          <GlassCard key={step}>
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300 text-xl font-black text-[#071018]">{step}</div>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">{body}</p>
          </GlassCard>
        ))}
      </div>

      <Link
        to={`/${locale}/markets`}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-violet-500 px-5 font-black text-[#071018]"
      >
        <CheckCircle2 className="h-4 w-4" />
        {t('home.start')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
