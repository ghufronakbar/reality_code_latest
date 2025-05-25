import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { MappedProducts } from "@/lib/products";
import Image from "next/image";
import { formatPrice } from "@/helper/formatPrice";

interface TrendingProductsProps {
  products: MappedProducts;
}

export default function TrendingProducts({ products }: TrendingProductsProps) {
  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trending Now
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Top Applications
          </h2>
          <p className="text-muted-foreground mt-1">
            The most popular software choices this month
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/products" className="flex items-center gap-2">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.slice(0, 3).map((product, index) => (
          <div
            key={product.slug}
            className={`relative group overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow ${
              index === 0 ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                index === 0 ? "h-[400px]" : "h-[250px]"
              }`}
              width={800}
              height={index === 0 ? 400 : 250}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/20 backdrop-blur-sm text-primary px-2 py-1 rounded text-xs font-medium">
                  #{index + 1} Top Seller
                </span>
              </div>
              <h3 className="text-white font-bold text-2xl mb-2">
                {product.name}
              </h3>
              <p className="text-white/80 line-clamp-2 mb-4">
                {product.headline}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg">
                  {formatPrice(product.price, true)}
                </span>
                <Button size="sm" asChild>
                  <Link href={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-6">
          {products.slice(3, 6).map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Image
                src={product.thumbnailUrl}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
                width={64}
                height={64}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
