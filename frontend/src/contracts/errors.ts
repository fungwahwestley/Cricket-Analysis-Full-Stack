import { z } from "zod";

export const ApiErrorDto = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof ApiErrorDto>;
