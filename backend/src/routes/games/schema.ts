import { z } from "zod";

export const paramsSchema = z.object({
  team1Id: z.coerce.number().int().min(0),
  team2Id: z.coerce.number().int().min(0),
});
