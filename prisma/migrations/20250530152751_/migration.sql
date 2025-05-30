/*
  Warnings:

  - You are about to drop the column `bankAccount` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `bankHolder` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `taxIdentifier` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `productId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `businessAddress` on table `Seller` required. This step will fail if there are existing NULL values in that column.
  - Made the column `businessType` on table `Seller` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Seller` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BankStatus" AS ENUM ('Verified', 'Pending', 'Deleted');

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "bankAccount",
DROP COLUMN "bankHolder",
DROP COLUMN "bankName",
DROP COLUMN "taxIdentifier",
ALTER COLUMN "businessAddress" SET NOT NULL,
ALTER COLUMN "businessAddress" SET DEFAULT '',
ALTER COLUMN "businessType" SET NOT NULL,
ALTER COLUMN "businessType" SET DEFAULT '',
ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET DEFAULT '';

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "status" "BankStatus" NOT NULL DEFAULT 'Pending',
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
