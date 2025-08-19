"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { API_BASE_URL } from "~/lib/config";
import { Loading } from "~/components/loading";
import { ErrorMessage } from "~/components/error-message";
import { ApiErrorDto } from "~/contracts/errors";
import { GamesDto, type Games } from "~/contracts/games";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Game as GameComponent } from "~/app/games/[_team1]/[_team2]/game";
import type { Game } from "~/contracts/atoms";
import { formatDateLong, formatDateShort } from "~/lib/utils/formatDate";

async function fetchData(team1Id: number, team2Id: number): Promise<Games> {
  const url = `${API_BASE_URL}/games/${team1Id}/${team2Id}`;

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
  return GamesDto.parse(await res.json());
}

interface GamesProps {
  team1Id: number;
  team2Id: number;
}

export function Games({ team1Id, team2Id }: GamesProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["games", team1Id, team2Id],
    queryFn: () => fetchData(team1Id, team2Id),
  });

  const [_selectedGame, setSelectedGame] = React.useState<Game | null>(null);

  if (isLoading) {
    return <Loading message="Loading games..." />;
  }

  if (error || !data) {
    return <ErrorMessage error={error ?? new Error("No data found!")} />;
  }

  const { team1Name, team2Name, games } = data;

  const selectedGame = _selectedGame ?? games[0] ?? null;

  return (
    <div className="flex w-full flex-col items-stretch gap-6 md:flex-row md:items-start">
      <div className="order-2 w-full shrink-0 md:order-1 md:max-w-sm">
        <div className="flex flex-col gap-1">
          <div className="justify-center-center flex flex-col items-start px-2 py-2">
            <h2 className="text-base font-medium leading-[16px]">
              {games.length > 0 ? `${team1Name} vs ${team2Name}` : "Games"}
            </h2>
          </div>
          <Command className="bg-card text-card-foreground rounded-lg border">
            <CommandInput placeholder="Search games..." />
            <CommandList className="max-h-[70vh]">
              <CommandEmpty>No games found.</CommandEmpty>
              {games.map((game) => {
                const isSelected = selectedGame?.id === game.id;
                return (
                  <CommandItem
                    key={game.id}
                    value={`${game.homeTeamName} vs ${game.awayTeamName} ${game.venueName} ${formatDateLong(game.date)}`}
                    aria-selected={isSelected}
                    onSelect={() => setSelectedGame(game)}
                    className={`group hover:bg-accent/60 flex items-start gap-3 rounded-none border-b px-3 py-6 ${isSelected ? "bg-accent/50" : ""}`}
                  >
                    <div className="text-muted-foreground flex size-9 items-center justify-center rounded-md border bg-zinc-50 text-center text-xs text-[11px] leading-tight font-semibold">
                      <div className="whitespace-pre-line">
                        {formatDateShort(game.date).split(" ").join("\n")}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm leading-[18px] font-medium">
                          {game.homeTeamName} vs {game.awayTeamName}
                        </p>
                      </div>
                      <div className="text-muted-foreground mt-0.5 flex min-w-0 items-center gap-2 text-xs">
                        <span className="shrink-0">
                          {formatDateLong(game.date)}
                        </span>
                        <span className="text-muted-foreground/50 shrink-0">
                          •
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {game.venueName}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </div>
      </div>

      {selectedGame !== null ? (
        <div className="bg-card/40 order-1 mt-2 min-h-[320px] flex-1 rounded-lg border px-6 py-6 md:order-2">
          <div className="text-muted-foreground text-sm">
            <GameComponent
              team1Id={team1Id}
              team2Id={team2Id}
              date={selectedGame.date}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
