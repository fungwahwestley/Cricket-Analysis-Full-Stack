"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Combobox } from "~/components/ui/combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Search } from "lucide-react";

const teams = [
  { value: "team-1", label: "Mumbai Indians" },
  { value: "team-2", label: "Chennai Super Kings" },
  { value: "team-3", label: "Royal Challengers Bangalore" },
  { value: "team-4", label: "Kolkata Knight Riders" },
  { value: "team-5", label: "Delhi Capitals" },
  { value: "team-6", label: "Punjab Kings" },
  { value: "team-7", label: "Rajasthan Royals" },
  { value: "team-8", label: "Sunrisers Hyderabad" },
];

const venues = [
  { value: "venue-eden", label: "Eden Gardens" },
  { value: "venue-wankhede", label: "Wankhede Stadium" },
];

export function Header() {
  const [team1, setTeam1] = useState<string | undefined>();
  const [team2, setTeam2] = useState<string | undefined>();
  const [venue, setVenue] = useState<string | undefined>();

  return (
    <div className="flex flex-col items-center pt-12">
      <Tabs defaultValue="custom-matchups" className="w-full max-w-4xl">
        <TabsList className="mx-auto flex w-fit gap-8 bg-transparent p-0">
          <TabsTrigger
            value="past-games"
            className="text-muted-foreground rounded-none bg-transparent pb-2 text-lg data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            <span className="mr-2">🏠</span> Past Games
          </TabsTrigger>
          <TabsTrigger
            value="custom-matchups"
            className="text-muted-foreground rounded-none bg-transparent pb-2 text-lg data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            <span className="mr-2">🎈</span> Custom Matchups
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="past-games"
          className="mt-8 rounded-lg bg-white p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold">Past Games</h2>
          <p>Here you can find past games.</p>
        </TabsContent>

        <TabsContent value="custom-matchups" className="mt-8">
          <div className="mx-auto flex max-w-3xl items-center justify-between rounded-full bg-white p-2 shadow-lg">
            <div className="flex flex-grow items-center divide-x divide-gray-200">
              <div className="px-9 py-2">
                <label className="text-sm font-bold" htmlFor="team1">
                  Team 1
                </label>
                <Combobox
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
                  options={teams}
                  value={team2}
                  onValueChange={setTeam2}
                  placeholder="Choose team"
                  searchPlaceholder="Search teams..."
                  emptyMessage="No teams found."
                  variant="filter"
                />
              </div>

              <div className="px-9 py-2">
                <div className="text-sm font-bold">Venue</div>
                <Combobox
                  options={venues}
                  value={venue}
                  onValueChange={setVenue}
                  placeholder="Choose venue"
                  searchPlaceholder="Search venues..."
                  emptyMessage="No venues found."
                  variant="filter"
                />
              </div>
            </div>

            <Button
              size="icon"
              className="h-14 w-14 flex-shrink-0 rounded-full bg-pink-500 text-white hover:bg-pink-600"
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
