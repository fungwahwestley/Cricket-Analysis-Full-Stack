"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Histogram } from "~/components/histogram";
import { WinPercentCard } from "~/components/win-percent-card";
import type { AgBarSeriesOptions } from "ag-charts-community";
import { API_BASE_URL } from "~/lib/config";
import { Loading } from "~/components/loading";
import { ErrorMessage } from "~/components/error-message";
import { SimulationDto, type Simulation } from "~/contracts/simulation";

async function fetchData(
  team1Id: number,
  team2Id: number,
  date: Date,
): Promise<Simulation> {
  const url = `${API_BASE_URL}/game/${team1Id}/${team2Id}/${date.toISOString().split("T")[0]}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch simulation runs: ${res.status}`);
  }
  return SimulationDto.parse(await res.json());
}

interface GameProps {
  team1Id: number;
  team2Id: number;
  date: Date;
}

export function Game({ team1Id, team2Id, date }: GameProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["game", team1Id, team2Id, date],
    queryFn: () => fetchData(team1Id, team2Id, date),
  });

  if (isLoading) {
    return <Loading message="Loading game..." />;
  }

  if (error || !data) {
    return <ErrorMessage error={error ?? new Error("No data found!")} />;
  }

  const team1Name = data.team1.name;
  const team2Name = data.team2.name;

  const series: AgBarSeriesOptions[] = [
    { type: "bar", xKey: "score", yKey: team1Name, yName: team1Name },
    { type: "bar", xKey: "score", yKey: team2Name, yName: team2Name },
  ];

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        {team1Name} vs {team2Name} • {data.venue}
      </h1>
      <div className="mt-6 flex w-full flex-col items-stretch gap-6 lg:flex-row">
        <div className="flex-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <Histogram
            title="Simulated Matches"
            subtitle=""
            bins={data.bins}
            series={series}
          />
        </div>
        <div className="flex w-fit flex-col gap-3">
          <WinPercentCard
            teamName={team1Name}
            winPercent={data.team1.winPercent * 100}
            simulationsCount={data.team1.simulationsCount}
          />
          <WinPercentCard
            teamName={team2Name}
            winPercent={data.team2.winPercent * 100}
            simulationsCount={data.team2.simulationsCount}
          />
        </div>
      </div>
    </>
  );
}
