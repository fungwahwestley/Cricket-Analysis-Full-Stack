"use client";
"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Histogram } from "~/components/histogram";
import { WinPercentCard } from "~/components/win-percent-card";
import type { AgBarSeriesOptions } from "ag-charts-community";
import { API_BASE_URL } from "~/lib/config";
import { Loading } from "~/components/loading";
import { ErrorMessage } from "~/components/error-message";

interface MatchupClientProps {
  team1Id: number;
  team2Id: number;
  venueId?: number;
}

interface MatchupResponse {
  team1: { name: string; winPercent: number; simulationsCount: number };
  team2: { name: string; winPercent: number; simulationsCount: number };
  venue: string;
  histogram: {
    data: Array<Record<string, number>>;
    series?: Array<{ type: string; xKey: string; yKey: string; yName: string }>;
  };
}

async function fetchData(
  team1Id: number,
  team2Id: number,
  venueId?: number,
): Promise<MatchupResponse> {
  const url = `${API_BASE_URL}/simulation/${team1Id}/${team2Id}/${venueId ?? ""}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch simulation runs: ${res.status}`);
  }
  return (await res.json()) as MatchupResponse;
}

export function MatchupClient({
  team1Id,
  team2Id,
  venueId,
}: MatchupClientProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["simulation", team1Id, team2Id, venueId ?? null],
    queryFn: () => fetchData(team1Id, team2Id, venueId),
  });

  if (isLoading) {
    return <Loading />;
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
            title="Percentage of Matches"
            subtitle=""
            data={data.histogram.data}
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
