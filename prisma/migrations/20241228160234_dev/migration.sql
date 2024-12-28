/*
  Warnings:

  - The values [midtrans,cash,bank_transfer,e_wallet] on the enum `Payment_Method` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Payment_Method_new" AS ENUM ('transfer', 'cod');
ALTER TABLE "Payment" ALTER COLUMN "payment_method" TYPE "Payment_Method_new" USING ("payment_method"::text::"Payment_Method_new");
ALTER TYPE "Payment_Method" RENAME TO "Payment_Method_old";
ALTER TYPE "Payment_Method_new" RENAME TO "Payment_Method";
DROP TYPE "Payment_Method_old";
COMMIT;
