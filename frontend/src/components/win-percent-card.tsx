"use client";

import React from "react";

interface WinPercentCardProps {
  teamName: string;
  winPercent: number;
  simulationsCount?: number;
}

export function WinPercentCard({
  teamName,
  winPercent,
  simulationsCount,
}: WinPercentCardProps) {
  const formattedPercent = Number.isFinite(winPercent)
    ? Math.round(winPercent)
    : 0;

  return (
    <div className="inline-block rounded-xl border border-zinc-200 bg-white px-8 py-16 shadow-sm">
      <h2 className="text-2xl font-semibold whitespace-nowrap text-zinc-900">
        {teamName} Win %
      </h2>
      <div className="mt-4 text-7xl font-extrabold tracking-tight text-blue-600">
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
