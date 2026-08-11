import { useEffect } from 'react';
import { Navigate, Outlet, Route, HashRouter as Router, Routes, useParams } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { AgentChatPage, AgentPage } from '@/features/agent/AgentPage';
import { useI18n, isSupportedLocale } from '@/features/i18n/useI18n';
import { LeaderboardPage } from '@/features/leaderboard/LeaderboardPage';
import { HomePage } from '@/features/markets/HomePage';
import { MarketDetailPage } from '@/features/markets/MarketDetailPage';
import { MarketsPage } from '@/features/markets/MarketsPage';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { PortfolioPage } from '@/features/portfolio/PortfolioPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/sw" replace />} />
        <Route path="/:locale" element={<LocalizedShell />}>
          <Route index element={<HomePage />} />
          <Route path="markets" element={<MarketsPage />} />
          <Route path="markets/:marketId" element={<MarketDetailPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="agent" element={<AgentPage />} />
          <Route path="agent/chat" element={<AgentChatPage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

function LocalizedShell() {
  const { locale: routeLocale } = useParams();
  const { locale, setLocale } = useI18n();
  const validLocale = isSupportedLocale(routeLocale);

  useEffect(() => {
    if (validLocale && routeLocale !== locale) {
      setLocale(routeLocale);
    }
  }, [locale, routeLocale, setLocale, validLocale]);

  if (!validLocale) {
    return <Navigate to="/sw" replace />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
