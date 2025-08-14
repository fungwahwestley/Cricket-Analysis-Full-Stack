import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import * as z from "zod";

const prisma = new PrismaClient();
const router = Router();

type Bin = { score: number; [key: string]: number };

const paramsSchema = z.object({
  team1Id: z.coerce.number().int().min(0),
  team2Id: z.coerce.number().int().min(0),
  venueId: z.coerce.number().int().min(0).optional(),
});

const querySchema = z.object({
  binSize: z.coerce.number().int().positive().max(1000).default(10),
});

router.get("/matchup/:team1Id/:team2Id/:venueId?", async (req, res) => {
  const parsedParams = paramsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid route params",
      details: z.treeifyError(parsedParams.error),
    });
  }

  const parsedQuery = querySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({
      error: "Invalid query params",
      details: z.treeifyError(parsedQuery.error),
    });
  }

  const { team1Id, team2Id, venueId } = parsedParams.data;
  const { binSize } = parsedQuery.data;

  const [team1, team2, venue] = await Promise.all([
    prisma.team.findUnique({
      where: { id: team1Id },
      include: { venue: { select: { id: true } } },
    }),
    prisma.team.findUnique({
      where: { id: team2Id },
      include: { venue: { select: { id: true } } },
    }),
    venueId != null
      ? prisma.venue.findUnique({
          where: { id: venueId },
        })
      : Promise.resolve(null),
  ]);

  if (!team1 || !team2) {
    return res.status(404).json({ error: "Team not found" });
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

  const binCounts: Record<number, { [key: string]: number }> = {};
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

  res.json({
    team1: {
      name: team1.name,
      winPercent: team1WinPercent,
      simulationsCount: minSimulations,
    },
    team2: {
      name: team2.name,
      winPercent: team2WinPercent,
      simulationsCount: minSimulations,
    },
    venue: venue ? venue.name : "Unknown Venue",
    histogram: {
      data: bins,
      series: [
        { type: "bar", xKey: "runs", yKey: team1.name, yName: team1.name },
        { type: "bar", xKey: "runs", yKey: team2.name, yName: team2.name },
      ],
    },
  });
});

export default router;
