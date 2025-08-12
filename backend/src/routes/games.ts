import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      venue: true,
    },
  });
  res.json(games);
});

export default router;
