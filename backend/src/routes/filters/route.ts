import { Router } from "express";
import { prisma } from "~/server/prisma";

const router = Router();

router.get("/filters", async (req, res) => {
  try {
    const [teams, venues] = await Promise.all([
      prisma.team.findMany({
        select: { id: true, name: true },
      }),
      prisma.venue.findMany({
        select: { id: true, name: true },
      }),
    ]);

    res.json({ teams, venues });
  } catch (error) {
    res.status(500).json({ error: "Could not connect to the database" });
  }
});

export default router;
