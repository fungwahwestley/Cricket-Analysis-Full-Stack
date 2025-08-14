import { z } from "zod";

export const paramsSchema = z.object({
  team1Id: z.coerce.number().int().min(0),
  team2Id: z.coerce.number().int().min(0),
  date: z.coerce.date(),
});

export const querySchema = z.object({
  binSize: z.coerce.number().int().positive().max(1000).default(10),
});
