/*
  Warnings:

  - You are about to drop the `Designer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrinterOwner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Designer" DROP CONSTRAINT "Designer_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PrinterOwner" DROP CONSTRAINT "PrinterOwner_user_id_fkey";

-- DropTable
DROP TABLE "Designer";

-- DropTable
DROP TABLE "PrinterOwner";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "profile_pic" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "phoneNo" VARCHAR(255) NOT NULL,
    "sellerType" VARCHAR(50) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Designers" (
    "designer_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cnic_number" VARCHAR(50) NOT NULL,
    "bio" VARCHAR(255) NOT NULL,
    "ratings" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Designers_pkey" PRIMARY KEY ("designer_id")
);

-- CreateTable
CREATE TABLE "Printer_Owners" (
    "printer_owner_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cnic_number" VARCHAR(50) NOT NULL,
    "bio" VARCHAR(255) NOT NULL,
    "ratings" INTEGER,
    "quality_certificate" BYTEA,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Printer_Owners_pkey" PRIMARY KEY ("printer_owner_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Designers_user_id_key" ON "Designers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Designers_cnic_number_key" ON "Designers"("cnic_number");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_Owners_user_id_key" ON "Printer_Owners"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_Owners_cnic_number_key" ON "Printer_Owners"("cnic_number");

-- AddForeignKey
ALTER TABLE "Designers" ADD CONSTRAINT "Designers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Printer_Owners" ADD CONSTRAINT "Printer_Owners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
