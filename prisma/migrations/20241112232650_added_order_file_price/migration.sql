-- AlterTable
ALTER TABLE "model_orders" ADD COLUMN     "order_file_price" DOUBLE PRECISION,
ALTER COLUMN "order_file_status" SET DEFAULT 'Not Submitted';
