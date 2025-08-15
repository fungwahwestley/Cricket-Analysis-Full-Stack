import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SearchBar } from "./search-bar";

export function Header() {
  return (
    <div className="flex flex-col items-center pt-12">
      <Tabs defaultValue="past-games" className="w-full">
        <TabsList className="mx-auto flex w-fit gap-6 bg-transparent p-0">
          <TabsTrigger
            value="past-games"
            className="text-muted-foreground cursor-pointer rounded-none bg-transparent pb-2 text-lg decoration-[1.5px] underline-offset-6 data-[state=active]:text-black data-[state=active]:underline data-[state=active]:shadow-none"
          >
            Past Games
          </TabsTrigger>
          <TabsTrigger
            value="custom-matchups"
            className="text-muted-foreground cursor-pointer rounded-none bg-transparent pb-2 text-lg decoration-[1.5px] underline-offset-6 data-[state=active]:text-black data-[state=active]:underline data-[state=active]:shadow-none"
          >
            Custom Matchups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="past-games" className="mt-4">
          <SearchBar type="past-games" />
        </TabsContent>

        <TabsContent value="custom-matchups" className="mt-4">
          <SearchBar type="custom-matchups" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
