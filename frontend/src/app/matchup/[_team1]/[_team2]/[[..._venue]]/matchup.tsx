"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Histogram } from "~/components/histogram";
import { WinPercentCard } from "~/components/win-percent-card";
import type { AgBarSeriesOptions } from "ag-charts-community";
import { API_BASE_URL } from "~/lib/config";
import { Loading } from "~/components/loading";
import { ErrorMessage } from "~/components/error-message";
import { SimulationDto, type Simulation } from "~/contracts/simulations";
import { ApiErrorDto } from "~/contracts/errors";
import { GameHeadline } from "~/components/game-headline";
import { GameSimulation } from "~/components/game-simulation";

async function fetchData(
  team1Id: number,
  team2Id: number,
  venueId?: number,
): Promise<Simulation> {
  const url = `${API_BASE_URL}/simulation/${team1Id}/${team2Id}/${venueId ?? ""}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const parsed = ApiErrorDto.safeParse(await res.json());
    if (parsed.success) {
      throw new Error(parsed.data.error);
    }
    throw new Error(`Request failed with status ${res.status}`);
  }
  return SimulationDto.parse(await res.json());
}

interface MatchupProps {
  team1Id: number;
  team2Id: number;
  venueId?: number;
}

export function Matchup({ team1Id, team2Id, venueId }: MatchupProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["simulation", team1Id, team2Id, venueId ?? null],
    queryFn: () => fetchData(team1Id, team2Id, venueId),
  });

  if (isLoading) {
    return <Loading message="Loading simulation..." />;
  }

  if (error || !data) {
    return <ErrorMessage error={error ?? new Error("No data found!")} />;
  }

  const homeTeamSimulation =
    data.homeTeamId === team1Id ? data.team1 : data.team2;
  const awayTeamSimulation =
    data.awayTeamId === team1Id ? data.team1 : data.team2;

  return (
    <>
      <GameHeadline
        homeTeamName={homeTeamSimulation.name}
        awayTeamName={awayTeamSimulation.name}
        venue={data.venue}
      />
      <GameSimulation
        homeTeamSimulation={homeTeamSimulation}
        awayTeamSimulation={awayTeamSimulation}
        bins={data.bins}
      />
    </>
  );
}
