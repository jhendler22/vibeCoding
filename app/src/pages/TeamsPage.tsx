import { useEffect, useMemo, useState } from 'react';
import { DataTable, type Column } from '../components/DataTable';
import { getApi } from '../utils/api';
import { useDebounce } from '../utils/useDebounce';
import type { TeamStanding } from '../types';
import { useRefresh } from '../features/useRefresh';

const columns: Column<TeamStanding>[] = [
  { key: 'team', label: 'Team', sortable: true },
  { key: 'division', label: 'Division', sortable: true },
  { key: 'stage', label: 'Stage', sortable: true },
  { key: 'gp', label: 'GP', sortable: true },
  { key: 'wins', label: 'W', sortable: true },
  { key: 'losses', label: 'L', sortable: true },
  { key: 'points', label: 'PTS', sortable: true },
  { key: 'goalDiff', label: 'GD', sortable: true }
];

export const TeamsPage = () => {
  const [rows, setRows] = useState<TeamStanding[]>([]);
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('both');
  const [stage, setStage] = useState('all');
  const [sortKey, setSortKey] = useState<keyof TeamStanding>('points');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const debouncedSearch = useDebounce(search, 300);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    getApi<TeamStanding[]>('/api/teams').then((res) => setRows(res.data));
  }, [refreshKey]);

  const filteredRows = useMemo(() => {
    return rows
      .filter((row) => division === 'both' || row.division === division)
      .filter((row) => stage === 'all' || row.stage === stage)
      .filter((row) => row.team.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .sort((a, b) => {
        const left = a[sortKey];
        const right = b[sortKey];
        const cmp = left > right ? 1 : left < right ? -1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [rows, division, stage, debouncedSearch, sortKey, sortDir]);

  const onSort = (key: keyof TeamStanding) => {
    setSortKey(key);
    setSortDir((prev) => (sortKey === key && prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <section>
      <h2>Teams</h2>
      <div className="controls">
        <input placeholder="Search team" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={division} onChange={(e) => setDivision(e.target.value)}>
          <option value="both">Both</option><option value="men">Men</option><option value="women">Women</option>
        </select>
        <select value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="all">All stages</option><option value="group">Group</option><option value="playoff">Playoff</option><option value="final">Final</option>
        </select>
        <a className="primary button" href={`/api/export/teams?division=${division}&stage=${stage}&search=${encodeURIComponent(debouncedSearch)}&sortKey=${String(sortKey)}&sortDir=${sortDir}`}>Export CSV</a>
      </div>
      <DataTable rows={filteredRows} columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
    </section>
  );
};
