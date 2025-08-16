import React from "react";
import { formatDateLong } from "~/lib/utils/formatDate";

interface GameHeadlineProps {
  homeTeamName: string;
  awayTeamName: string;
  venue: string;
  date?: Date;
}

export function GameHeadline({
  homeTeamName,
  awayTeamName,
  venue,
  date,
}: GameHeadlineProps) {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        {homeTeamName} vs {awayTeamName}
      </h1>
      <h2 className="text-xl font-medium text-zinc-500">
        {venue} - {homeTeamName}
      </h2>
      {date ? (
        <p className="font-base mt-1 text-[14px] leading-[16px]">
          {formatDateLong(date)}
        </p>
      ) : null}
    </>
  );
}
