import { z } from "zod";

export const TeamDto = z.object({
  id: z.number().int(),
  name: z.string(),
  venueId: z.number().int(),
});

export const VenueDto = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const GameDto = z
  .object({
    id: z.coerce.number().int(),
    date: z.coerce.date(),
    homeTeam: z.object({ id: z.coerce.number().int(), name: z.string() }),
    awayTeam: z.object({ id: z.coerce.number().int(), name: z.string() }),
    venue: z.object({ id: z.coerce.number().int(), name: z.string() }),
  })
  .transform(({ id, date, homeTeam, awayTeam, venue }) => ({
    id,
    date,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    homeTeamName: homeTeam.name,
    awayTeamName: awayTeam.name,
    venueId: venue.id,
    venueName: venue.name,
  }));

export type Team = z.infer<typeof TeamDto>;
export type Venue = z.infer<typeof VenueDto>;
export type Game = z.infer<typeof GameDto>;
