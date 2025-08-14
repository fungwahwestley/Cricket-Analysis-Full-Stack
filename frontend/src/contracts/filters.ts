import { z } from "zod";
import { TeamDto, VenueDto } from "./atoms";

export const FiltersDto = z.object({
  teams: z.array(TeamDto),
  venues: z.array(VenueDto),
});

export type Filters = z.infer<typeof FiltersDto>;
