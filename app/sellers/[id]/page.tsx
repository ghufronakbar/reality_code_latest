import { db } from "@/config/db";
import { notFound } from "next/navigation";
import SellerHeader from "@/components/sellers/seller-header";
import SellerProducts from "@/components/sellers/seller-products";
import SellerMetrics from "@/components/sellers/seller-metrics";
import SellerContact from "@/components/sellers/seller-contact";
import ChatButton from "@/components/chat/chat-button";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export type MappedSellerById = Awaited<ReturnType<typeof getSellerById>>;

const getSellerById = async (id: string) => {
  const seller = await db.seller.findUnique({
    where: {
      id,
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
    return null;
  }

  const data = {
    ...seller,
    products: seller.products.map((product) => {
      const onSale = product.originalPrice > product.price;
      const percentageDiscount = onSale
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100
          )
        : 0;
      const rating =
        product.productReviews.reduce((acc, review) => acc + review.rating, 0) /
        (product.productReviews.length || 1);
      return {
        ...product,
        onSale,
        percentageDiscount,
        rating,
        reviewCount: product.productReviews.length,
      };
    }),
  };

  const totalRatings = seller.products.reduce(
    (acc, product) =>
      acc + product.productReviews.reduce((a, r) => a + r.rating, 0),
    0
  );
  const averageRating = seller.products.reduce(
    (a, p) => a + p.productReviews.length,
    0
  )
    ? totalRatings /
      seller.products.reduce((a, p) => a + p.productReviews.length, 0)
    : 0;

  const totalReview = seller.products.reduce(
    (acc, product) => acc + product.productReviews.length,
    0
  );
  const metrics = {
    totalProducts: seller._count.products,
    averageRating,
    totalSales: seller.products.length, // Placeholder TODO
    joinedDate: seller.createdAt,
    totalRatings,
    totalReview,
  };
  return { seller: data, metrics };
};

export default async function SellerPage({ params }: Props) {
  const { id } = await params;
  const data = await getSellerById(id);

  if (!data) {
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <SellerHeader item={data} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <SellerProducts item={data} />
        </div>
        <div className="space-y-8">
          <SellerMetrics item={data} />
          <SellerContact item={data} />
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ChatButton sellerId={id} productId="" />
      </div>
    </div>
  );
}
