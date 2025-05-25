"use client";

import { MappedSellerById } from "@/app/sellers/[id]/page";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  item: MappedSellerById;
}

export default function SellerProducts({ item }: Props) {
  const [displayCount, setDisplayCount] = useState(6);

  if (!item) {
    return (
      <div className="text-center text-gray-500">No products available</div>
    );
  }
  const { products } = item.seller;

  const showMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Products ({products.length})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.slice(0, displayCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {displayCount < products.length && (
        <div className="text-center mt-8">
          <Button onClick={showMore} variant="outline">
            Show More Products
          </Button>
        </div>
      )}
    </div>
  );
}
