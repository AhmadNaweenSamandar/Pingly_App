/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `interests` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
DROP COLUMN "image",
DROP COLUMN "interests",
DROP COLUMN "major",
ADD COLUMN     "campusInvolvement" TEXT[],
ADD COLUMN     "discipline" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "expectedGraduationYear" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "hobbies" TEXT[],
ADD COLUMN     "industriesOfInterest" TEXT[],
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "matchWithDisciplines" TEXT[],
ADD COLUMN     "matchWithYears" TEXT[],
ADD COLUMN     "personalityType" TEXT,
ADD COLUMN     "portfolioWebsite" TEXT,
ADD COLUMN     "professionalGoals" TEXT[],
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "socialGoals" TEXT[],
ADD COLUMN     "socialPictures" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
