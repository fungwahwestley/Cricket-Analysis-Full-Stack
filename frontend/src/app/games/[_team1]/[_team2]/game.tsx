"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Histogram } from "~/components/histogram";
import { WinPercentCard } from "~/components/win-percent-card";
import type { AgBarSeriesOptions } from "ag-charts-community";
import { API_BASE_URL } from "~/lib/config";
import { Loading } from "~/components/loading";
import { ErrorMessage } from "~/components/error-message";
import { ApiErrorDto } from "~/contracts/errors";
import { formatDateLong } from "~/lib/utils/formatDate";
import {
  GameWithSimulationDto,
  type GameWithSimulation,
} from "~/contracts/games";
import { GameHeadline } from "~/components/game-headline";
import { GameSimulation } from "~/components/game-simulation";

async function fetchData(
  team1Id: number,
  team2Id: number,
  date: Date,
): Promise<GameWithSimulation> {
  const url = `${API_BASE_URL}/game/${team1Id}/${team2Id}/${date.toISOString().split("T")[0]}`;

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
  return GameWithSimulationDto.parse(await res.json());
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

  const { simulation, homeTeamId, awayTeamId, venue } = data;

  const homeTeamSimulation =
    homeTeamId === team1Id ? simulation.team1 : simulation.team2;
  const awayTeamSimulation =
    awayTeamId === team1Id ? simulation.team1 : simulation.team2;

  return (
    <>
      <GameHeadline
        homeTeamName={homeTeamSimulation.name}
        awayTeamName={awayTeamSimulation.name}
        venue={venue}
        date={date}
      />
      <GameSimulation
        homeTeamSimulation={homeTeamSimulation}
        awayTeamSimulation={awayTeamSimulation}
        bins={simulation.bins}
      />
    </>
  );
}
