import { getCategories } from "@/lib/categories";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Package className="w-5 h-5 text-primary" />
        <h1 className="text-3xl font-bold">Product Categories</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Browse our collection of software products by category
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group"
          >
            <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
              <div className="relative h-48">
                <Image
                  src={category.thumbnailUrl}
                  alt={category.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {category.name}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {category._count.products} products
                  </p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}