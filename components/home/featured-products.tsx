import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MappedProducts } from "@/lib/products";
import { ProductCard } from "../products/product-card";

interface FeaturedProductsProps {
  products: MappedProducts;
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="container px-4 mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Applications
          </h2>
          <p className="text-muted-foreground mt-1">
            Handpicked software solutions to enhance your workflow
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/products">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
