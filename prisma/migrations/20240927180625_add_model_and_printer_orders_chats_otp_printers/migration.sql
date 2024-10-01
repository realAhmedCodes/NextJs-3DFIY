/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Chats` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `Chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "createdAt",
ADD COLUMN     "createdat" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "room_id" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Designers" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Models" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Printer_Owners" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Printers" (
    "printer_id" SERIAL NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "printer_type" VARCHAR(50) NOT NULL,
    "materials" TEXT[],
    "price" INTEGER,
    "image" VARCHAR(255) NOT NULL,
    "printer_owner_id" INTEGER,
    "rating" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "colors" TEXT[],
    "services" TEXT[],

    CONSTRAINT "Printers_pkey" PRIMARY KEY ("printer_id")
);

-- CreateTable
CREATE TABLE "model_orders" (
    "order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "model_name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "dimensions" JSONB NOT NULL,
    "file_format" VARCHAR(50) NOT NULL,
    "reference_file" VARCHAR(255),
    "additional_notes" TEXT,
    "designer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "status" VARCHAR DEFAULT 'pending',
    "reasons" TEXT,
    "updates" TEXT,

    CONSTRAINT "model_orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "printer_orders" (
    "pending_order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "printerid" INTEGER NOT NULL,
    "printer_owner_id" INTEGER,
    "model_file" VARCHAR NOT NULL,
    "instructions" TEXT NOT NULL,
    "material" VARCHAR NOT NULL,
    "color" VARCHAR NOT NULL,
    "resolution" VARCHAR NOT NULL,
    "resistance" VARCHAR NOT NULL,
    "status" VARCHAR DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updates" TEXT,
    "reasons" TEXT,

    CONSTRAINT "printer_orders_pkey" PRIMARY KEY ("pending_order_id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "expiry" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Printers_printer_id_idx" ON "Printers"("printer_id");

-- CreateIndex
CREATE INDEX "Printers_printer_owner_id_idx" ON "Printers"("printer_owner_id");

-- CreateIndex
CREATE INDEX "model_orders_order_id_idx" ON "model_orders"("order_id");

-- CreateIndex
CREATE INDEX "model_orders_user_id_idx" ON "model_orders"("user_id");

-- CreateIndex
CREATE INDEX "model_orders_designer_id_idx" ON "model_orders"("designer_id");

-- CreateIndex
CREATE INDEX "printer_orders_pending_order_id_idx" ON "printer_orders"("pending_order_id");

-- CreateIndex
CREATE INDEX "printer_orders_user_id_idx" ON "printer_orders"("user_id");

-- CreateIndex
CREATE INDEX "printer_orders_printerid_idx" ON "printer_orders"("printerid");

-- CreateIndex
CREATE UNIQUE INDEX "otp_email_key" ON "otp"("email");

-- CreateIndex
CREATE INDEX "otp_id_idx" ON "otp"("id");

-- CreateIndex
CREATE INDEX "otp_email_idx" ON "otp"("email");

-- CreateIndex
CREATE INDEX "Chats_chat_id_idx" ON "Chats"("chat_id");

-- CreateIndex
CREATE INDEX "Chats_room_id_idx" ON "Chats"("room_id");

-- CreateIndex
CREATE INDEX "Chats_sender_id_idx" ON "Chats"("sender_id");

-- CreateIndex
CREATE INDEX "Chats_receiver_id_idx" ON "Chats"("receiver_id");

-- CreateIndex
CREATE INDEX "Designers_user_id_idx" ON "Designers"("user_id");

-- CreateIndex
CREATE INDEX "Likes_model_id_idx" ON "Likes"("model_id");

-- CreateIndex
CREATE INDEX "Likes_user_id_idx" ON "Likes"("user_id");

-- CreateIndex
CREATE INDEX "Models_category_id_idx" ON "Models"("category_id");

-- CreateIndex
CREATE INDEX "Models_designer_id_idx" ON "Models"("designer_id");

-- CreateIndex
CREATE INDEX "Printer_Owners_user_id_idx" ON "Printer_Owners"("user_id");

-- CreateIndex
CREATE INDEX "SavedModels_model_id_idx" ON "SavedModels"("model_id");

-- CreateIndex
CREATE INDEX "SavedModels_user_id_idx" ON "SavedModels"("user_id");

-- CreateIndex
CREATE INDEX "Users_user_id_idx" ON "Users"("user_id");

-- AddForeignKey
ALTER TABLE "Printers" ADD CONSTRAINT "Printers_printer_owner_id_fkey" FOREIGN KEY ("printer_owner_id") REFERENCES "Printer_Owners"("printer_owner_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_orders" ADD CONSTRAINT "model_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_orders" ADD CONSTRAINT "model_orders_designer_id_fkey" FOREIGN KEY ("designer_id") REFERENCES "Designers"("designer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printer_orders" ADD CONSTRAINT "printer_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printer_orders" ADD CONSTRAINT "printer_orders_printer_owner_id_fkey" FOREIGN KEY ("printer_owner_id") REFERENCES "Printer_Owners"("printer_owner_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printer_orders" ADD CONSTRAINT "printer_orders_printerid_fkey" FOREIGN KEY ("printerid") REFERENCES "Printers"("printer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
