import { z } from "zod";
import { SimulationDto } from "./simulations";
import { GameDto } from "./atoms";

export const GamesDto = z.object({
  team1Name: z.string(),
  team2Name: z.string(),
  games: z.array(GameDto),
});

export const GameWithSimulationDto = z.object({
  simulation: SimulationDto.omit({
    homeTeamId: true,
    awayTeamId: true,
    venue: true,
  }),
  homeTeamId: z.number(),
  awayTeamId: z.number(),
  venue: z.string(),
});

export type Games = z.infer<typeof GamesDto>;
export type GameWithSimulation = z.infer<typeof GameWithSimulationDto>;
