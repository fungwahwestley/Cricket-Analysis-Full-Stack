import { z } from "zod";
import { TeamDto, VenueDto } from "./atoms";

export const SearchFiltersDto = z.object({
  teams: z.array(TeamDto),
  venues: z.array(VenueDto),
});

export type SearchFilters = z.infer<typeof SearchFiltersDto>;
