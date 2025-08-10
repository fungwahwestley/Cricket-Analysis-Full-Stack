import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/venues", async (req, res) => {
    const venues = await prisma.venue.findMany();
    res.json(venues);
});

export default router;
