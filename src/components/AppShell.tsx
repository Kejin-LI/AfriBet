import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Diamond,
  HelpCircle,
  Landmark,
  LogOut,
  RefreshCw,
  Settings,
  Sun,
  TrendingUp,
  Trophy,
  UserPlus,
  WalletCards,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supportedLocales, useI18n } from '@/features/i18n/useI18n';
import { languageNames } from '@/features/i18n/translations';
import { formatCurrency } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types/domain';

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { key: 'nav.agent', path: 'agent', icon: Brain },
  { key: 'nav.home', path: '', icon: TrendingUp },
  { key: 'nav.markets', path: 'markets', icon: Landmark },
  { key: 'nav.portfolio', path: 'portfolio', icon: WalletCards },
  { key: 'nav.leaderboard', path: 'leaderboard', icon: Trophy },
] as const;

export function AppShell({ children }: AppShellProps) {
  const { locale, setLocale, t } = useI18n();
  const portfolio = useAppStore((state) => state.portfolio);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const mobileAccountMenuRef = useRef<HTMLDivElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [appearance, setAppearance] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    return window.localStorage.getItem('afribet-appearance') === 'light' ? 'light' : 'dark';
  });
  const accountCopy = {
    sw: {
      userName: 'Kejin',
      role: 'Demo Trader',
      totalPositions: 'Nafasi zote',
      invite: 'Alika rafiki',
      inviteHint: 'Up to 650 per user',
      checkIn: 'AfriBet fuel station',
      checkInHint: 'Check in for points',
      growthPlan: 'Growth plan',
      growthHint: 'Earn weekly rewards',
      settings: 'Settings',
      help: 'Msaada na maoni',
      updates: 'Angalia masasisho',
      logout: 'Toka',
      appearance: 'Muonekano',
      light: 'Light',
      dark: 'Dark',
    },
    en: {
      userName: 'Kejin',
      role: 'Demo Trader',
      totalPositions: 'Total positions',
      invite: 'Invite',
      inviteHint: 'Up to 650 points/user',
      checkIn: 'AfriBet fuel station',
      checkInHint: 'Check in for points',
      growthPlan: 'Growth plan',
      growthHint: 'Earn weekly rewards',
      settings: 'Settings',
      help: 'Help & feedback',
      updates: 'Check updates',
      logout: 'Log out',
      appearance: 'Appearance',
      light: 'Light',
      dark: 'Dark',
    },
    zh: {
      userName: 'Kejin',
      role: '模拟交易者',
      totalPositions: '总持仓',
      invite: '去邀约',
      inviteHint: '最高得 650 积分/人',
      checkIn: 'AfriBet 加油站',
      checkInHint: '签到领积分',
      growthPlan: '成长计划',
      growthHint: '连登抽取周边',
      settings: '设置',
      help: '帮助与反馈',
      updates: '检查更新',
      logout: '退出登录',
      appearance: '外观',
      light: '浅色',
      dark: '深色',
    },
  }[locale];
  const isAgentChatPage = location.pathname.includes('/agent/chat');

  useEffect(() => {
    document.documentElement.dataset.theme = appearance;
    window.localStorage.setItem('afribet-appearance', appearance);
  }, [appearance]);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        accountMenuRef.current?.contains(event.target as Node) ||
        mobileAccountMenuRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      setIsAccountMenuOpen(false);
      setIsLanguageMenuOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isAccountMenuOpen]);

  const accountMenuClass = cn(
    'absolute bottom-[76px] left-0 right-auto z-[120] w-[340px] max-w-[calc(100vw-32px)] rounded-[24px] border p-4 shadow-2xl backdrop-blur-2xl',
    appearance === 'light'
      ? 'border-slate-200/80 bg-white text-slate-950 shadow-slate-200/70'
      : 'border-white/18 bg-[#050816] text-white shadow-[0_28px_90px_rgba(0,0,0,0.72)] ring-1 ring-cyan-300/10',
  );
  const mobileAccountMenuClass = cn(
    'absolute right-0 top-[56px] z-[130] w-[340px] max-w-[calc(100vw-24px)] rounded-[24px] border p-4 shadow-2xl backdrop-blur-2xl',
    appearance === 'light'
      ? 'border-slate-200/80 bg-white text-slate-950 shadow-slate-200/70'
      : 'border-white/18 bg-[#050816] text-white shadow-[0_28px_90px_rgba(0,0,0,0.72)] ring-1 ring-cyan-300/10',
  );
  const accountMenuItemClass = cn(
    'flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-1 py-2.5 text-left text-sm font-semibold transition',
    appearance === 'light' ? 'text-slate-900 hover:bg-slate-100/80' : 'text-white/88 hover:bg-white/10 hover:text-white',
  );
  const accountMenuIconClass = cn('h-4 w-4 shrink-0', appearance === 'light' ? 'text-slate-700' : 'text-cyan-100/76');
  const accountMenuMutedClass = cn('ml-auto max-w-[156px] truncate text-xs font-medium', appearance === 'light' ? 'text-slate-400' : 'text-white/58');
  const accountMenuDividerClass = cn('my-3 h-px', appearance === 'light' ? 'bg-slate-200/80' : 'bg-white/14');

  function switchAccountMenuLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    const currentPath = location.pathname;
    const currentLocale = params.locale;
    const nextPath = currentLocale
      ? currentPath.replace(`/${currentLocale}`, `/${nextLocale}`)
      : `/${nextLocale}${currentPath}`;
    navigate(nextPath + location.search, { replace: true });
    setIsLanguageMenuOpen(false);
  }

  return (
    <div className={cn('h-screen overflow-hidden bg-[#070A12] text-white', appearance === 'light' && 'theme-light')}>
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-12%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#7C5CFF]/25 blur-[110px]" />
        <div className="absolute right-[-10%] top-[8%] h-[360px] w-[360px] rounded-full bg-[#22D3EE]/18 blur-[110px]" />
        <div className="absolute bottom-[-16%] left-[30%] h-[460px] w-[460px] rounded-full bg-[#20C997]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,rgba(7,10,18,0.1),#070A12_80%)]" />
      </div>

      <div
        className={cn(
          'mx-auto grid h-screen min-h-0 max-w-[1500px]',
          isSidebarCollapsed ? 'lg:grid-cols-[minmax(0,1fr)]' : 'lg:grid-cols-[260px_minmax(0,1fr)]',
        )}
      >
        {!isSidebarCollapsed && (
          <aside className="relative z-[90] hidden h-screen max-h-screen min-h-0 self-start border-r border-white/10 bg-white/[0.035] p-5 backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:flex-col">
            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 font-black text-[#071018] shadow-lg shadow-cyan-500/20">
                AB
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-black tracking-tight">{t('app.name')}</div>
                <div className="text-xs uppercase tracking-[0.24em] text-emerald-200/70">{t('app.country')}</div>
              </div>
              <button
                type="button"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                onClick={() => setIsSidebarCollapsed(true)}
                className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/60 transition hover:bg-white/12 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.key}
                    to={`/${locale}/${item.path}`}
                    end={item.path === ''}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/58 transition hover:bg-white/8 hover:text-white',
                        isActive && 'border border-white/12 bg-white/10 text-white shadow-lg',
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.key)}
                  </NavLink>
                );
              })}
            </nav>

            <div ref={accountMenuRef} className="relative mt-6">
              {isAccountMenuOpen && (
                <div className={accountMenuClass}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="truncate text-base font-black">{accountCopy.userName}</div>
                      <button
                        type="button"
                        aria-label="Copy user id"
                        className={cn(
                          'grid h-7 w-7 place-items-center rounded-xl transition',
                          appearance === 'light' ? 'text-slate-500 hover:bg-slate-100' : 'text-white/48 hover:bg-white/8 hover:text-white',
                        )}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className={cn('text-xs font-semibold', appearance === 'light' ? 'text-slate-400' : 'text-white/36')}>
                      {accountCopy.role}
                    </div>
                  </div>

                  <div className={accountMenuDividerClass} />

                  <button type="button" className={accountMenuItemClass}>
                    <TrendingUp className={accountMenuIconClass} />
                    <span>{accountCopy.checkIn}</span>
                    <span className={accountMenuMutedClass}>{accountCopy.checkInHint}</span>
                    <ChevronRight className={cn('h-3.5 w-3.5', appearance === 'light' ? 'text-slate-300' : 'text-white/28')} />
                  </button>
                  <button type="button" className={accountMenuItemClass}>
                    <UserPlus className={accountMenuIconClass} />
                    <span>{accountCopy.invite}</span>
                    <span className={accountMenuMutedClass}>{accountCopy.inviteHint}</span>
                    <ChevronRight className={cn('h-3.5 w-3.5', appearance === 'light' ? 'text-slate-300' : 'text-white/28')} />
                  </button>
                  <button type="button" className={accountMenuItemClass}>
                    <WalletCards className={accountMenuIconClass} />
                    <span>{accountCopy.totalPositions}</span>
                    <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-semibold">
                      <span className={appearance === 'light' ? 'text-cyan-700' : 'text-cyan-200'}>
                        {formatCurrency(portfolio.demoBalance, locale)}
                      </span>
                    </span>
                  </button>
                  <button type="button" className={accountMenuItemClass}>
                    <Diamond className={accountMenuIconClass} />
                    <span>{accountCopy.growthPlan}</span>
                    <span className={accountMenuMutedClass}>{accountCopy.growthHint}</span>
                    <ChevronRight className={cn('h-3.5 w-3.5', appearance === 'light' ? 'text-slate-300' : 'text-white/28')} />
                  </button>

                  <div className={accountMenuDividerClass} />

                  <button
                    type="button"
                    onClick={() => setIsLanguageMenuOpen((value) => !value)}
                    className={accountMenuItemClass}
                  >
                    <Settings className={accountMenuIconClass} />
                    <span>{accountCopy.settings}</span>
                    <span className={accountMenuMutedClass}>{languageNames[locale]}</span>
                    <ChevronRight
                      className={cn(
                        'h-3.5 w-3.5 transition',
                        isLanguageMenuOpen && 'rotate-90',
                        appearance === 'light' ? 'text-slate-300' : 'text-white/28',
                      )}
                    />
                  </button>
                  {isLanguageMenuOpen && (
                    <div
                      className={cn(
                        'mb-1 ml-7 grid gap-1 rounded-2xl border p-1.5',
                        appearance === 'light'
                          ? 'border-transparent bg-slate-100'
                          : 'border-white/12 bg-[#0B1020] shadow-inner shadow-black/30',
                      )}
                    >
                      {supportedLocales.map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => switchAccountMenuLocale(item)}
                          className={cn(
                            'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition',
                            item === locale
                              ? appearance === 'light'
                                ? 'bg-white text-slate-950 shadow-sm'
                                : 'bg-white/12 text-white'
                              : appearance === 'light'
                                ? 'text-slate-500 hover:bg-white/70 hover:text-slate-950'
                                : 'text-white/72 hover:bg-white/10 hover:text-white',
                          )}
                        >
                          {languageNames[item]}
                          {item === locale ? (
                            <Check className={cn('h-4 w-4', appearance === 'light' ? 'text-emerald-600' : 'text-emerald-300')} />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className={cn(accountMenuItemClass, 'cursor-default hover:bg-transparent')}>
                    <Sun className={accountMenuIconClass} />
                    <span>{accountCopy.appearance}</span>
                    <div className={cn('ml-auto grid grid-cols-2 gap-1 rounded-xl p-1', appearance === 'light' ? 'bg-slate-100' : 'bg-white/8')}>
                      {(['light', 'dark'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setAppearance(mode)}
                          className={cn(
                            'rounded-lg px-3 py-1 text-xs font-bold transition',
                            appearance === mode
                              ? appearance === 'light'
                                ? 'bg-white text-slate-950 shadow-sm'
                                : 'bg-white text-[#071018]'
                              : appearance === 'light'
                                ? 'text-slate-500 hover:text-slate-900'
                                : 'text-white/42 hover:text-white',
                          )}
                        >
                          {mode === 'light' ? accountCopy.light : accountCopy.dark}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="button" className={accountMenuItemClass}>
                    <HelpCircle className={accountMenuIconClass} />
                    <span>{accountCopy.help}</span>
                  </button>
                  <button type="button" className={accountMenuItemClass}>
                    <RefreshCw className={accountMenuIconClass} />
                    <span>{accountCopy.updates}</span>
                  </button>

                  <div className={accountMenuDividerClass} />

                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl px-1 py-2.5 text-left text-sm font-semibold transition',
                      appearance === 'light' ? 'text-slate-900 hover:bg-slate-100/80' : 'text-rose-200/82 hover:bg-rose-400/10 hover:text-rose-100',
                    )}
                  >
                    <LogOut className={accountMenuIconClass} />
                    <span>{accountCopy.logout}</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((value) => !value)}
                className="flex w-full items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.055] p-3 text-left transition hover:bg-white/[0.08]"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-black text-[#071018]">
                  K
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black text-white">{accountCopy.userName}</div>
                  <div className="flex items-center gap-1.5 text-xs text-white/48">
                    <TrendingUp className="h-3 w-3" />
                    <span className="truncate">{accountCopy.role}</span>
                  </div>
                </div>
              </button>
            </div>
          </aside>
        )}

        {isSidebarCollapsed && (
          <button
            type="button"
            aria-label="Expand sidebar"
            title="Expand sidebar"
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed left-4 top-4 z-50 hidden h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-white/70 shadow-2xl backdrop-blur-2xl transition hover:bg-white/12 hover:text-white lg:grid"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        <main
          className={cn(
            'relative z-0 h-screen min-h-0 min-w-0 overflow-y-auto px-4 pb-28 sm:px-6 lg:px-8 lg:pb-10',
            isAgentChatPage ? 'pt-0' : 'pt-4',
          )}
        >
          {children}
        </main>
      </div>

      <div
        ref={mobileAccountMenuRef}
        className={cn('fixed right-4 z-[130] lg:hidden', isAgentChatPage ? 'top-3' : 'top-4')}
      >
        {isAccountMenuOpen && (
          <div className={mobileAccountMenuClass}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <div className="truncate text-base font-black">{accountCopy.userName}</div>
                <button
                  type="button"
                  aria-label="Copy user id"
                  className={cn(
                    'grid h-7 w-7 place-items-center rounded-xl transition',
                    appearance === 'light' ? 'text-slate-500 hover:bg-slate-100' : 'text-white/48 hover:bg-white/8 hover:text-white',
                  )}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className={cn('text-xs font-semibold', appearance === 'light' ? 'text-slate-400' : 'text-white/36')}>
                {accountCopy.role}
              </div>
            </div>

            <div className={accountMenuDividerClass} />

            <button type="button" className={accountMenuItemClass}>
              <TrendingUp className={accountMenuIconClass} />
              <span>{accountCopy.checkIn}</span>
              <span className={accountMenuMutedClass}>{accountCopy.checkInHint}</span>
              <ChevronRight className={cn('h-3.5 w-3.5', appearance === 'light' ? 'text-slate-300' : 'text-white/28')} />
            </button>
            <button type="button" className={accountMenuItemClass}>
              <UserPlus className={accountMenuIconClass} />
              <span>{accountCopy.invite}</span>
              <span className={accountMenuMutedClass}>{accountCopy.inviteHint}</span>
              <ChevronRight className={cn('h-3.5 w-3.5', appearance === 'light' ? 'text-slate-300' : 'text-white/28')} />
            </button>
            <button type="button" className={accountMenuItemClass}>
              <WalletCards className={accountMenuIconClass} />
              <span>{accountCopy.totalPositions}</span>
              <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-semibold">
                <span className={appearance === 'light' ? 'text-cyan-700' : 'text-cyan-200'}>
                  {formatCurrency(portfolio.demoBalance, locale)}
                </span>
              </span>
            </button>
            <button type="button" className={accountMenuItemClass}>
              <Diamond className={accountMenuIconClass} />
              <span>{accountCopy.growthPlan}</span>
              <span className={accountMenuMutedClass}>{accountCopy.growthHint}</span>
              <ChevronRight className={cn('h-3.5 w-3.5', appearance === 'light' ? 'text-slate-300' : 'text-white/28')} />
            </button>

            <div className={accountMenuDividerClass} />

            <button
              type="button"
              onClick={() => setIsLanguageMenuOpen((value) => !value)}
              className={accountMenuItemClass}
            >
              <Settings className={accountMenuIconClass} />
              <span>{accountCopy.settings}</span>
              <span className={accountMenuMutedClass}>{languageNames[locale]}</span>
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 transition',
                  isLanguageMenuOpen && 'rotate-90',
                  appearance === 'light' ? 'text-slate-300' : 'text-white/28',
                )}
              />
            </button>
            {isLanguageMenuOpen && (
              <div
                className={cn(
                  'mb-1 ml-7 grid gap-1 rounded-2xl border p-1.5',
                  appearance === 'light'
                    ? 'border-transparent bg-slate-100'
                    : 'border-white/12 bg-[#0B1020] shadow-inner shadow-black/30',
                )}
              >
                {supportedLocales.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => switchAccountMenuLocale(item)}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition',
                      item === locale
                        ? appearance === 'light'
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'bg-white/12 text-white'
                        : appearance === 'light'
                          ? 'text-slate-500 hover:bg-white/70 hover:text-slate-950'
                          : 'text-white/72 hover:bg-white/10 hover:text-white',
                    )}
                  >
                    {languageNames[item]}
                    {item === locale ? (
                      <Check className={cn('h-4 w-4', appearance === 'light' ? 'text-emerald-600' : 'text-emerald-300')} />
                    ) : null}
                  </button>
                ))}
              </div>
            )}
            <div className={cn(accountMenuItemClass, 'cursor-default hover:bg-transparent')}>
              <Sun className={accountMenuIconClass} />
              <span>{accountCopy.appearance}</span>
              <div className={cn('ml-auto grid grid-cols-2 gap-1 rounded-xl p-1', appearance === 'light' ? 'bg-slate-100' : 'bg-white/8')}>
                {(['light', 'dark'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAppearance(mode)}
                    className={cn(
                      'rounded-lg px-3 py-1 text-xs font-bold transition',
                      appearance === mode
                        ? appearance === 'light'
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'bg-white text-[#071018]'
                        : appearance === 'light'
                          ? 'text-slate-500 hover:text-slate-900'
                          : 'text-white/42 hover:text-white',
                    )}
                  >
                    {mode === 'light' ? accountCopy.light : accountCopy.dark}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className={accountMenuItemClass}>
              <HelpCircle className={accountMenuIconClass} />
              <span>{accountCopy.help}</span>
            </button>
            <button type="button" className={accountMenuItemClass}>
              <RefreshCw className={accountMenuIconClass} />
              <span>{accountCopy.updates}</span>
            </button>

            <div className={accountMenuDividerClass} />

            <button
              type="button"
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl px-1 py-2.5 text-left text-sm font-semibold transition',
                appearance === 'light' ? 'text-slate-900 hover:bg-slate-100/80' : 'text-rose-200/82 hover:bg-rose-400/10 hover:text-rose-100',
              )}
            >
              <LogOut className={accountMenuIconClass} />
              <span>{accountCopy.logout}</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsAccountMenuOpen((value) => !value)}
          className={cn(
            'grid place-items-center rounded-2xl border border-white/12 bg-[#0D1220]/88 text-sm font-black text-cyan-50 shadow-2xl backdrop-blur-2xl transition hover:bg-white/12',
            isAgentChatPage ? 'h-10 w-10' : 'h-11 w-11',
          )}
        >K</button>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-[28px] border border-white/12 bg-[#0D1220]/88 p-2 shadow-2xl backdrop-blur-2xl lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const to = `/${locale}/${item.path}`;
          const active = item.path === ''
            ? location.pathname === `/${locale}` || location.pathname === `/${locale}/`
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={item.key}
              to={to}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold text-white/45 transition',
                active && 'bg-white/10 text-cyan-100',
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="max-w-full truncate">{t(item.key)}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
