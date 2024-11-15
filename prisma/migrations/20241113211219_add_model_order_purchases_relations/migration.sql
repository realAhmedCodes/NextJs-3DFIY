-- CreateTable
CREATE TABLE "model_order_purchases" (
    "purchase_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_order_purchases_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateIndex
CREATE INDEX "model_order_purchases_user_id_idx" ON "model_order_purchases"("user_id");

-- CreateIndex
CREATE INDEX "model_order_purchases_order_id_idx" ON "model_order_purchases"("order_id");

-- AddForeignKey
ALTER TABLE "model_order_purchases" ADD CONSTRAINT "model_order_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_order_purchases" ADD CONSTRAINT "model_order_purchases_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "model_orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
