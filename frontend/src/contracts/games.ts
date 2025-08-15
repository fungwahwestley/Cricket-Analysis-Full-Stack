import { z } from "zod";
import { GameDto } from "./atoms";

export const GamesDto = z.object({
  team1Name: z.string(),
  team2Name: z.string(),
  games: z.array(GameDto),
});

export type Games = z.infer<typeof GamesDto>;
