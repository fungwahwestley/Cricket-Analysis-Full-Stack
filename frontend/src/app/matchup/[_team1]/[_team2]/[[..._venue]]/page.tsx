import { notFound } from "next/navigation";
import * as z from "zod";
import { MatchupClient } from "./matchup-client";

const paramsSchema = z
  .object({
    _team1: z.coerce.number().int().min(0),
    _team2: z.coerce.number().int().min(0),
    _venue: z.array(z.coerce.number().int().min(0)).optional(),
  })
  .transform(({ _team1, _team2, _venue }) => ({
    team1Id: _team1,
    team2Id: _team2,
    venueId: _venue?.[0],
  }));

export default async function Page({
  params,
}: {
  params: Promise<z.input<typeof paramsSchema>>;
}) {
  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) {
    return notFound();
  }

  const { team1Id, team2Id, venueId } = parsed.data;

  return (
    <main className="flex w-full max-w-[1420px] flex-1 flex-col items-start justify-start pt-12 pb-4">
      <MatchupClient team1Id={team1Id} team2Id={team2Id} venueId={venueId} />
    </main>
  );
}
