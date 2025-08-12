/*
  Warnings:

  - You are about to drop the `SimulationResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SimulationResult" DROP CONSTRAINT "SimulationResult_teamId_fkey";

-- DropTable
DROP TABLE "public"."SimulationResult";

-- CreateTable
CREATE TABLE "public"."Simulation" (
    "id" SERIAL NOT NULL,
    "simulation_run" INTEGER NOT NULL,
    "results" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Simulation" ADD CONSTRAINT "Simulation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;
