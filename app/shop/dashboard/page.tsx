import SellerDashboardHeader from "./seller-dashboard-header";
import SellerMetrics from "@/components/sellers/seller-metrics";
import SellerProducts from "@/components/sellers/seller-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/config/db";
import { serverSession } from "@/lib/auth";
import { Star, ShoppingBag, Package, DollarSign, MessageSquare } from "lucide-react";
import AnalyticsSection from "./analytics-section";

function getMonthName(date: Date) {
  return date.toLocaleString("default", { month: "short" });
}

async function getSellerMappedByUserId(userId: string) {
  const seller = await db.seller.findUnique({
    where: {
      userId,
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
  if (!seller) return null;
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
}

async function getDashboardAnalytics(sellerId: string) {
  // Get all orders for this seller
  const orders = await db.order.findMany({
    where: { sellerId, status: { in: ["Completed", "Processing"] } },
    select: { totalAmount: true, createdAt: true, id: true },
  });
  // Get all products for this seller
  const products = await db.product.findMany({
    where: { sellerId, isActive: true, isDeleted: false },
    select: { id: true, productReviews: true },
  });
  // Calculate total revenue, total orders, total products, total reviews, average rating
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const allReviews = products.flatMap((p) => p.productReviews);
  const totalReviews = allReviews.length;
  const averageRating = totalReviews
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;
  // Sales by month (last 6 months)
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { month: getMonthName(d), year: d.getFullYear(), total: 0 };
  });
  orders.forEach((order) => {
    const d = new Date(order.createdAt);
    const idx = months.findIndex(
      (m) => m.year === d.getFullYear() && m.month === getMonthName(d)
    );
    if (idx !== -1) months[idx].total += order.totalAmount;
  });
  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalReviews,
    averageRating,
    salesByMonth: months,
  };
}

export default async function SellerDashboard() {
  const session = await serverSession();
  if (!session?.user?.id) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">No Seller Data</h2>
        <p className="text-muted-foreground">
          You are not registered as a seller or your account is under review.
        </p>
      </Card>
    );
  }
  const mappedSeller = await getSellerMappedByUserId(session.user.id);
  if (!mappedSeller) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">No Seller Data</h2>
        <p className="text-muted-foreground">
          You are not registered as a seller or your account is under review.
        </p>
      </Card>
    );
  }
  const analytics = await getDashboardAnalytics(mappedSeller.seller.id);
  return (
    <div className="space-y-8">
      {/* Dashboard Analytics */}
      <AnalyticsSection analytics={analytics} />
      <SellerDashboardHeader seller={mappedSeller.seller} metrics={mappedSeller.metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SellerProducts item={mappedSeller} />
        </div>
        <div className="space-y-8">
          <SellerMetrics item={mappedSeller} />
        </div>
      </div>
    </div>
  );
}
