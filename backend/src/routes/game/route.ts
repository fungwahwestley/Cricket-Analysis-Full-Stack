import { Router } from "express";
import { z } from "zod";
import { runSimulation } from "~/utils/runSimulation";
import { paramsSchema, querySchema } from "./schema";
import { prisma } from "~/server/prisma";

const router = Router();

router.get("/game/:team1Id/:team2Id/:date", async (req, res) => {
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

  const { team1Id, team2Id, date } = parsedParams.data;
  const { binSize } = parsedQuery.data;

  try {
    const game = await prisma.game.findFirst({
      select: {
        venueId: true,
        homeTeamId: true,
        awayTeamId: true,
      },
      where: {
        OR: [
          {
            homeTeamId: team1Id,
            awayTeamId: team2Id,
          },
          {
            homeTeamId: team2Id,
            awayTeamId: team1Id,
          },
        ],
        date,
      },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    try {
      const {
        team1,
        team2,
        venue,
        bins,
        team1WinPercent,
        team2WinPercent,
        minSimulations,
      } = await runSimulation(team1Id, team2Id, game.venueId, binSize);

      res.json({
        simulation: {
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
          bins: bins,
        },
        homeTeamId: game.homeTeamId,
        awayTeamId: game.awayTeamId,
        venue: venue ? venue.name : "Any Venue",
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
