"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Package,
  Calendar,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { formatDate } from "@/helper/formatDate";
import { MappedSellerById } from "@/app/sellers/[id]/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  item: MappedSellerById;
}

export default function SellerHeader({ item }: Props) {
  if (!item) {
    return null;
  }
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="relative h-32 w-32 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          <AvatarImage
            src={
              item?.seller.logo ||
              item.seller.user.profilePictureUrl ||
              "/default-avatar.png"
            }
            className="object-cover"
          />
          <AvatarFallback className="bg-muted text-muted-foreground text-3xl font-bold">
            {item.seller.name
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{item.seller.name}</h1>
            {item.seller.isVerified && (
              <Badge variant="secondary" className="h-6">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified Seller
              </Badge>
            )}
          </div>

          <div className="text-muted-foreground mt-2">
            <p>{item.seller.description}</p>
            <p>{item.seller.user.bio}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-primary fill-primary mr-1" />
              <span className="font-medium">
                {item.metrics.averageRating
                  ? `${item.metrics.averageRating.toFixed(1)} (${
                      item.metrics.totalReview
                    })`
                  : "No Ratings Yet"}
              </span>
            </div>

            <div className="flex items-center">
              <Package className="h-5 w-5 mr-1" />
              <span>{item.metrics.totalProducts} Products</span>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              <span>Joined {formatDate(item.metrics.joinedDate, true)}</span>
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
