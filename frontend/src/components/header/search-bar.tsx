"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Combobox } from "~/components/ui/combobox";
import { Check, House, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "~/lib/config";
import { FiltersDto, type Filters } from "~/contracts/filters";
import { ApiErrorDto } from "~/contracts/errors";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "../error-message";
import { cn } from "~/lib/utils/cn";

interface SearchBarProps {
  type: "past-games" | "custom-matchups";
}

async function fetchData(): Promise<Filters> {
  const url = `${API_BASE_URL}/filters`;

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
  return FiltersDto.parse(await res.json());
}

export function SearchBar({ type }: SearchBarProps) {
  const [team1Id, setTeam1Id] = useState<string | undefined>();
  const [team2Id, setTeam2Id] = useState<string | undefined>();
  const [venueId, setVenueId] = useState<string | undefined>();
  // const [date, setDate] = useState<Date | undefined>(new Date());
  const router = useRouter();

  const { data, error } = useQuery({
    queryKey: ["filters"],
    queryFn: () => fetchData(),
  });

  const handleSearch = useCallback(() => {
    if (team1Id === undefined || team2Id === undefined) {
      return;
    }

    let url;

    if (type === "past-games") {
      // if (!date) {
      //   return;
      // }
      // url = `/game/${team1}/${team2}/${date.toISOString().split("T")[0]}`;
      url = `/games/${team1Id}/${team2Id}`;
    } else if (type === "custom-matchups") {
      url = `/matchup/${team1Id}/${team2Id}/${venueId ?? ""}`;
    }

    if (url) {
      router.push(url);
    }
  }, [type, team1Id, team2Id, venueId, router]);

  const [team1VenueId, team2VenueId] = useMemo(() => {
    if (!data) {
      return [undefined, undefined];
    }
    const team1 = data.teams.find((team) => String(team.id) === team1Id);
    const team2 = data.teams.find((team) => String(team.id) === team2Id);
    return [team1?.venueId, team2?.venueId];
  }, [data, team1Id, team2Id]);

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

  const HouseIcon = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      ({ value }: { value: number }) => {
        const isSelectedTeam = value == team1VenueId || value == team2VenueId;
        return value === Number(venueId) || !isSelectedTeam ? (
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              value === Number(venueId) ? "opacity-100" : "opacity-0",
            )}
          />
        ) : isSelectedTeam ? (
          <span className="mr-2 flex h-4 w-4 text-zinc-500">
            <span className="mr-[0.5px] text-[17px] leading-[17px] font-semibold">
              {value == team1VenueId ? "¹" : "²"}
            </span>
            <span>
              <House className="h-4 w-4" />
            </span>
          </span>
        ) : null;
      },
    [team1VenueId, team2VenueId, venueId],
  );

  if (error) {
    return <ErrorMessage error={error ?? new Error("No data found!")} />;
  }

  return (
    <div className="mx-auto flex items-center justify-between rounded-full bg-white p-2 shadow-lg">
      <div className="flex flex-grow items-center divide-x divide-gray-200">
        <div className="px-9 py-2">
          <label
            className="flex items-center justify-between text-sm font-bold"
            htmlFor="team1"
          >
            <span>Team 1</span>
            {team1VenueId && type === "custom-matchups" ? (
              <button
                className="inline-block h-[14px] cursor-pointer items-center"
                onClick={() =>
                  setVenueId(team1VenueId ? String(team1VenueId) : undefined)
                }
              >
                <House className="h-4 w-4 text-xs text-gray-500 hover:text-gray-400" />
              </button>
            ) : null}
          </label>
          <Combobox
            id="team1"
            options={teams}
            value={team1Id}
            onValueChange={setTeam1Id}
            placeholder="Choose team"
            searchPlaceholder="Search teams..."
            emptyMessage="No teams found."
            variant="filter"
          />
        </div>

        <div className="px-9 py-2">
          <label
            className="flex items-center justify-between text-sm font-bold"
            htmlFor="team2"
          >
            <span>Team 2</span>
            {team2VenueId && type === "custom-matchups" ? (
              <button
                className="inline-block h-[14px] cursor-pointer items-center"
                onClick={() =>
                  setVenueId(team2VenueId ? String(team2VenueId) : undefined)
                }
              >
                <House className="h-4 w-4 text-xs text-gray-500 hover:text-gray-400" />
              </button>
            ) : null}
          </label>
          <Combobox
            id="team2"
            options={teams}
            value={team2Id}
            onValueChange={setTeam2Id}
            placeholder="Choose team"
            searchPlaceholder="Search teams..."
            emptyMessage="No teams found."
            variant="filter"
          />
        </div>

        {/* {type === "past-games" && (
          <div className="px-9 py-2">
            <label className="text-sm font-bold" htmlFor="date">
              Date
            </label>
            <DatePicker id="date" date={date} setDate={setDate} />
          </div>
        )} */}

        {type === "custom-matchups" && (
          <div className="px-9 py-2">
            <label className="text-sm font-bold" htmlFor="venue">
              Venue
            </label>
            <Combobox
              id="venue"
              options={venues}
              value={venueId}
              onValueChange={setVenueId}
              placeholder="Choose venue"
              searchPlaceholder="Search venues..."
              emptyMessage="No venues found."
              variant="filter"
              SpecialIconComponent={HouseIcon}
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
