export type Division = 'men' | 'women';
export type Stage = 'group' | 'playoff' | 'final';

export interface TeamStanding {
  id: string;
  division: Division;
  stage: Stage;
  team: string;
  gp: number;
  wins: number;
  losses: number;
  points: number;
  goalDiff: number;
}

export interface PlayerStat {
  id: string;
  division: Division;
  team: string;
  name: string;
  position: 'F' | 'D' | 'G';
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  toi: string;
}

export interface Game {
  id: string;
  division: Division;
  stage: Stage;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  period: number;
  timeRemaining: string;
  state: 'scheduled' | 'live' | 'final';
  events: string[];
}

export interface ApiEnvelope<T> {
  data: T;
  stale: boolean;
  cachedAt: string;
  provider: string;
  error?: string;
}
