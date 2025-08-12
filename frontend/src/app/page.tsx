import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Search } from "lucide-react";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 pt-12">
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
              <div className="px-6 py-2">
                <label className="text-sm font-bold" htmlFor="team1">
                  Team 1
                </label>
                <Input
                  id="team1"
                  placeholder="Search teams"
                  className="h-auto border-none p-0 text-base shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                />
              </div>

              <div className="px-6 py-2">
                <label className="text-sm font-bold" htmlFor="team2">
                  Team 2
                </label>
                <Input
                  id="team2"
                  placeholder="Search teams"
                  className="h-auto border-none p-0 text-base shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                />
              </div>

              <div className="px-6 py-2">
                <div className="text-sm font-bold">Venue</div>
                <Select>
                  <SelectTrigger className="h-auto border-none p-0 text-base shadow-none focus:ring-0 data-[placeholder]:text-gray-400">
                    <SelectValue placeholder="Choose venue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venue1">Eden Gardens</SelectItem>
                    <SelectItem value="venue2">Wankhede Stadium</SelectItem>
                  </SelectContent>
                </Select>
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
    </main>
  );
}
