/*
  Warnings:

  - The values [in_progress,delivery,complete] on the enum `Order_Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Order_Status_new" AS ENUM ('pending', 'waiting_to_pickup', 'on_progress', 'process_done', 'ready_for_pickup', 'awaiting_for_pickup', 'pickup_completed', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'received', 'canceled');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "Order_Status_new" USING ("status"::text::"Order_Status_new");
ALTER TYPE "Order_Status" RENAME TO "Order_Status_old";
ALTER TYPE "Order_Status_new" RENAME TO "Order_Status";
DROP TYPE "Order_Status_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
