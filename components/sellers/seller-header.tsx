"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Package, Calendar, CheckCircle, MessageSquare } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/helper/formatDate";

interface Props {
  seller: {
    name: string;
    description: string | null;
    logo: string | null;
    isVerified: boolean;
    user: {
      name: string | null;
      profilePictureUrl: string | null;
      bio: string | null;
    };
  };
  metrics: {
    totalProducts: number;
    averageRating: number;
    totalSales: number;
    joinedDate: Date;
  };
}

export default function SellerHeader({ seller, metrics }: Props) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative h-32 w-32 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={seller.logo || seller.user.profilePictureUrl || "/default-avatar.png"}
            alt={seller.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{seller.name}</h1>
            {seller.isVerified && (
              <Badge variant="secondary" className="h-6">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified Seller
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground mt-2">
            {seller.description || seller.user.bio}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mt-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-primary fill-primary mr-1" />
              <span className="font-medium">{metrics.averageRating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-1" />
              <span>{metrics.totalProducts} Products</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              <span>Joined {formatDate(metrics.joinedDate)}</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex flex-wrap gap-3">
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
            <Button variant="outline">View All Products</Button>
          </div>
        </div>
      </div>
    </div>
  );
}