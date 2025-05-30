"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Star, ShoppingBag, Package, DollarSign, MessageSquare } from "lucide-react";

interface AnalyticsProps {
  analytics: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalReviews: number;
    averageRating: number;
    salesByMonth: { month: string; year: number; total: number }[];
  };
}

export default function AnalyticsSection({ analytics }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <CardTitle className="text-base">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <CardTitle className="text-base">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Package className="h-6 w-6 text-primary" />
          <CardTitle className="text-base">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalProducts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <CardTitle className="text-base">Total Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalReviews}</div>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2 xl:col-span-4">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Star className="h-6 w-6 text-primary" />
          <CardTitle className="text-base">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.averageRating.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2 xl:col-span-4">
        <CardHeader>
          <CardTitle>Sales (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.salesByMonth}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 