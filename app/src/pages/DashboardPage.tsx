import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getApi } from '../utils/api';
import type { ApiEnvelope, Game, TeamStanding } from '../types';
import { useRefresh } from '../features/useRefresh';

export const DashboardPage = () => {
  const [games, setGames] = useState<ApiEnvelope<Game[]> | null>(null);
  const [standings, setStandings] = useState<ApiEnvelope<TeamStanding[]> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    const load = async () => {
      try {
        const [g, s] = await Promise.all([getApi<Game[]>('/api/games'), getApi<TeamStanding[]>('/api/teams')]);
        setGames(g);
        setStandings(s);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      }
    };
    load();
  }, [refreshKey]);

  if (!games || !standings) return <div className="skeleton" />;

  return (
    <div className="grid grid-2">
      <section className="panel">
        <h2>Live Games</h2>
        {(games.stale || standings.stale) && <p className="error-banner">Stale data shown ({games.cachedAt})</p>}
        {error && <p className="error-banner">{error}</p>}
        {games.data.map((game) => (
          <p key={game.id}>
            <Link to={`/games/${game.id}`}>{game.homeTeam} {game.homeScore} - {game.awayScore} {game.awayTeam}</Link>
            <span className="muted"> · {game.state} P{game.period} {game.timeRemaining}</span>
          </p>
        ))}
      </section>
      <section className="panel">
        <h2>Standings Snapshot</h2>
        {standings.data.slice(0, 8).map((team) => (
          <p key={team.id}>{team.team}: {team.points} pts (GD {team.goalDiff})</p>
        ))}
      </section>
    </div>
  );
};
