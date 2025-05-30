import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Star,
  ShoppingBag,
  Store,
  Edit,
  ArrowRight,
  Hourglass,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { serverSession } from "@/lib/auth";
import { SignOutButton } from "./client";
import { db } from "@/config/db";
import { formatPrice } from "@/helper/formatPrice";
import { TbCash, TbHeart, TbMessage } from "react-icons/tb";

const getUserInfo = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
      seller: {
        include: {
          orders: {
            select: {
              totalAmount: true,
            },
            where: {
              status: "Completed",
            },
          },
          products: {
            include: {
              category: true,
              _count: {
                select: {
                  orderItems: true,
                },
              },
              productReviews: {
                select: {
                  rating: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  let totalReviews = 0;
  let totalRatings = 0;
  let totalPurchases = 0;
  let totalSales = 0;

  if (user.seller) {
    for (const product of user.seller.products) {
      for (const review of product.productReviews) {
        totalRatings += review.rating;
        totalReviews++;
      }

      totalPurchases += product._count.orderItems;
    }
    for (const order of user.seller.orders) {
      totalSales += order.totalAmount;
    }
  }

  const rating = totalRatings / totalReviews || 0;

  const data = {
    ...user,
    seller: {
      ...user.seller,
      rating,
      totalReviews,
      totalRatings,
      totalPurchases,
      totalSales,
    },
  };

  return data;
};

export type UserInfo = Awaited<ReturnType<typeof getUserInfo>>;

export default async function ProfilePage() {
  const session = await serverSession();
  const user = await getUserInfo(session.user.email);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={session.user.profilePictureUrl || ""}
                  className="object-cover"
                />
                <AvatarFallback>
                  {session.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold line-clamp-1">
                      {session.user.name}
                    </h1>
                    <p className="text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="flex-col gap-2 hidden md:flex">
                    <Button
                      variant="outline"
                      asChild
                      className="flex items-center w-full md:w-auto"
                    >
                      <Link href="/profile/edit">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <SignOutButton className="w-full md:w-auto" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge>{session.user.role}</Badge>
                  {session.user.role === "Admin" && (
                    <Badge variant="destructive">Admin Access</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {session.user.bio || "No bio provided yet."}
              </p>
              <div className="flex-col gap-2 md:hidden flex mt-4">
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center w-full md:w-auto"
                >
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <SignOutButton className="w-full md:w-auto" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Purchases</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Reviews Given</p>
                  <p className="text-2xl font-bold">{user?._count.reviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {!user?.seller ? (
            <Card>
              <CardHeader>
                <CardTitle>Become a Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Start selling your software products on our platform and reach
                  thousands of potential customers.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span>List unlimited products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-primary" />
                    <span>Custom seller profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>Build your reputation</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <Link href="/seller/registration">
                  <Button className="w-full">
                    Become a Seller
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : user.seller.isVerified === false ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-center">
                  Seller Application Under Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your seller application is currently being reviewed by our
                  team. We will notify you via email once the review process is
                  completed.
                </p>
                <div className="flex items-center justify-center">
                  <Hourglass className="h-12 w-12 text-primary animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="text-primary">
                  {user.seller.name}
                </CardTitle>
                <Badge className="w-fit">{user.seller.businessType}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-muted-foreground line-clamp-2">
                  {user.seller.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Total Products
                      </p>
                      <p className="text-2xl font-bold">
                        {user.seller.products?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <TbCash className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Total Purchases
                      </p>
                      <p className="text-2xl font-bold">
                        {user?.seller.totalPurchases || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Total Sales
                      </p>
                      <p className="text-2xl font-bold">
                        {formatPrice(user.seller.totalSales)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <TbMessage className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Unread Messages
                      </p>
                      <p className="text-2xl font-bold">
                        20
                        {/* TODO */}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <TbHeart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Total Reviews
                      </p>
                      <p className="text-2xl font-bold">
                        {user?.seller.totalReviews || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Average Rating
                      </p>
                      <p className="text-2xl font-bold">
                        {user.seller.rating || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <Link href="/shop/dashboard" className="w-full">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
