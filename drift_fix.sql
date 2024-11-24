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
CREATE TABLE "Category" (
    "category_id" SERIAL NOT NULL,
    "parent_category_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Models" (
    "model_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "designer_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "image" VARCHAR NOT NULL,
    "model_file" VARCHAR(255) NOT NULL,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "download_count" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "tags" TEXT[],
    "price" DOUBLE PRECISION,

    CONSTRAINT "Models_pkey" PRIMARY KEY ("model_id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "like_id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "SavedModels" (
    "saved_model_id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SavedModels_pkey" PRIMARY KEY ("saved_model_id")
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "profile_pic" VARCHAR,
    "password" VARCHAR(255) NOT NULL,
    "phoneNo" VARCHAR(255) NOT NULL,
    "sellerType" VARCHAR(50) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Designers" (
    "designer_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cnic_number" VARCHAR(50) NOT NULL,
    "bio" VARCHAR(255) NOT NULL,
    "ratings" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

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
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Printer_Owners_pkey" PRIMARY KEY ("printer_owner_id")
);

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
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
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
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "status" VARCHAR DEFAULT 'pending',
    "reasons" TEXT,
    "updates" TEXT,
    "order_file" VARCHAR(255),
    "order_file_status" VARCHAR DEFAULT 'Not Submitted',
    "order_file_price" DOUBLE PRECISION,
    "order_check" VARCHAR(255),

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
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "updates" TEXT,
    "reasons" TEXT,

    CONSTRAINT "printer_orders_pkey" PRIMARY KEY ("pending_order_id")
);

-- CreateTable
CREATE TABLE "Chats" (
    "chat_id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "room_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "expiry" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "printed_models" (
    "printed_model_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "printer_owner_id" INTEGER,
    "name" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "material" VARCHAR NOT NULL,
    "color" VARCHAR NOT NULL,
    "resolution" VARCHAR NOT NULL,
    "resistance" VARCHAR NOT NULL,
    "dimensions" JSONB,
    "weight" DOUBLE PRECISION,
    "image" VARCHAR,
    "status" TEXT NOT NULL DEFAULT 'available',
    "price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "printed_models_pkey" PRIMARY KEY ("printed_model_id")
);

-- CreateTable
CREATE TABLE "model_purchase" (
    "model_purchase_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "model_purchase_pkey" PRIMARY KEY ("model_purchase_id")
);

-- CreateTable
CREATE TABLE "printed_model_purchases" (
    "purchase_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "printed_model_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "payment_intent_id" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "printed_model_purchases_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateTable
CREATE TABLE "model_order_purchases" (
    "purchase_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_order_purchases_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateTable
CREATE TABLE "scraped_models" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "file_path" VARCHAR NOT NULL,
    "image_url" VARCHAR NOT NULL,
    "price" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "download_link" VARCHAR,
    "specifications" TEXT,
    "formats" TEXT,
    "tags" TEXT,

    CONSTRAINT "scraped_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelsSearchLog" (
    "search_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tags" TEXT[],
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelsSearchLog_pkey" PRIMARY KEY ("search_id")
);

-- CreateTable
CREATE TABLE "DesignersSearchLog" (
    "search_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignersSearchLog_pkey" PRIMARY KEY ("search_id")
);

-- CreateTable
CREATE TABLE "PrintersSearchLog" (
    "search_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "materials" TEXT[],
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrintersSearchLog_pkey" PRIMARY KEY ("search_id")
);

-- CreateTable
CREATE TABLE "alembic_version" (
    "version_num" VARCHAR(32) NOT NULL,

    CONSTRAINT "alembic_version_pkc" PRIMARY KEY ("version_num")
);

-- CreateIndex
CREATE INDEX "Models_category_id_idx" ON "Models"("category_id");

-- CreateIndex
CREATE INDEX "Models_designer_id_idx" ON "Models"("designer_id");

-- CreateIndex
CREATE INDEX "Likes_model_id_idx" ON "Likes"("model_id");

-- CreateIndex
CREATE INDEX "Likes_user_id_idx" ON "Likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_model_id_user_id_key" ON "Likes"("model_id", "user_id");

-- CreateIndex
CREATE INDEX "SavedModels_model_id_idx" ON "SavedModels"("model_id");

-- CreateIndex
CREATE INDEX "SavedModels_user_id_idx" ON "SavedModels"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SavedModels_model_id_user_id_key" ON "SavedModels"("model_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_user_id_idx" ON "Users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Designers_cnic_number_key" ON "Designers"("cnic_number");

-- CreateIndex
CREATE INDEX "Designers_user_id_idx" ON "Designers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_Owners_cnic_number_key" ON "Printer_Owners"("cnic_number");

-- CreateIndex
CREATE INDEX "Printer_Owners_user_id_idx" ON "Printer_Owners"("user_id");

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
CREATE INDEX "Chats_chat_id_idx" ON "Chats"("chat_id");

-- CreateIndex
CREATE INDEX "Chats_room_id_idx" ON "Chats"("room_id");

-- CreateIndex
CREATE INDEX "Chats_sender_id_idx" ON "Chats"("sender_id");

-- CreateIndex
CREATE INDEX "Chats_receiver_id_idx" ON "Chats"("receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "otp_email_key" ON "otp"("email");

-- CreateIndex
CREATE INDEX "otp_id_idx" ON "otp"("id");

-- CreateIndex
CREATE INDEX "otp_email_idx" ON "otp"("email");

-- CreateIndex
CREATE INDEX "printed_models_printed_model_id_idx" ON "printed_models"("printed_model_id");

-- CreateIndex
CREATE INDEX "printed_models_user_id_status_idx" ON "printed_models"("user_id", "status");

-- CreateIndex
CREATE INDEX "printed_models_printer_owner_id_idx" ON "printed_models"("printer_owner_id");

-- CreateIndex
CREATE INDEX "model_purchase_user_id_idx" ON "model_purchase"("user_id");

-- CreateIndex
CREATE INDEX "model_purchase_model_id_idx" ON "model_purchase"("model_id");

-- CreateIndex
CREATE UNIQUE INDEX "model_purchase_user_id_model_id_key" ON "model_purchase"("user_id", "model_id");

-- CreateIndex
CREATE INDEX "printed_model_purchases_user_id_idx" ON "printed_model_purchases"("user_id");

-- CreateIndex
CREATE INDEX "printed_model_purchases_printed_model_id_idx" ON "printed_model_purchases"("printed_model_id");

-- CreateIndex
CREATE INDEX "model_order_purchases_user_id_idx" ON "model_order_purchases"("user_id");

-- CreateIndex
CREATE INDEX "model_order_purchases_order_id_idx" ON "model_order_purchases"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "scraped_models_file_path_key" ON "scraped_models"("file_path");

-- CreateIndex
CREATE INDEX "ix_scraped_models_id" ON "scraped_models"("id");

-- CreateIndex
CREATE INDEX "ModelsSearchLog_user_id_idx" ON "ModelsSearchLog"("user_id");

-- CreateIndex
CREATE INDEX "ModelsSearchLog_tags_idx" ON "ModelsSearchLog" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "DesignersSearchLog_user_id_idx" ON "DesignersSearchLog"("user_id");

-- CreateIndex
CREATE INDEX "DesignersSearchLog_location_idx" ON "DesignersSearchLog"("location");

-- CreateIndex
CREATE INDEX "PrintersSearchLog_user_id_idx" ON "PrintersSearchLog"("user_id");

-- CreateIndex
CREATE INDEX "PrintersSearchLog_location_idx" ON "PrintersSearchLog"("location");

-- CreateIndex
CREATE INDEX "PrintersSearchLog_materials_idx" ON "PrintersSearchLog" USING GIN ("materials");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "Category"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_designer_id_fkey" FOREIGN KEY ("designer_id") REFERENCES "Designers"("designer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Models"("model_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedModels" ADD CONSTRAINT "SavedModels_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Models"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedModels" ADD CONSTRAINT "SavedModels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Designers" ADD CONSTRAINT "Designers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Printer_Owners" ADD CONSTRAINT "Printer_Owners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Printers" ADD CONSTRAINT "Printers_printer_owner_id_fkey" FOREIGN KEY ("printer_owner_id") REFERENCES "Printer_Owners"("printer_owner_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_orders" ADD CONSTRAINT "model_orders_designer_id_fkey" FOREIGN KEY ("designer_id") REFERENCES "Designers"("designer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_orders" ADD CONSTRAINT "model_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printer_orders" ADD CONSTRAINT "printer_orders_printer_owner_id_fkey" FOREIGN KEY ("printer_owner_id") REFERENCES "Printer_Owners"("printer_owner_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printer_orders" ADD CONSTRAINT "printer_orders_printerid_fkey" FOREIGN KEY ("printerid") REFERENCES "Printers"("printer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printer_orders" ADD CONSTRAINT "printer_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printed_models" ADD CONSTRAINT "printed_models_printer_owner_id_fkey" FOREIGN KEY ("printer_owner_id") REFERENCES "Printer_Owners"("printer_owner_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printed_models" ADD CONSTRAINT "printed_models_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_purchase" ADD CONSTRAINT "model_purchase_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Models"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_purchase" ADD CONSTRAINT "model_purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printed_model_purchases" ADD CONSTRAINT "printed_model_purchases_printed_model_id_fkey" FOREIGN KEY ("printed_model_id") REFERENCES "printed_models"("printed_model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printed_model_purchases" ADD CONSTRAINT "printed_model_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_order_purchases" ADD CONSTRAINT "model_order_purchases_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "model_orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_order_purchases" ADD CONSTRAINT "model_order_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelsSearchLog" ADD CONSTRAINT "ModelsSearchLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignersSearchLog" ADD CONSTRAINT "DesignersSearchLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintersSearchLog" ADD CONSTRAINT "PrintersSearchLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

