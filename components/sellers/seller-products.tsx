"use client";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  products: any[]; // Using the existing product type from your schema
}

export default function SellerProducts({ products }: Props) {
  const [displayCount, setDisplayCount] = useState(6);
  
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