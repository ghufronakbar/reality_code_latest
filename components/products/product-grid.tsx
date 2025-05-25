"use client";

import { MappedProducts } from "@/lib/products";
import { ProductCard } from "./product-card";
import { TbMoodEmpty } from "react-icons/tb";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface ProductGridProps {
  products: MappedProducts;
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { replace } = useRouter();
  const resetFilter = () => {
    replace("/products");
  };
  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <TbMoodEmpty className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">No Result</h1>
        <p className="text-muted-foreground mb-8">
          We couldn&apos;t find any products matching your search criteria.
          Please try adjusting your filters or search terms.
        </p>
        <Button onClick={resetFilter}>Reset Filter</Button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
