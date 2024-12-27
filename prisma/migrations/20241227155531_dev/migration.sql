-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'User';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "is_verified" DROP NOT NULL,
ALTER COLUMN "is_verified" DROP DEFAULT;
