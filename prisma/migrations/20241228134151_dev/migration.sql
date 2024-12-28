/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `Payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Payment_transaction_id_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "transaction_id";
