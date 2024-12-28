/*
  Warnings:

  - You are about to drop the column `quantity` on the `Detail_Order` table. All the data in the column will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Detail_Order" DROP COLUMN "quantity";

-- DropTable
DROP TABLE "Employee";
