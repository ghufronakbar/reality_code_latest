-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "thumbnailUrl" DROP DEFAULT;
