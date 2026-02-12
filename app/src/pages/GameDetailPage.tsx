import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApi } from '../utils/api';
import type { Game } from '../types';
import { useRefresh } from '../features/useRefresh';

export const GameDetailPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    getApi<Game>(`/api/games/${gameId}`).then((res) => setGame(res.data));
  }, [gameId, refreshKey]);

  if (!game) return <div className="skeleton" />;

  return (
    <section className="panel">
      <h2>{game.homeTeam} vs {game.awayTeam}</h2>
      <p>{game.homeScore} - {game.awayScore} · {game.state} · Period {game.period} ({game.timeRemaining})</p>
      <h3>Events</h3>
      <ul>
        {game.events.map((event, index) => <li key={index}>{event}</li>)}
      </ul>
    </section>
  );
};
