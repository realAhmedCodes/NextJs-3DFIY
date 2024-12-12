/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Designers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Printer_Owners` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ratings` on table `Designers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ratings` on table `Printer_Owners` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_PURCHASE', 'CUSTOM_ORDER', 'LIKE', 'COMMENT', 'ORDER_STATUS_UPDATE', 'PROMOTION', 'SYSTEM_ALERT');

-- AlterTable
ALTER TABLE "Designers" ADD COLUMN     "ratings_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_sum" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "ratings" SET NOT NULL,
ALTER COLUMN "ratings" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Printer_Owners" ADD COLUMN     "ratings_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_sum" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "ratings" SET NOT NULL,
ALTER COLUMN "ratings" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "printer_orders" ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(50),
ADD COLUMN     "phone_number" VARCHAR(15);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relatedEntity" TEXT,
    "relatedId" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER,
    "userId" INTEGER NOT NULL,
    "printerId" INTEGER,
    "modelId" INTEGER,
    "reviewText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipientId_isRead_idx" ON "Notification"("recipientId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "Designers_user_id_key" ON "Designers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_Owners_user_id_key" ON "Printer_Owners"("user_id");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "Printers"("printer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Models"("model_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Likes_model_id_user_id_key" RENAME TO "model_user_unique";
