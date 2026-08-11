import { useEffect, useState } from 'react';
import { Activity, BarChart3, Brain, ChevronDown, Database, History, Plus, Send, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '@/features/i18n/useI18n';
import type { Locale } from '@/types/domain';
import { cn } from '@/lib/utils';

const agentCopy: Record<
  Locale,
  {
    eyebrow: string;
    greeting: string;
    placeholder: string;
    send: string;
    answerTitle: string;
    answerBody: string;
    chatInput: string;
    mode: string;
    model: string;
    history: string;
    newChat: string;
    recentChats: string;
    intentGroups: Array<{
      label: string;
      prompts: string[];
    }>;
  }
> = {
  sw: {
    eyebrow: 'AfriBet Agent',
    greeting: 'Habari, mimi ni AfriBet. Unataka kuchunguza soko gani?',
    placeholder: 'Uliza kuhusu trendi, biashara za mada, au uchambuzi wa data...',
    send: 'Tuma',
    answerTitle: 'AfriBet',
    answerBody: 'Nitachambua mwelekeo wa bei, kiasi cha biashara, washiriki wapya na hatari kuu kwa kutumia data ya soko la demo.',
    chatInput: 'Chunguza masoko, chambua nafasi, na panga mikakati zaidi...',
    mode: 'Wastani',
    model: 'GPT-5.6',
    history: 'Historia',
    newChat: 'Mazungumzo mapya',
    recentChats: 'Mazungumzo ya karibuni',
    intentGroups: [
      {
        label: 'Market Pulse',
        prompts: [
          'Ni masoko gani yamepata kasi kubwa zaidi leo?',
          'Ni mada gani mpya zinaanza kuvutia washiriki?',
          'Onyesha mabadiliko makubwa ya bei kwenye saa 24 zilizopita.',
        ],
      },
      {
        label: 'Trade Flow',
        prompts: [
          'Chambua biashara za mada ya Yanga vs Simba.',
          'Ni mada gani zina volume isiyo ya kawaida?',
          'Eleza kama volume inaendana na mabadiliko ya uwezekano.',
        ],
      },
      {
        label: 'Data Analysis',
        prompts: [
          'Linganishia masoko ya football na economy kwa volume na traders.',
          'Tafuta masoko yenye probability iliyobadilika zaidi wiki hii.',
          'Nipe summary ya data za masoko yanayoongoza leo.',
        ],
      },
      {
        label: 'Risk Watch',
        prompts: [
          'Nipe muhtasari wa hatari kwenye masoko ya USD/TZS.',
          'Ni masoko gani yanaweza kuwa na taarifa zisizo kamili?',
          'Taja mada zenye volatility kubwa na sababu zake.',
        ],
      },
    ],
  },
  en: {
    eyebrow: 'AfriBet Agent',
    greeting: "Hey, I'm AfriBet. Which market should we inspect?",
    placeholder: 'Ask about recent market trends, topic trading activity, or data analysis...',
    send: 'Send',
    answerTitle: 'AfriBet',
    answerBody: 'I will summarize price movement, trading volume, trader participation, and major risk signals from the current demo market data.',
    chatInput: 'Research markets, analyze positions, and plan strategies...',
    mode: 'Balanced',
    model: 'GPT-5.6',
    history: 'History',
    newChat: 'New chat',
    recentChats: 'Recent chats',
    intentGroups: [
      {
        label: 'Market Pulse',
        prompts: [
          'Which markets are trending fastest today?',
          'Which new topics are starting to attract attention?',
          'Show the largest probability moves in the last 24h.',
        ],
      },
      {
        label: 'Trade Flow',
        prompts: [
          'Analyze trading activity for Yanga vs Simba.',
          'Any topics with unusual volume today?',
          'Explain whether volume supports the latest probability move.',
        ],
      },
      {
        label: 'Data Analysis',
        prompts: [
          'Compare football and economy markets by volume and traders.',
          'Find markets with the biggest probability changes this week.',
          'Summarize data patterns across today’s top markets.',
        ],
      },
      {
        label: 'Risk Watch',
        prompts: [
          'Summarize risk signals for USD/TZS markets.',
          'Which markets may have incomplete or weak source data?',
          'List high-volatility topics and explain the drivers.',
        ],
      },
    ],
  },
  zh: {
    eyebrow: 'AfriBet Agent',
    greeting: '你好，我是 AfriBet。你想分析哪个市场？',
    placeholder: '询问最近市场趋势、某个话题交易情况、数据分析等...',
    send: '发送',
    answerTitle: 'AfriBet',
    answerBody: '我会基于当前模拟市场数据，汇总价格趋势、成交量、交易者参与度和主要风险信号。',
    chatInput: '继续研究市场、分析持仓、制定交易策略...',
    mode: '平衡',
    model: 'GPT-5.6',
    history: '历史对话',
    newChat: '新建对话',
    recentChats: '最近对话',
    intentGroups: [
      {
        label: '市场脉冲',
        prompts: [
          '今天哪些市场热度上升最快？',
          '有哪些新话题开始吸引交易者注意？',
          '列出过去 24 小时概率变化最大的市场。',
        ],
      },
      {
        label: '交易情况',
        prompts: [
          '分析 Yanga vs Simba 这个话题的交易情况。',
          '今天有没有成交量异常的话题？',
          '判断最近的概率变化是否有成交量支撑。',
        ],
      },
      {
        label: '数据分析',
        prompts: [
          '按成交量和交易者数量对比足球与经济类市场。',
          '找出本周概率变化最大的市场。',
          '总结今天热门市场的数据特征。',
        ],
      },
      {
        label: '风险监控',
        prompts: [
          '总结 USD/TZS 相关市场的主要风险信号。',
          '哪些市场可能存在信息源不足的问题？',
          '列出高波动话题，并解释背后的驱动因素。',
        ],
      },
    ],
  },
};

const capabilityIcons = [TrendingUp, Activity, BarChart3, Database];

export function AgentPage() {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const copy = agentCopy[locale];
  const [activeIntentIndex, setActiveIntentIndex] = useState(0);
  const [question, setQuestion] = useState(copy.intentGroups[0].prompts[0]);
  const activeIntent = copy.intentGroups[activeIntentIndex] ?? copy.intentGroups[0];

  useEffect(() => {
    setActiveIntentIndex(0);
    setQuestion(copy.intentGroups[0].prompts[0]);
  }, [locale, copy.intentGroups]);

  function selectIntent(index: number) {
    const nextIntent = copy.intentGroups[index];
    if (!nextIntent) {
      return;
    }

    setActiveIntentIndex(index);
    setQuestion(nextIntent.prompts[0]);
  }

  function submitQuestion() {
    const value = question.trim();
    if (!value) {
      return;
    }
    navigate(`/${locale}/agent/chat?q=${encodeURIComponent(value)}`, { state: { question: value } });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="relative px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-300/18 blur-[90px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black text-cyan-100">
            <Brain className="h-4 w-4" />
            {copy.eyebrow}
          </div>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            {copy.greeting}
          </h1>
        </div>

        <div className="relative mx-auto mt-8 max-w-4xl rounded-[26px] border border-white/10 bg-white/[0.075] p-3 shadow-[0_14px_45px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={copy.placeholder}
            className="min-h-[104px] w-full resize-none rounded-2xl bg-white/[0.035] px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/34"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={submitQuestion}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-300 px-4 text-sm font-black text-[#071018] shadow-[0_10px_28px_rgba(125,211,252,0.2)] transition hover:from-cyan-200 hover:to-violet-200"
            >
              {copy.send}
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative mx-auto mt-3 flex max-w-4xl flex-wrap gap-2">
          {copy.intentGroups.map((intent, index) => {
            const Icon = capabilityIcons[index] ?? Sparkles;
            const isActive = index === activeIntentIndex;
            return (
              <button
                key={intent.label}
                type="button"
                onClick={() => selectIntent(index)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold transition',
                  isActive
                    ? 'border-cyan-200 bg-gradient-to-r from-cyan-300 to-violet-300 text-[#071018] shadow-[0_8px_22px_rgba(125,211,252,0.22)]'
                    : 'border-white/10 bg-white/[0.06] text-white/72 hover:bg-white/[0.09] hover:text-white',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {intent.label}
              </button>
            );
          })}
        </div>

        <div className="relative mx-auto mt-5 max-w-4xl">
          <div className="grid gap-2">
            {activeIntent.prompts.map((prompt, index) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setQuestion(prompt)}
                className={cn(
                  'group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition',
                  question === prompt
                    ? 'border-cyan-300/35 bg-cyan-300/12 text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'border-white/10 bg-white/[0.045] text-white/58 hover:bg-white/[0.075] hover:text-white',
                )}
              >
                <span className="min-w-0 truncate">
                  {index + 1}. {prompt}
                </span>
                <Send className="h-3.5 w-3.5 shrink-0 opacity-45 transition group-hover:opacity-90" />
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

type ChatLocationState = {
  question?: string;
};

export function AgentChatPage() {
  const { locale } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const copy = agentCopy[locale];
  const locationState = location.state as ChatLocationState | null;
  const questionFromSearch = new URLSearchParams(location.search).get('q');
  const initialQuestion = locationState?.question || questionFromSearch || copy.intentGroups[0].prompts[0];
  const [messages, setMessages] = useState([initialQuestion]);
  const [draft, setDraft] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const latestQuestion = messages[messages.length - 1] ?? initialQuestion;
  const recentConversations = Array.from(new Set([initialQuestion, ...copy.intentGroups.flatMap((intent) => intent.prompts)]))
    .slice(0, 6)
    .map((title, index) => ({
      title,
      time: ['Now', '12m ago', '38m ago', '2h ago', 'Yesterday', 'Aug 10'][index],
    }));

  function openConversation(value: string) {
    setMessages([value]);
    setDraft('');
    setIsHistoryOpen(false);
    navigate(`/${locale}/agent/chat?q=${encodeURIComponent(value)}`, { replace: true, state: { question: value } });
  }

  function sendMessage() {
    const value = draft.trim();
    if (!value) {
      return;
    }

    setMessages((current) => [...current, value]);
    setDraft('');
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      <div className="sticky top-0 z-10 -mx-4 border-b border-white/8 bg-[#070A12]/82 px-4 py-3 backdrop-blur-2xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="relative mx-auto max-w-5xl">
          <div className="truncate px-36 text-center text-sm font-semibold text-white/48 lg:px-24">
            {latestQuestion}
          </div>

          <div className="absolute right-12 top-1/2 flex -translate-y-1/2 items-center gap-1 lg:right-0">
            <button
              type="button"
              aria-label={copy.history}
              onClick={() => setIsHistoryOpen((value) => !value)}
              className={cn(
                'group relative grid h-10 w-10 place-items-center rounded-2xl text-white/62 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50',
                isHistoryOpen && 'bg-cyan-300/12 text-cyan-50',
              )}
            >
              <History className="h-4 w-4" />
              <span className="agent-icon-tooltip">{copy.history}</span>
            </button>
            <button
              type="button"
              aria-label={copy.newChat}
              onClick={() => navigate(`/${locale}/agent`)}
              className="group relative grid h-10 w-10 place-items-center rounded-2xl text-white/62 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
            >
              <Plus className="h-4 w-4" />
              <span className="agent-icon-tooltip">{copy.newChat}</span>
            </button>
          </div>

          {isHistoryOpen ? (
            <div className="agent-history-menu absolute right-12 top-12 z-20 w-[360px] max-w-[calc(100vw-32px)] rounded-[22px] p-2 text-left lg:right-0">
              <div className="px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/34">
                {copy.recentChats}
              </div>
              <div className="grid gap-1">
                {recentConversations.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => openConversation(item.title)}
                    className={cn(
                      'grid gap-1 rounded-2xl px-3 py-2.5 text-left transition',
                      item.title === latestQuestion
                        ? 'bg-cyan-300/12 text-cyan-50'
                        : 'text-white/58 hover:bg-white/8 hover:text-white',
                    )}
                  >
                    <span className="truncate text-xs font-bold">{item.title}</span>
                    <span className="text-[10px] font-semibold text-white/34">{item.time}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-1 pb-5 pt-5">
        <div className="flex-1 space-y-5">
          {messages.map((message, index) => (
            <div key={`${message}-${index}`} className="flex justify-end">
              <div className="max-w-[min(720px,86%)] rounded-[22px] border border-cyan-300/22 bg-cyan-300/15 px-4 py-3 text-sm leading-6 text-cyan-50 shadow-[0_14px_42px_rgba(34,211,238,0.12)]">
                {message}
                <div className="mt-1 text-right text-[11px] font-semibold text-cyan-100/45">18:32</div>
              </div>
            </div>
          ))}

          <div className="flex justify-start">
            <div className="w-full text-sm text-white/62">
              <div className="mb-2 flex items-center gap-2 text-xs font-black text-cyan-100">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
                {copy.answerTitle}
              </div>
              <p className="leading-6">{copy.answerBody}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-4 mt-8 rounded-[24px] border border-white/10 bg-black/42 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.chatInput}
            className="min-h-[78px] w-full resize-none rounded-2xl bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/36"
          />
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex min-w-0 items-center gap-3 text-[11px] font-bold text-white/48">
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                {copy.mode}
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <Zap className="h-3.5 w-3.5" />
                {copy.model}
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </div>
            <button
              type="button"
              onClick={sendMessage}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-300 text-[#071018] shadow-[0_10px_28px_rgba(125,211,252,0.2)] transition hover:from-cyan-200 hover:to-violet-200"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
