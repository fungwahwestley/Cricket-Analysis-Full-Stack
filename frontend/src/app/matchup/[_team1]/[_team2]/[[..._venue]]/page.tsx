import { notFound } from "next/navigation";
import { Matchup } from "./matchup";
import { paramsSchema, type PageParams } from "./schema";

export default async function Page({ params }: { params: PageParams }) {
  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) {
    return notFound();
  }

  const { team1Id, team2Id, venueId } = parsed.data;

  return (
    <main className="flex w-full max-w-[1180px] flex-1 flex-col items-start justify-start pt-6 pb-4 md:pt-12">
      <Matchup team1Id={team1Id} team2Id={team2Id} venueId={venueId} />
    </main>
  );
}
