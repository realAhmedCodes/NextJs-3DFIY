-- CreateTable
/*CREATE TABLE "scraped_models" (
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
*/
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
/*
-- CreateTable
CREATE TABLE "alembic_version" (
    "version_num" VARCHAR(32) NOT NULL,

    CONSTRAINT "alembic_version_pkc" PRIMARY KEY ("version_num")
);
*/
-- CreateIndex
/*
CREATE UNIQUE INDEX "scraped_models_file_path_key" ON "scraped_models"("file_path");

-- CreateIndex
CREATE INDEX "ix_scraped_models_id" ON "scraped_models"("id");
*/
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
ALTER TABLE "ModelsSearchLog" ADD CONSTRAINT "ModelsSearchLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignersSearchLog" ADD CONSTRAINT "DesignersSearchLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintersSearchLog" ADD CONSTRAINT "PrintersSearchLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
