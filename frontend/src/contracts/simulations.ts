import { z } from "zod";

export const TeamSimulationDto = z.object({
  name: z.string(),
  winPercent: z.number().min(0).max(1),
  simulationsCount: z.number().int().nonnegative(),
});

export const BinDto = z
  .object({
    score: z.number(),
  })
  .catchall(z.number());

export const BinsDto = z.array(BinDto);

export const SimulationDto = z.object({
  team1: TeamSimulationDto,
  team2: TeamSimulationDto,
  bins: BinsDto,
  homeTeamId: z.number(),
  awayTeamId: z.number(),
  venue: z.string(),
});

export type TeamSimulation = z.infer<typeof TeamSimulationDto>;
export type Bin = z.infer<typeof BinDto>;
export type Bins = z.infer<typeof BinsDto>;
export type Simulation = z.infer<typeof SimulationDto>;
