import Link from "next/link";
import { Category } from "@/types/category";
import { Card, CardContent } from "@/components/ui/card";
import { MappedCategories } from "@/lib/categories";
import Image from "next/image";

interface CategoriesProps {
  categories: MappedCategories;
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="container px-4 mx-auto">
      <h2 className="text-3xl font-bold tracking-tight mb-8">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="h-40 overflow-hidden group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10" />
              <Image
                src={category.thumbnailUrl}
                alt={category.name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                width={300}
                height={160}
              />
              <CardContent className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <h3 className="font-medium text-white text-lg">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {category._count.products} products
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
