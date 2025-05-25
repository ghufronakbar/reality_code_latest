import { db } from "@/config/db";
import { notFound } from "next/navigation";
import SellerHeader from "@/components/sellers/seller-header";
import SellerProducts from "@/components/sellers/seller-products";
import SellerMetrics from "@/components/sellers/seller-metrics";
import SellerContact from "@/components/sellers/seller-contact";

interface Props {
  params: {
    id: string;
  };
}

export default async function SellerPage({ params }: Props) {
  const seller = await db.seller.findUnique({
    where: {
      id: params.id,
      isActive: true,
      isDeleted: false,
      isBanned: false,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          profilePictureUrl: true,
          bio: true,
        },
      },
      products: {
        where: {
          isActive: true,
          isDeleted: false,
        },
        include: {
          category: true,
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

  if (!seller) {
    notFound();
  }

  const metrics = {
    totalProducts: seller._count.products,
    averageRating:
      seller.products.reduce(
        (acc, product) =>
          acc +
          product.productReviews.reduce((sum, review) => sum + review.rating, 0) /
            (product.productReviews.length || 1),
        0
      ) / (seller.products.length || 1),
    totalSales: seller.products.length, // Placeholder
    joinedDate: seller.createdAt,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SellerHeader seller={seller} metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <SellerProducts products={seller.products} />
        </div>
        <div className="space-y-8">
          <SellerMetrics metrics={metrics} />
          <SellerContact seller={seller} />
        </div>
      </div>
    </div>
  );
}