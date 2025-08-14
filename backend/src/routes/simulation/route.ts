import { Router } from "express";
import { z } from "zod";
import { paramsSchema, querySchema } from "./schema";
import { runSimulation } from "~/utils/runSimulation";

const router = Router();

router.get("/simulation/:team1Id/:team2Id{/:venueId}", async (req, res) => {
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

  try {
    const {
      team1,
      team2,
      venue,
      bins,
      team1WinPercent,
      team2WinPercent,
      minSimulations,
    } = await runSimulation(team1Id, team2Id, venueId, binSize);

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
      venue: venue ? venue.name : "Any Venue",
      bins: bins,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
