/*
  Warnings:

  - You are about to drop the column `datePosted` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectIdeaId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectIdeaId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('OPEN', 'FILLED', 'CLOSED');

-- DropIndex
DROP INDEX "Project_datePosted_idx";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "datePosted",
DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "projectIdeaId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProjectIdea" ADD COLUMN     "maxMembers" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "status" "IdeaStatus" NOT NULL DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "ProjectJoinRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectIdeaId" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "userSkills" TEXT[],
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectJoinRequest_projectIdeaId_status_createdAt_idx" ON "ProjectJoinRequest"("projectIdeaId", "status", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectJoinRequest_userId_projectIdeaId_key" ON "ProjectJoinRequest"("userId", "projectIdeaId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectIdeaId_key" ON "Project"("projectIdeaId");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectIdeaId_fkey" FOREIGN KEY ("projectIdeaId") REFERENCES "ProjectIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectJoinRequest" ADD CONSTRAINT "ProjectJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectJoinRequest" ADD CONSTRAINT "ProjectJoinRequest_projectIdeaId_fkey" FOREIGN KEY ("projectIdeaId") REFERENCES "ProjectIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
