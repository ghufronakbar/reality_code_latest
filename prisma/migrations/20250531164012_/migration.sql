/*
  Warnings:

  - Added the required column `description` to the `ProductVersionLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `ProductVersionLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVersionLink" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "link" TEXT NOT NULL;
