/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Simulation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_venueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Simulation" DROP CONSTRAINT "Simulation_teamId_fkey";

-- DropTable
DROP TABLE "public"."Game";

-- DropTable
DROP TABLE "public"."Simulation";

-- DropTable
DROP TABLE "public"."Team";

-- DropTable
DROP TABLE "public"."Venue";

-- CreateTable
CREATE TABLE "public"."venue" (
    "venue_id" INTEGER NOT NULL,
    "venue_name" TEXT NOT NULL,
    "home_multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("venue_id")
);

-- CreateTable
CREATE TABLE "public"."team" (
    "team_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "public"."simulation" (
    "id" SERIAL NOT NULL,
    "simulation_run" INTEGER NOT NULL,
    "results" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "simulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_name_key" ON "public"."team"("name");

-- AddForeignKey
ALTER TABLE "public"."simulation" ADD CONSTRAINT "simulation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game" ADD CONSTRAINT "game_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game" ADD CONSTRAINT "game_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game" ADD CONSTRAINT "game_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venue"("venue_id") ON DELETE RESTRICT ON UPDATE CASCADE;
