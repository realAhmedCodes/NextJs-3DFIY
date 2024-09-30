/*
  Warnings:

  - A unique constraint covering the columns `[model_id,user_id]` on the table `SavedModels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SavedModels_model_id_user_id_key" ON "SavedModels"("model_id", "user_id");
