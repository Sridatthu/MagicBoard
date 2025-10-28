/*
  Warnings:

  - You are about to drop the column `shapeId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "shapeId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "shapeId";
