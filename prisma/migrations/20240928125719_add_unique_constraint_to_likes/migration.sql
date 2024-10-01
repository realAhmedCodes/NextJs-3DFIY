/*
  Warnings:

  - A unique constraint covering the columns `[model_id,user_id]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Likes_model_id_user_id_key" ON "Likes"("model_id", "user_id");
