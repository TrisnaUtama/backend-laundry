/*
  Warnings:

  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_user_id_fkey";

-- DropTable
DROP TABLE "Rating";

-- CreateTable
CREATE TABLE "Ratting" (
    "ratting_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "ratting" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ratting_pkey" PRIMARY KEY ("ratting_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ratting_order_id_key" ON "Ratting"("order_id");

-- AddForeignKey
ALTER TABLE "Ratting" ADD CONSTRAINT "Ratting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratting" ADD CONSTRAINT "Ratting_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
