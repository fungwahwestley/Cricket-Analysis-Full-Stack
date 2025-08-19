"use client";

import React from "react";
import { cn } from "~/lib/utils/cn";

interface WinPercentCardProps {
  teamName: string;
  winPercent: number;
  simulationsCount?: number;
  color?: string;
}

export function WinPercentCard({
  teamName,
  winPercent,
  simulationsCount,
  color = "text-blue-600",
}: WinPercentCardProps) {
  const formattedPercent = Number.isFinite(winPercent)
    ? Math.round(winPercent)
    : 0;

  return (
    <div className="inline-block rounded-xl border border-zinc-200 bg-white px-6 py-8 shadow-sm md:px-8 md:py-16">
      <h2 className="text-xl font-semibold whitespace-nowrap text-zinc-900 md:text-2xl">
        {teamName} Win %
      </h2>
      <div className={cn("mt-4 text-6xl font-extrabold tracking-tight md:text-7xl", color)}>
        {formattedPercent}%
      </div>
      {simulationsCount && (
        <div className="mt-4 space-y-1 text-sm text-zinc-600">
          {simulationsCount ? (
            <div>Based on {simulationsCount} simulations</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
