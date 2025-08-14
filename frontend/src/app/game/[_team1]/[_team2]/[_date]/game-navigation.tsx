import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type GameNavigationProps = {
  team1Id: number;
  team2Id: number;
  previousGame?: Date;
  nextGame?: Date;
};

export function GameNavigation({
  team1Id,
  team2Id,
  previousGame,
  nextGame,
}: GameNavigationProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        {previousGame ? (
          <Link
            href={`/game/${team1Id}/${team2Id}/${previousGame.getTime()}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Previous Game
          </Link>
        ) : (
          <div />
        )}
      </div>
      <div>
        {nextGame ? (
          <Link
            href={`/game/${team1Id}/${team2Id}/${nextGame.getTime()}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Next Game
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
