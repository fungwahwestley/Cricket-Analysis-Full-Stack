import { Router } from "express";
import { z } from "zod";
import { paramsSchema } from "./schema";
import { prisma } from "~/server/prisma";

const router = Router();

router.get("/games/:team1Id/:team2Id", async (req, res) => {
  const parsedParams = paramsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid route params",
      details: z.treeifyError(parsedParams.error),
    });
  }

  const { team1Id, team2Id } = parsedParams.data;

  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        date: true,
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
        venue: { select: { id: true, name: true } },
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
      },
      orderBy: {
        date: "desc",
      },
    });

    let team1Name = "";
    let team2Name = "";

    const latestGame = games[0];
    if (latestGame?.homeTeam.id === team1Id) {
      team1Name = latestGame.homeTeam.name;
      team2Name = latestGame.awayTeam.name;
    } else if (latestGame?.awayTeam.id === team1Id) {
      team1Name = latestGame.awayTeam.name;
      team2Name = latestGame.homeTeam.name;
    }

    res.json({ team1Name, team2Name, games });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
