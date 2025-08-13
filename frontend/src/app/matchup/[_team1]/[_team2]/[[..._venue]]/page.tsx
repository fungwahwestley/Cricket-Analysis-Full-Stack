import { notFound } from "next/navigation";
import * as z from "zod";
import { Histogram } from "~/components/histogram";
import { WinPercentCard } from "~/components/win-percent-card";

const ParamsSchema = z
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

export default async function Page({
  params,
}: {
  params: Promise<z.input<typeof ParamsSchema>>;
}) {
  const parsed = ParamsSchema.safeParse(await params);
  if (!parsed.success) {
    return notFound();
  }

  const { team1Id, team2Id, venueId } = parsed.data;

  return (
    <main className="flex w-full max-w-[1120px] flex-1 flex-col items-start justify-start pt-12 pb-4">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        {team1} vs {team2} • {venue}
      </h1>
      {(() => {
        // const team1Total = data.reduce(
        //   (sum, row) => sum + (Number(row[team1]) || 0),
        //   0,
        // );
        // const team2Total = data.reduce(
        //   (sum, row) => sum + (Number(row[team2]) || 0),
        //   0,
        // );
        // const total = team1Total + team2Total;
        // const winPercent1 = total > 0 ? (team1Total / total) * 100 : 0;
        // const winPercent2 = total > 0 ? (team2Total / total) * 100 : 0;

        return (
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
        );
      })()}
    </main>
  );
}
