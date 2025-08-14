import { z } from "zod";

export const TeamDto = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const VenueDto = z.object({
  id: z.number().int(),
  name: z.string(),
});

export type Team = z.infer<typeof TeamDto>;
export type Venue = z.infer<typeof VenueDto>;
