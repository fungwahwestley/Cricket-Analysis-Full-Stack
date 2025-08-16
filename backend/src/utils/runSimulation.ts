import { prisma } from "~/server/prisma";

export type Bin = { score: number; [key: string]: number };

export const runSimulation = async (
  team1Id: number,
  team2Id: number,
  venueId?: number,
  binSize = 10,
) => {
  const [team1, team2, venue] = await Promise.all([
    prisma.team.findUnique({
      select: { name: true, venueId: true },
      where: { id: team1Id },
    }),
    prisma.team.findUnique({
      select: { name: true, venueId: true },
      where: { id: team2Id },
    }),
    venueId != null
      ? prisma.venue.findUnique({
          select: { name: true, homeMultiplier: true },
          where: { id: venueId },
        })
      : Promise.resolve(null),
  ]);

  if (!team1 || !team2) {
    throw new Error("Team not found");
  }

  const [team1Simulations, team2Simulations] = await Promise.all([
    prisma.simulation.findMany({ where: { teamId: team1Id } }),
    prisma.simulation.findMany({ where: { teamId: team2Id } }),
  ]);

  const team1Multiplier =
    venue && team1.venueId === venueId ? venue.homeMultiplier : 1;
  const team2Multiplier =
    venue && team2.venueId === venueId ? venue.homeMultiplier : 1;

  const team1Scores = team1Simulations.map((s) => s.results * team1Multiplier);
  const team2Scores = team2Simulations.map((s) => s.results * team2Multiplier);

  let minScore = Infinity;
  let maxScore = -Infinity;

  const binCounts: Record<number, Record<string, number>> = {};
  const bins: Bin[] = [];

  for (const [teamName, teamScores] of [
    [team1.name, team1Scores],
    [team2.name, team2Scores],
  ] as const) {
    for (const score of teamScores) {
      if (score == null) continue;

      if (score < minScore) minScore = score;
      if (score > maxScore) maxScore = score;

      // Get the previous multiple of binSize (10)
      const binKey = Math.floor(score / binSize) * binSize;

      let bin = binCounts[binKey];
      if (!bin) {
        bin = {
          [team1.name]: 0,
          [team2.name]: 0,
        };
        binCounts[binKey] = bin;
      }

      bin[teamName]!++;
    }
  }

  if (minScore !== Infinity && maxScore !== -Infinity) {
    for (
      let i = Math.floor(minScore / binSize) * binSize; // Min bin
      i <= maxScore;
      i += binSize
    ) {
      bins.push({
        score: i,
        ...(binCounts[i] ?? {
          [team1.name]: 0,
          [team2.name]: 0,
        }),
      });
    }
  }

  const minSimulations = Math.min(team1Scores.length, team2Scores.length);
  let team1Wins = 0;
  let team2Wins = 0;
  for (let i = 0; i < minSimulations; i++) {
    const score1 = team1Scores[i];
    const score2 = team2Scores[i];
    if (score1 != null && score2 != null) {
      if (score1 > score2) {
        team1Wins++;
      } else if (score2 > score1) {
        team2Wins++;
      }
    }
  }

  // May not add up to 1 if equal runs
  const team1WinPercent = team1Wins / minSimulations;
  const team2WinPercent = team2Wins / minSimulations;

  return {
    team1,
    team2,
    venue,
    bins,
    team1WinPercent: Math.round(team1WinPercent * 100) / 100,
    team2WinPercent: Math.round(team2WinPercent * 100) / 100,
    minSimulations,
  };
};
