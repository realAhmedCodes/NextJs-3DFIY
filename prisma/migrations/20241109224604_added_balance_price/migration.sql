/*
  Warnings:

  - Added the required column `price` to the `model_purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Designers" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "model_purchase" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
