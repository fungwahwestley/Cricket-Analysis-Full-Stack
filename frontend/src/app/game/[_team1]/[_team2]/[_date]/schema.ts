import { z } from "zod";

export const paramsSchema = z
  .object({
    _team1: z.coerce.number().int().min(0),
    _team2: z.coerce.number().int().min(0),
    _date: z.preprocess((val) => new Date(Number(val) * 1000), z.date()),
  })
  .transform(({ _team1, _team2, _date }) => ({
    team1Id: _team1,
    team2Id: _team2,
    date: _date,
  }));

export type PageParams = Promise<z.input<typeof paramsSchema>>;
