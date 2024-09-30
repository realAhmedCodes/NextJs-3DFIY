-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Designer" (
    "designer_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cnic_number" VARCHAR(50) NOT NULL,
    "bio" VARCHAR(255) NOT NULL,
    "ratings" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Designer_pkey" PRIMARY KEY ("designer_id")
);

-- CreateTable
CREATE TABLE "PrinterOwner" (
    "printer_owner_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cnic_number" VARCHAR(50) NOT NULL,
    "bio" VARCHAR(255) NOT NULL,
    "ratings" INTEGER,
    "quality_certificate" BYTEA,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "PrinterOwner_pkey" PRIMARY KEY ("printer_owner_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Designer_user_id_key" ON "Designer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Designer_cnic_number_key" ON "Designer"("cnic_number");

-- CreateIndex
CREATE UNIQUE INDEX "PrinterOwner_user_id_key" ON "PrinterOwner"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PrinterOwner_cnic_number_key" ON "PrinterOwner"("cnic_number");

-- AddForeignKey
ALTER TABLE "Designer" ADD CONSTRAINT "Designer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrinterOwner" ADD CONSTRAINT "PrinterOwner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
