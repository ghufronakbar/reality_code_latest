"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Plus, ShoppingBag, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface SellerDashboardHeaderProps {
  seller: any;
  metrics: any;
}

export default function SellerDashboardHeader({ seller, metrics }: SellerDashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage src={seller.logo || seller.user?.profilePictureUrl || "/default-avatar.png"} />
              <AvatarFallback className="bg-muted text-muted-foreground text-3xl font-bold">
                {seller.name?.split(" ").slice(0, 2).map((w: string) => w[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold leading-tight">{seller.name}</span>
                {seller.isVerified && (
                  <Badge variant="secondary" className="h-6">
                    <CheckCircle className="h-4 w-4 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground text-sm mt-1">
                {seller.businessType} &bull; {seller.businessAddress}
              </div>
            </div>
          </div>
          <Separator orientation="vertical" className="hidden md:block h-24 mx-6" />
          <div className="flex-1 flex flex-row gap-6 items-center justify-between w-full">
            <div className="flex flex-row gap-6 w-full md:w-auto justify-center">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{metrics.totalProducts}</span>
                <span className="text-xs text-muted-foreground">Products</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{metrics.totalReview}</span>
                <span className="text-xs text-muted-foreground">Reviews</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{metrics.averageRating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">Avg. Rating</span>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                <span className="sr-only">{open ? "Collapse" : "Expand"} seller details</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <Separator className="my-4" />
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
            <div className="flex flex-row gap-2 w-full md:w-auto justify-center">
              <Link href="/shop/dashboard/products/new">
                <Button variant="default" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </Link>
              <Link href="/shop/dashboard/orders">
                <Button variant="outline" className="gap-2">
                  <ShoppingBag className="h-4 w-4" /> View Orders
                </Button>
              </Link>
              <Link href="/shop/dashboard/payouts">
                <Button variant="secondary" className="gap-2">
                  <DollarSign className="h-4 w-4" /> Withdraw
                </Button>
              </Link>
            </div>
            {/* You can add more seller details or alerts here if needed */}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
} 