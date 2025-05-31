"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Star, Check, Bookmark } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { MappedProduct } from "@/lib/products";
import { formatPrice } from "@/helper/formatPrice";
import { formatDate } from "@/helper/formatDate";

interface ProductInfoProps {
  product: MappedProduct;
  isSeller?: boolean;
}

export default function ProductInfo({
  product,
  isSeller = false,
}: ProductInfoProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="text-center text-muted-foreground">
        Loading product information...
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.thumbnailUrl,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="px-2 py-1">
            {product.category.name}
          </Badge>
          <Badge variant="secondary" className="px-2 py-1">
            {/* v{product.version} TODO*/}
            v1.0
          </Badge>
          {product.onSale && (
            <Badge variant="destructive" className="px-2 py-1">
              Sale
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">
            ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xl font-bold">
          {formatPrice(product.price)}
          {product.onSale && product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through ml-2">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </p>

        {product.onSale && product.originalPrice && (
          <p className="text-sm font-medium text-destructive">
            Save {formatPrice(product.originalPrice - product.price)} (
            {product.percentageDiscount}%)
          </p>
        )}
      </div>

      <p className="text-muted-foreground">{product.headline}</p>

      {!isSeller && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleAddToCart} size="lg" className="flex-1">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button variant="outline" size="lg">
            <Bookmark className="mr-2 h-4 w-4" />
            Save for Later
          </Button>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium">Key Features</h3>
        <ul className="space-y-2">
          {product.keyFeatures?.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium">Product Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Developer</div>
          <div>{product.seller.name}</div>
          <div className="text-muted-foreground">Release Date</div>
          <div>{formatDate(product.createdAt, true)}</div>
          <div className="text-muted-foreground">License</div>
          <div>{product.license}</div>
          <div className="text-muted-foreground">Platform</div>
          <div>{product.platforms?.join(", ")}</div>
        </div>
      </div>
    </div>
  );
}
