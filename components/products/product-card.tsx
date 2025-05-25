"use client";

import { MappedProducts } from "@/lib/products";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/helper/formatPrice";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

interface Props {
  product: MappedProducts[number];
}

export const ProductCard = ({ product }: Props) => {
  const { addItem } = useCart();

  const handleAddToCart = (item: MappedProducts[number]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.thumbnailUrl,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  return (
    <Card key={product.id} className="group overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              width={400}
              height={225}
            />
          </Link>
          {product.onSale && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Sale
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{product.category.name}</Badge>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-primary text-primary mr-1" />
            <span className="text-sm font-medium">
              {product.rating ? product.rating.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="group-hover:underline"
        >
          <h3 className="font-semibold text-xl mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-2">{product.headline}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 flex justify-between items-center mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">
            {formatPrice(product.price, true)}
          </span>
          {product.onSale && product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice, true)}
            </span>
          )}
        </div>
        <Button size="sm" onClick={() => handleAddToCart(product)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
