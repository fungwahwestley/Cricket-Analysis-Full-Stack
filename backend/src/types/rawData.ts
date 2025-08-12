export interface VenueRaw {
  venue_id: string;
  venue_name: string;
  home_multiplier: string;
}

export interface GameRaw {
  home_team: string;
  away_team: string;
  date: string;
  venue_id: string;
}

export interface SimulationRaw {
  team_id: string;
  team: string;
  simulation_run: string;
  results: string;
}
