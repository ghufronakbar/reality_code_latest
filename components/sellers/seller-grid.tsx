"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Package, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Seller {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  isVerified: boolean;
  user: {
    name: string | null;
    profilePictureUrl: string | null;
  };
  averageRating: number;
  totalSales: number;
  _count: {
    products: number;
  };
}

interface Props {
  sellers: Seller[];
}

export default function SellerGrid({ sellers }: Props) {
  if (!sellers.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No sellers found</h2>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sellers.map((seller) => (
        <Link key={seller.id} href={`/sellers/${seller.id}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image
                  src={seller.logo || seller.user.profilePictureUrl || "/default-avatar.png"}
                  alt={seller.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{seller.name}</h3>
                  {seller.isVerified && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-primary text-primary" />
                    {seller.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {seller._count.products} products
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {seller.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">
                  {seller.totalSales} sales
                </Badge>
                {seller.isVerified && (
                  <Badge variant="outline">Verified Seller</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}