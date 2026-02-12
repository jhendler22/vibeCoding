import { useEffect, useMemo, useState } from 'react';
import { DataTable, type Column } from '../components/DataTable';
import { getApi } from '../utils/api';
import { useDebounce } from '../utils/useDebounce';
import type { PlayerStat } from '../types';
import { useRefresh } from '../features/useRefresh';

const columns: Column<PlayerStat>[] = [
  { key: 'name', label: 'Player', sortable: true },
  { key: 'team', label: 'Team', sortable: true },
  { key: 'division', label: 'Division', sortable: true },
  { key: 'position', label: 'Pos', sortable: true },
  { key: 'gamesPlayed', label: 'GP', sortable: true },
  { key: 'goals', label: 'G', sortable: true },
  { key: 'assists', label: 'A', sortable: true },
  { key: 'points', label: 'PTS', sortable: true },
  { key: 'plusMinus', label: '+/-', sortable: true },
  { key: 'toi', label: 'TOI', sortable: false }
];

export const PlayersPage = () => {
  const [rows, setRows] = useState<PlayerStat[]>([]);
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('both');
  const [position, setPosition] = useState('all');
  const [team, setTeam] = useState('all');
  const [minGp, setMinGp] = useState(0);
  const [sortKey, setSortKey] = useState<keyof PlayerStat>('points');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const debouncedSearch = useDebounce(search, 300);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    getApi<PlayerStat[]>('/api/players').then((res) => setRows(res.data));
  }, [refreshKey]);

  const teams = useMemo(() => ['all', ...Array.from(new Set(rows.map((row) => row.team)))], [rows]);

  const filteredRows = useMemo(() => {
    return rows
      .filter((row) => division === 'both' || row.division === division)
      .filter((row) => position === 'all' || row.position === position)
      .filter((row) => team === 'all' || row.team === team)
      .filter((row) => row.gamesPlayed >= minGp)
      .filter((row) => `${row.name} ${row.team}`.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .sort((a, b) => {
        const left = a[sortKey];
        const right = b[sortKey];
        const cmp = left > right ? 1 : left < right ? -1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [rows, division, position, team, minGp, debouncedSearch, sortKey, sortDir]);

  const onSort = (key: keyof PlayerStat) => {
    setSortKey(key);
    setSortDir((prev) => (sortKey === key && prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <section>
      <h2>Players</h2>
      <div className="controls">
        <input placeholder="Search player/team" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={division} onChange={(e) => setDivision(e.target.value)}><option value="both">Both</option><option value="men">Men</option><option value="women">Women</option></select>
        <select value={position} onChange={(e) => setPosition(e.target.value)}><option value="all">All positions</option><option value="F">Forward</option><option value="D">Defense</option><option value="G">Goalie</option></select>
        <select value={team} onChange={(e) => setTeam(e.target.value)}>{teams.map((value) => <option key={value} value={value}>{value}</option>)}</select>
        <input type="number" min={0} value={minGp} onChange={(e) => setMinGp(Number(e.target.value) || 0)} placeholder="Min GP" />
        <a className="primary button" href={`/api/export/players?division=${division}&position=${position}&team=${team}&minGp=${minGp}&search=${encodeURIComponent(debouncedSearch)}&sortKey=${String(sortKey)}&sortDir=${sortDir}`}>Export CSV</a>
      </div>
      <DataTable rows={filteredRows} columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
    </section>
  );
};
