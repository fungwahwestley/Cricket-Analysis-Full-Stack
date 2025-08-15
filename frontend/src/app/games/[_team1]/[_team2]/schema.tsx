import { z } from "zod";

export const paramsSchema = z
  .object({
    _team1: z.coerce.number().int().min(0),
    _team2: z.coerce.number().int().min(0),
  })
  .transform(({ _team1, _team2 }) => ({
    team1Id: _team1,
    team2Id: _team2,
  }));

export type PageParams = Promise<z.input<typeof paramsSchema>>;
