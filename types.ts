
export interface TeamStats {
  id: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export type LeagueCategory = 'Team A' | 'Team B';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  category: LeagueCategory;
}

export enum AppTab {
  League = 'league',
  Media = 'media',
  Search = 'search'
}
