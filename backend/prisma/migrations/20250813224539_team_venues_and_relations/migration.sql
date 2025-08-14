/*
  Warnings:

  - Added the required column `venueId` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."team" ADD COLUMN     "venueId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."team" ADD CONSTRAINT "team_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venue"("venue_id") ON DELETE RESTRICT ON UPDATE CASCADE;
