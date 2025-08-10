import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/simulate", async (req, res) => {
    const { homeTeamId, awayTeamId, venueId } = req.body;

    const homeTeamRuns = await prisma.simulationResult.findMany({
        where: { teamId: homeTeamId },
        select: { results: true },
    });

    const awayTeamRuns = await prisma.simulationResult.findMany({
        where: { teamId: awayTeamId },
        select: { results: true },
    });

    const venue = await prisma.venue.findUnique({
        where: { id: venueId },
    });

    if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
    }

    const scaledHomeTeamRuns = homeTeamRuns.map((run: { results: number }) => ({
        results: Math.round(run.results * venue.homeMultiplier),
    }));

    const homeWinCount = scaledHomeTeamRuns.filter((homeRun: { results: number }, index: number) => {
        const awayRun = awayTeamRuns[index];
        return awayRun && homeRun.results > awayRun.results;
    }).length;

    const winPercentage = (homeWinCount / scaledHomeTeamRuns.length) * 100;

    res.json({
        homeTeamRuns: scaledHomeTeamRuns,
        awayTeamRuns,
        winPercentage,
    });
});

export default router;
