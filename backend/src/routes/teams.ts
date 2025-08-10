import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/teams", async (req, res) => {
    const teams = await prisma.team.findMany();
    res.json(teams);
});

export default router;
