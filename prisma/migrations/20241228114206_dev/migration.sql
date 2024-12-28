/*
  Warnings:

  - You are about to drop the column `is_express` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "is_express",
DROP COLUMN "total_price";
