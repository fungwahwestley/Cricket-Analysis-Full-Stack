"use client";

import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { Combobox } from "~/components/ui/combobox";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { DatePicker } from "~/components/ui/date-picker";

const teams = [
  { value: 0, label: "Sunrisers Hyderabad" },
  { value: 1, label: "Mumbai Indians" },
  { value: 2, label: "Chennai Super Kings" },
  { value: 3, label: "Royal Challengers Bangalore" },
  { value: 4, label: "Kolkata Knight Riders" },
  { value: 5, label: "Delhi Capitals" },
  { value: 6, label: "Punjab Kings" },
  { value: 7, label: "Rajasthan Royals" },
];

const venues = [
  { value: 0, label: "Eden Gardens" },
  { value: 1, label: "Wankhede Stadium" },
];

interface SearchBarProps {
  type: "past-games" | "custom-matchups";
}

export function SearchBar({ type }: SearchBarProps) {
  const [team1, setTeam1] = useState<string | undefined>();
  const [team2, setTeam2] = useState<string | undefined>();
  const [venue, setVenue] = useState<string | undefined>();
  const router = useRouter();

  const handleSearch = useCallback(() => {
    if (team1 !== undefined && team2 !== undefined) {
      let url = `/matchup/${team1}/${team2}`;
      if (venue !== undefined) {
        url = `${url}/${venue}`;
      }
      router.push(url);
    }
  }, [team1, team2, venue]);

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
            <DatePicker id="date" />
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
