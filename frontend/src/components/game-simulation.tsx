import React, { useMemo } from "react";
import { WinPercentCard } from "./win-percent-card";
import { Histogram } from "./histogram";
import type { AgBarSeriesOptions } from "ag-charts-community";
import type { Bins, TeamSimulation } from "~/contracts/simulations";

interface GameSimulationProps {
  homeTeamSimulation: TeamSimulation;
  awayTeamSimulation: TeamSimulation;
  bins: Bins;
}

export function GameSimulation({
  homeTeamSimulation,
  awayTeamSimulation,
  bins,
}: GameSimulationProps) {
  const series: AgBarSeriesOptions[] = useMemo(
    () => [
      {
        type: "bar",
        xKey: "score",
        yKey: homeTeamSimulation.name,
        yName: homeTeamSimulation.name,
      },
      {
        type: "bar",
        xKey: "score",
        yKey: awayTeamSimulation.name,
        yName: awayTeamSimulation.name,
      },
    ],
    [homeTeamSimulation, awayTeamSimulation],
  );

  return (
    <div className="mt-6 flex w-full flex-col items-stretch gap-6 lg:flex-row">
      <div className="flex-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <Histogram
          title="Simulated Matches"
          subtitle=""
          bins={bins}
          series={series}
        />
      </div>
      <div className="flex w-full flex-col gap-3 lg:w-fit">
        <WinPercentCard
          teamName={homeTeamSimulation.name}
          winPercent={homeTeamSimulation.winPercent * 100}
          simulationsCount={homeTeamSimulation.simulationsCount}
          color="text-[#436ff4]"
        />
        <WinPercentCard
          teamName={awayTeamSimulation.name}
          winPercent={awayTeamSimulation.winPercent * 100}
          simulationsCount={awayTeamSimulation.simulationsCount}
          color="text-[#9a7bff]"
        />
      </div>
    </div>
  );
}
