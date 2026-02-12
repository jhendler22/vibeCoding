import type { Game, PlayerStat, TeamStanding } from '../models/types.js';

const teams: TeamStanding[] = [
  { id: 't1', division: 'men', stage: 'group', team: 'Canada', gp: 4, wins: 4, losses: 0, points: 12, goalDiff: 14 },
  { id: 't2', division: 'men', stage: 'group', team: 'Sweden', gp: 4, wins: 3, losses: 1, points: 9, goalDiff: 8 },
  { id: 't3', division: 'women', stage: 'group', team: 'USA', gp: 4, wins: 4, losses: 0, points: 12, goalDiff: 16 },
  { id: 't4', division: 'women', stage: 'group', team: 'Finland', gp: 4, wins: 2, losses: 2, points: 6, goalDiff: 1 },
  { id: 't5', division: 'men', stage: 'playoff', team: 'Czechia', gp: 5, wins: 3, losses: 2, points: 8, goalDiff: 2 },
  { id: 't6', division: 'women', stage: 'playoff', team: 'Canada', gp: 5, wins: 4, losses: 1, points: 11, goalDiff: 12 }
];

const players: PlayerStat[] = [
  { id: 'p1', division: 'men', team: 'Canada', name: 'Mason Bell', position: 'F', gamesPlayed: 4, goals: 4, assists: 5, points: 9, plusMinus: 7, toi: '18:35' },
  { id: 'p2', division: 'men', team: 'Sweden', name: 'Leo Nyberg', position: 'D', gamesPlayed: 4, goals: 1, assists: 4, points: 5, plusMinus: 4, toi: '22:01' },
  { id: 'p3', division: 'women', team: 'USA', name: 'Avery Sloan', position: 'F', gamesPlayed: 4, goals: 6, assists: 3, points: 9, plusMinus: 6, toi: '19:12' },
  { id: 'p4', division: 'women', team: 'Finland', name: 'Nora Kallio', position: 'G', gamesPlayed: 4, goals: 0, assists: 0, points: 0, plusMinus: 0, toi: '60:00' },
  { id: 'p5', division: 'women', team: 'Canada', name: 'Sky Clarke', position: 'D', gamesPlayed: 5, goals: 2, assists: 6, points: 8, plusMinus: 8, toi: '24:31' }
];

const games: Game[] = [
  {
    id: 'g1', division: 'men', stage: 'group', homeTeam: 'Canada', awayTeam: 'Sweden', homeScore: 3, awayScore: 2,
    period: 3, timeRemaining: '09:41', state: 'live', events: ['12:11 P1 GOAL Canada (Bell)', '05:00 P2 GOAL Sweden (Nyberg)', '10:19 P3 GOAL Canada (Santos)']
  },
  {
    id: 'g2', division: 'women', stage: 'playoff', homeTeam: 'USA', awayTeam: 'Canada', homeScore: 1, awayScore: 2,
    period: 2, timeRemaining: '03:05', state: 'live', events: ['18:29 P1 GOAL USA (Sloan)', '16:14 P2 GOAL Canada (Clarke)']
  }
];

export async function fetchTeams(): Promise<TeamStanding[]> {
  return structuredClone(teams);
}

export async function fetchPlayers(): Promise<PlayerStat[]> {
  return structuredClone(players);
}

export async function fetchGames(): Promise<Game[]> {
  return structuredClone(games);
}
