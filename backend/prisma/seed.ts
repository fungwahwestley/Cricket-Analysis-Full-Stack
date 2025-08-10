import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function main() {
    await new Promise<void>((resolve, reject) => {
        const venues = [];
        fs.createReadStream("data/venues.csv")
            .pipe(csv())
            .on("data", (data) => venues.push(data))
            .on("end", async () => {
                try {
                    await prisma.venue.createMany({
                        data: venues.map(v => ({ id: parseInt(v.venue_id), name: v.venue_name, homeMultiplier: parseFloat(v.home_multiplier) })),
                    });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .on("error", reject);
    });

    await new Promise<void>((resolve, reject) => {
        const teams = [];
        const simulations = [];
        fs.createReadStream("data/simulations.csv")
            .pipe(csv())
            .on("data", (data) => {
                const team = { id: parseInt(data.team_id), name: data.team };
                if (!teams.find(t => t.name === team.name)) {
                    teams.push(team);
                }
                simulations.push({
                    teamId: parseInt(data.team_id),
                    simulationRun: parseInt(data.simulation_run),
                    results: parseInt(data.results),
                });
            })
            .on("end", async () => {
                try {
                    await prisma.team.createMany({ data: teams });
                    await prisma.simulationResult.createMany({ data: simulations });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .on("error", reject);
    });

    await new Promise<void>((resolve, reject) => {
        const games = [];
        fs.createReadStream("data/games.csv")
            .pipe(csv())
            .on("data", (data) => games.push(data))
            .on("end", async () => {
                try {
                    const teamNameToId = (await prisma.team.findMany()).reduce((acc, team) => {
                        acc[team.name] = team.id;
                        return acc;
                    }, {});
                    await prisma.game.createMany({
                        data: games.map(g => ({
                            homeTeamId: teamNameToId[g.home_team],
                            awayTeamId: teamNameToId[g.away_team],
                            date: new Date(g.date),
                            venueId: parseInt(g.venue_id),
                        })),
                    });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .on("error", reject);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
