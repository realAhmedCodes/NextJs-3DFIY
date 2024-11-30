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
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "printed_models_pkey" PRIMARY KEY ("printed_model_id")
);

-- CreateIndex
CREATE INDEX "printed_models_printed_model_id_idx" ON "printed_models"("printed_model_id");

-- CreateIndex
CREATE INDEX "printed_models_user_id_status_idx" ON "printed_models"("user_id", "status");

-- CreateIndex
CREATE INDEX "printed_models_printer_owner_id_idx" ON "printed_models"("printer_owner_id");

-- AddForeignKey
ALTER TABLE "printed_models" ADD CONSTRAINT "printed_models_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printed_models" ADD CONSTRAINT "printed_models_printer_owner_id_fkey" FOREIGN KEY ("printer_owner_id") REFERENCES "Printer_Owners"("printer_owner_id") ON DELETE SET NULL ON UPDATE CASCADE;
