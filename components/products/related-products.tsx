import Link from "next/link";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MappedProducts } from "@/lib/products";
import Image from "next/image";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  products: MappedProducts;
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
