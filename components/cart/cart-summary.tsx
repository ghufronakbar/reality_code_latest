"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CreditCard, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/helper/formatPrice";

export default function CartSummary() {
  const { items, subtotal } = useCart();

  // Calculate values
  const shipping = 0; // Digital products have no shipping
  const tax = subtotal * 0.08; // Example tax rate
  const total = subtotal + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({items.length} items)
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Free</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-center">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-muted-foreground">
              Digital products will be available for download immediately after
              purchase.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col space-y-4">
        <Button className="w-full">
          <CreditCard className="mr-2 h-4 w-4" />
          Checkout
        </Button>

        <div className="flex items-center justify-center text-xs text-muted-foreground gap-1">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure checkout powered by Stripe</span>
        </div>
      </CardFooter>
    </Card>
  );
}
