/*
  Warnings:

  - You are about to alter the column `model_file` on the `Models` table. The data in that column could be lost. The data in that column will be cast from `ByteA` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Models" ALTER COLUMN "model_file" SET DATA TYPE VARCHAR(255);
