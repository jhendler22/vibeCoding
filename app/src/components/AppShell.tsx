import { Link, NavLink, Outlet } from 'react-router-dom';

interface AppShellProps {
  stale?: boolean;
  cachedAt?: string;
  onRefresh?: () => void;
}

export const AppShell = ({ stale, cachedAt, onRefresh }: AppShellProps) => {
  return (
    <div className="layout">
      <header className="nav">
        <Link to="/"><strong>Olympic Hockey Stats Tracker</strong></Link>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/teams">Teams</NavLink>
        <NavLink to="/players">Players</NavLink>
        <button onClick={onRefresh}>Refresh</button>
      </header>
      {stale && <div className="error-banner">Showing stale cached data from {cachedAt}.</div>}
      <Outlet />
    </div>
  );
};
