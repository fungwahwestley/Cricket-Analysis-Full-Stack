import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SearchBar } from "./search-bar";

export function Header() {
  return (
    <div className="flex flex-col items-center pt-12">
      <Tabs defaultValue="past-games" className="w-full">
        <TabsList className="mx-auto flex w-fit gap-8 bg-transparent p-0">
          <TabsTrigger
            value="past-games"
            className="text-muted-foreground cursor-pointer rounded-none bg-transparent pb-2 text-lg data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            <span className="mr-2">🏏</span> Past Games
          </TabsTrigger>
          <TabsTrigger
            value="custom-matchups"
            className="text-muted-foreground cursor-pointer rounded-none bg-transparent pb-2 text-lg data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            <span className="mr-2">⚔️</span> Custom Matchups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="past-games" className="mt-8">
          <SearchBar type="past-games" />
        </TabsContent>

        <TabsContent value="custom-matchups" className="mt-8">
          <SearchBar type="custom-matchups" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
