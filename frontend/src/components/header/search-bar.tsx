"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Combobox } from "~/components/ui/combobox";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { DatePicker } from "~/components/ui/date-picker";
import { API_BASE_URL } from "~/lib/config";
import { FiltersDto, type Filters } from "~/contracts/filters";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "../error-message";

interface SearchBarProps {
  type: "past-games" | "custom-matchups";
}

async function fetchData(): Promise<Filters> {
  const url = `${API_BASE_URL}/filters`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch search filters: ${res.status}`);
  }
  return FiltersDto.parse(await res.json());
}

export function SearchBar({ type }: SearchBarProps) {
  const [team1, setTeam1] = useState<string | undefined>();
  const [team2, setTeam2] = useState<string | undefined>();
  const [venue, setVenue] = useState<string | undefined>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const router = useRouter();

  const { data, error } = useQuery({
    queryKey: ["filters"],
    queryFn: () => fetchData(),
  });

  const handleSearch = useCallback(() => {
    if (team1 === undefined || team2 === undefined) {
      return;
    }

    let url;

    if (type === "past-games") {
      if (!date) {
        return;
      }
      url = `/game/${team1}/${team2}/${+date / 1000}`;
    } else if (type === "custom-matchups") {
      url = `/matchup/${team1}/${team2}/${venue ?? ""}`;
    }

    if (url) {
      router.push(url);
    }
  }, [type, team1, team2, venue, router, date]);

  const teams = useMemo(
    () =>
      data?.teams.map((team) => ({
        value: team.id,
        label: team.name,
      })) ?? [],
    [data],
  );

  const venues = useMemo(
    () =>
      data?.venues.map((venue) => ({
        value: venue.id,
        label: venue.name,
      })) ?? [],
    [data],
  );

  if (error) {
    return <ErrorMessage error={error ?? new Error("No data found!")} />;
  }

  return (
    <div className="mx-auto flex items-center justify-between rounded-full bg-white p-2 shadow-lg">
      <div className="flex flex-grow items-center divide-x divide-gray-200">
        <div className="px-9 py-2">
          <label className="text-sm font-bold" htmlFor="team1">
            Team 1
          </label>
          <Combobox
            id="team1"
            options={teams}
            value={team1}
            onValueChange={setTeam1}
            placeholder="Choose team"
            searchPlaceholder="Search teams..."
            emptyMessage="No teams found."
            variant="filter"
          />
        </div>

        <div className="px-9 py-2">
          <label className="text-sm font-bold" htmlFor="team2">
            Team 2
          </label>
          <Combobox
            id="team2"
            options={teams}
            value={team2}
            onValueChange={setTeam2}
            placeholder="Choose team"
            searchPlaceholder="Search teams..."
            emptyMessage="No teams found."
            variant="filter"
          />
        </div>

        {type === "past-games" && (
          <div className="px-9 py-2">
            <label className="text-sm font-bold" htmlFor="date">
              Date
            </label>
            <DatePicker id="date" date={date} setDate={setDate} />
          </div>
        )}

        {type === "custom-matchups" && (
          <div className="px-9 py-2">
            <label className="text-sm font-bold" htmlFor="venue">
              Venue
            </label>
            <Combobox
              id="venue"
              options={venues}
              value={venue}
              onValueChange={setVenue}
              placeholder="Choose venue"
              searchPlaceholder="Search venues..."
              emptyMessage="No venues found."
              variant="filter"
            />
          </div>
        )}
      </div>

      <Button
        size="icon"
        className="h-14 w-14 flex-shrink-0 cursor-pointer rounded-full bg-blue-600 text-white hover:bg-blue-500"
        onClick={handleSearch}
      >
        <Search className="h-6 w-6" />
      </Button>
    </div>
  );
}
