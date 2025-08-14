import { notFound } from "next/navigation";
import { GameNavigation } from "./game-navigation";
import { Game } from "./game";
import { paramsSchema, type PageParams } from "./schema";

const previousGame = new Date(2024, 2, 5);
const nextGame = new Date(2024, 10, 11);

export default async function Page({ params }: { params: PageParams }) {
  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) {
    return notFound();
  }

  const { team1Id, team2Id, date } = parsed.data;

  return (
    <main className="flex w-full max-w-[1180px] flex-1 flex-col items-start justify-start gap-2 pt-12 pb-4">
      <GameNavigation
        team1Id={team1Id}
        team2Id={team2Id}
        previousGame={previousGame}
        nextGame={nextGame}
      />
      <Game team1Id={team1Id} team2Id={team2Id} date={date} />
    </main>
  );
}
