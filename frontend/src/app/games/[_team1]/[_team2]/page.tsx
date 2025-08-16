import { notFound } from "next/navigation";
import { Games } from "./games";
import { paramsSchema, type PageParams } from "./schema";

export default async function Page({ params }: { params: PageParams }) {
  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) {
    return notFound();
  }

  const { team1Id, team2Id } = parsed.data;
  console.log("Found Games component:", Games);

  return (
    <main className="flex w-full max-w-[1580px] flex-1 flex-col items-start justify-start gap-2 pt-12 pb-4">
      <Games team1Id={team1Id} team2Id={team2Id} />
    </main>
  );
}
