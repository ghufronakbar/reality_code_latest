/*
  Warnings:

  - Added the required column `title` to the `ProductReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductReview" ADD COLUMN     "title" TEXT NOT NULL;
