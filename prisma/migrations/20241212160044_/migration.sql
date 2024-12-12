/*
  Warnings:

  - Added the required column `filamentDiameter` to the `Printers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `layerResolutionMax` to the `Printers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `layerResolutionMin` to the `Printers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nozzleDiameter` to the `Printers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printSpeedMax` to the `Printers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printVolumeDepth` to the `Printers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printVolumeHeight` to the `Printers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printVolumeWidth` to the `Printers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Printers" ADD COLUMN     "filamentDiameter" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "layerResolutionMax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "layerResolutionMin" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "nozzleDiameter" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "printSpeedMax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "printVolumeDepth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "printVolumeHeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "printVolumeWidth" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
