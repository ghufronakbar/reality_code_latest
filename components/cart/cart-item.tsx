"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/helper/formatPrice";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      updateItemQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 p-4">
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.id}`}
          className="font-medium hover:underline"
        >
          {item.name}
        </Link>
        <div className="mt-1 text-sm text-muted-foreground">
          {formatPrice(item.price)}
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() =>
                updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
              }
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="h-8 w-12 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-right font-medium">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
}
