import { z } from "zod";

export const TeamSummaryDto = z.object({
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
  team1: TeamSummaryDto,
  team2: TeamSummaryDto,
  venue: z.string(),
  bins: BinsDto,
});

export type TeamSummary = z.infer<typeof TeamSummaryDto>;
export type Bin = z.infer<typeof BinDto>;
export type Bins = z.infer<typeof BinsDto>;
export type Simulation = z.infer<typeof SimulationDto>;
