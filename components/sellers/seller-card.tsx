import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Package, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface SellerCardProps {
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

export const SellerCard = ({ item }: { item: SellerCardProps }) => {
  return (
    <Link key={item.id} href={`/sellers/${item.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
            <AvatarImage
              src={
                item.logo ||
                item.user.profilePictureUrl ||
                "/default-avatar.png"
              }
              className="object-cover"
            />
            <AvatarFallback className="bg-muted text-muted-foreground text-3xl font-bold">
              {item.name
                .split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{item.name}</h3>
              {item.isVerified && (
                <CheckCircle className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-primary text-primary" />
                {item.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-1" />
                {item._count.products} products
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">{item.totalSales} sales</Badge>
            {item.isVerified && (
              <Badge variant="outline">Verified Seller</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
