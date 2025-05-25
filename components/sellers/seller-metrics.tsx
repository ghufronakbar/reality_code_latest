"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Package, TrendingUp } from "lucide-react";

interface Props {
  metrics: {
    totalProducts: number;
    averageRating: number;
    totalSales: number;
  };
}

export default function SellerMetrics({ metrics }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Metrics</CardTitle>
        <CardDescription>Overview of seller performance</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Star className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Average Rating</p>
            <p className="text-2xl font-bold">{metrics.averageRating.toFixed(1)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Total Products</p>
            <p className="text-2xl font-bold">{metrics.totalProducts}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Total Sales</p>
            <p className="text-2xl font-bold">{metrics.totalSales}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}