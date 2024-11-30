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

-- CreateIndex
CREATE INDEX "printed_model_purchases_user_id_idx" ON "printed_model_purchases"("user_id");

-- CreateIndex
CREATE INDEX "printed_model_purchases_printed_model_id_idx" ON "printed_model_purchases"("printed_model_id");

-- AddForeignKey
ALTER TABLE "printed_model_purchases" ADD CONSTRAINT "printed_model_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printed_model_purchases" ADD CONSTRAINT "printed_model_purchases_printed_model_id_fkey" FOREIGN KEY ("printed_model_id") REFERENCES "printed_models"("printed_model_id") ON DELETE RESTRICT ON UPDATE CASCADE;
