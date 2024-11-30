-- CreateTable
CREATE TABLE "model_purchase" (
    "model_purchase_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_purchase_pkey" PRIMARY KEY ("model_purchase_id")
);

-- CreateIndex
CREATE INDEX "model_purchase_user_id_idx" ON "model_purchase"("user_id");

-- CreateIndex
CREATE INDEX "model_purchase_model_id_idx" ON "model_purchase"("model_id");

-- CreateIndex
CREATE UNIQUE INDEX "model_purchase_user_id_model_id_key" ON "model_purchase"("user_id", "model_id");

-- AddForeignKey
ALTER TABLE "model_purchase" ADD CONSTRAINT "model_purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_purchase" ADD CONSTRAINT "model_purchase_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Models"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;
