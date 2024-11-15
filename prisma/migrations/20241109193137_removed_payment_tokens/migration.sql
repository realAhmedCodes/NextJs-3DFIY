/*
  Warnings:

  - You are about to drop the column `balance` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `tokens` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "balance",
DROP COLUMN "tokens";
