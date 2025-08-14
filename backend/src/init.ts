import { PrismaClient, type Prisma } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";
import type { GameRaw, VenueRaw, SimulationRaw } from "~/types/rawData";

const prisma = new PrismaClient();

async function main() {
  const teamNameToId: Record<string, number> = {};

  await new Promise<void>((resolve, reject) => {
    const venues: Prisma.VenueCreateManyInput[] = [];
    fs.createReadStream("raw/venues.csv")
      .pipe(csv())
      .on("data", (data: VenueRaw) => {
        venues.push({
          id: parseInt(data.venue_id),
          name: data.venue_name,
          homeMultiplier: parseFloat(data.home_multiplier),
        });
      })
      .on("end", async () => {
        try {
          await prisma.venue.createMany({ data: venues });
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });

  const teamHomeVenues: Record<string, number> = {};
  const gamesRaw: GameRaw[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream("raw/games.csv")
      .pipe(csv())
      .on("data", (data: GameRaw) => {
        if (teamHomeVenues[data.home_team] === undefined) {
          teamHomeVenues[data.home_team] = parseInt(data.venue_id);
        }
        gamesRaw.push(data);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  await new Promise<void>((resolve, reject) => {
    const teams: Prisma.TeamCreateManyInput[] = [];
    const simulations: Prisma.SimulationCreateManyInput[] = [];
    fs.createReadStream("raw/simulations.csv")
      .pipe(csv())
      .on("data", (data: SimulationRaw) => {
        const venueId = teamHomeVenues[data.team];
        if (venueId === undefined) {
          throw new Error(`Home venue not found for team ${data.team}`);
        }
        const team: Prisma.TeamCreateManyInput = {
          id: parseInt(data.team_id),
          name: data.team,
          venueId,
        };
        if (teamNameToId[team.name] === undefined) {
          teamNameToId[team.name] = team.id;
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
          await prisma.simulation.createMany({ data: simulations });
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });

  await new Promise<void>(async (resolve, reject) => {
    const games: Prisma.GameCreateManyInput[] = [];
    for (const data of gamesRaw) {
      const homeTeamId = teamNameToId[data.home_team];
      const awayTeamId = teamNameToId[data.away_team];
      if (homeTeamId === undefined || awayTeamId === undefined) {
        throw new Error(
          `Team ${data.home_team} or ${data.away_team} not found`,
        );
      }
      games.push({
        homeTeamId,
        awayTeamId,
        date: new Date(data.date),
        venueId: parseInt(data.venue_id),
      });
    }
    try {
      await prisma.game.createMany({ data: games });
      resolve();
    } catch (error) {
      reject(error);
    }
  });

  console.log("Raw data imported successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
