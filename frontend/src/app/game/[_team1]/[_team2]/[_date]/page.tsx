import { notFound } from "next/navigation";
import * as z from "zod";
import { GameNavigation } from "~/components/game-navigation";
import { Histogram } from "~/components/histogram";
import { WinPercentCard } from "~/components/win-percent-card";

const paramSchema = z
  .object({
    _team1: z.coerce.number().int().min(0),
    _team2: z.coerce.number().int().min(0),
    _date: z.preprocess((val) => new Date(Number(val) * 1000), z.date()),
  })
  .transform(({ _team1, _team2, _date }) => ({
    team1Id: _team1,
    team2Id: _team2,
    date: _date,
  }));

const team1 = "Everton";
const team2 = "Arsenal";

const venue = "Goodison Park";

const data: any[] = [
  { score: 100, [team1]: 5, [team2]: 8 },
  { score: 110, [team1]: 7, [team2]: 9 },
  { score: 120, [team1]: 9, [team2]: 4 },
];
const series: any[] = [
  { type: "bar", xKey: "score", yKey: team1, yName: team1 },
  { type: "bar", xKey: "score", yKey: team2, yName: team2 },
];

const previousGame = new Date(2024, 2, 5);
const nextGame = new Date(2024, 10, 11);

export default async function Page({
  params,
}: {
  params: Promise<z.input<typeof paramSchema>>;
}) {
  const parsed = paramSchema.safeParse(await params);
  if (!parsed.success) {
    return notFound();
  }

  const { team1Id, team2Id, date } = parsed.data;

  return (
    <main className="flex w-full max-w-[1120px] flex-1 flex-col items-start justify-start pt-12 pb-4">
      <GameNavigation
        team1Id={team1Id}
        team2Id={team2Id}
        previousGame={previousGame}
        nextGame={nextGame}
      />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
        {team1} vs {team2} • {venue} •{" "}
        {date.toLocaleDateString("en-UK", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </h1>
      <div className="mt-6 flex w-full flex-col items-stretch gap-6 lg:flex-row">
        <div className="flex-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <Histogram
            title="Percentage of Matches"
            subtitle=""
            data={data}
            series={series}
          />
        </div>
        <div className="flex w-fit flex-col gap-3">
          <WinPercentCard
            teamName={team1}
            winPercent={50}
            simulationsCount={50}
          />
          <WinPercentCard
            teamName={team2}
            winPercent={50}
            simulationsCount={50}
          />
        </div>
      </div>
    </main>
  );
}
