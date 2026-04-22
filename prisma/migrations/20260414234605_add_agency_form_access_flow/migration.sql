/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Briefing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceInProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('PENDING_BUDGET', 'BUDGET_SENT', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'DELIVERED');

-- DropForeignKey
ALTER TABLE "Briefing" DROP CONSTRAINT "Briefing_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Briefing" DROP CONSTRAINT "Briefing_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_briefingId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceInProgress" DROP CONSTRAINT "ServiceInProgress_budgetId_fkey";

-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- DropTable
DROP TABLE "Briefing";

-- DropTable
DROP TABLE "Budget";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "ServiceInProgress";

-- DropEnum
DROP TYPE "ServiceStatus";

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "budgetValue" TEXT,
    "paymentMethod" TEXT,
    "rejectionReason" TEXT,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING_BUDGET',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
