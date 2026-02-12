import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { TeamsPage } from './pages/TeamsPage';
import { PlayersPage } from './pages/PlayersPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { RefreshContext } from './features/useRefresh';
import { themes, type ThemeName } from './theme/tokens';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';

const defaultTheme = (import.meta.env.VITE_DEFAULT_THEME || 'dark') as ThemeName;
const refreshIntervalSeconds = Number(import.meta.env.VITE_REFRESH_INTERVAL_SECONDS || 30);

export const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState<ThemeName>(defaultTheme in themes ? defaultTheme : 'dark');

  const style = useMemo(
    () => ({
      '--bg': themes[theme].bg,
      '--panel': themes[theme].panel,
      '--text': themes[theme].text,
      '--muting': themes[theme].muting,
      '--accent': themes[theme].accent,
      '--error': themes[theme].error,
      '--border': themes[theme].border
    }) as CSSProperties,
    [theme]
  );

  useEffect(() => {
    const id = setInterval(() => setRefreshKey((prev) => prev + 1), refreshIntervalSeconds * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={style}>
      <RefreshContext.Provider value={{ refreshKey, refresh: () => setRefreshKey((prev) => prev + 1) }}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell onRefresh={() => setRefreshKey((prev) => prev + 1)} />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/games/:gameId" element={<GameDetailPage />} />
            </Route>
          </Routes>
          <button style={{ position: 'fixed', right: 12, bottom: 12 }} onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}>Toggle theme</button>
        </BrowserRouter>
      </RefreshContext.Provider>
    </div>
  );
};
