-- AlterTable
ALTER TABLE "Bank" ALTER COLUMN "holderName" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "businessAddress" DROP DEFAULT,
ALTER COLUMN "businessType" DROP DEFAULT,
ALTER COLUMN "phoneNumber" DROP DEFAULT;
