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
CREATE TABLE "alembic_version" (
    "version_num" VARCHAR(32) NOT NULL,

    CONSTRAINT "alembic_version_pkc" PRIMARY KEY ("version_num")
);

-- CreateIndex
CREATE UNIQUE INDEX "scraped_models_file_path_key" ON "scraped_models"("file_path");

-- CreateIndex
CREATE INDEX "ix_scraped_models_id" ON "scraped_models"("id");
