import { db } from "@/config/db";
import SellerGrid from "@/components/sellers/seller-grid";
import SellerFilters from "@/components/sellers/seller-filters";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export default async function SellersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { search, verified, sort } = await searchParams;
  const searchTerm = typeof search === "string" ? search : "";
  const sellers = await db.seller.findMany({
    where: {
      AND: [
        { isActive: true },
        { isDeleted: false },
        { isBanned: false },
        search
          ? {
              OR: [
                {
                  name: { contains: searchTerm, mode: "insensitive" },
                },
                {
                  description: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
        verified === "true" ? { isVerified: true } : {},
      ],
    },
    include: {
      user: {
        select: {
          name: true,
          profilePictureUrl: true,
        },
      },
      products: {
        where: {
          isActive: true,
          isDeleted: false,
        },
        include: {
          productReviews: {
            select: {
              rating: true,
            },
          },
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const mappedSellers = sellers.map((seller) => ({
    ...seller,
    averageRating:
      seller.products.reduce(
        (acc, product) =>
          acc +
          product.productReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) /
            (product.productReviews.length || 1),
        0
      ) / (seller.products.length || 1),
    totalSales: seller.products.length, // This is a placeholder. In a real app, you'd track actual sales
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        heading="Browse Sellers"
        description="Discover trusted software developers and companies"
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <SellerFilters />
        </div>
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <SellerGrid sellers={mappedSellers} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}