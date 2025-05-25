"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, isEmpty } = useCart();
  
  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-screen flex flex-col items-center justify-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg shadow-sm divide-y">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}