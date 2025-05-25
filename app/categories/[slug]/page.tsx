import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import { db } from "@/config/db";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/products/product-grid";
import ProductFilters from "@/components/products/product-filters";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Package } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await db.productCategory.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const products = await getProducts();
  const categories = await getCategories();

  // Filter products by category and search params
  const filteredProducts = products.filter((product) => {
    let shouldFilter = product.category.id === category.id;
    const { search, price, rating } = searchParams;

    if (search && typeof search === "string") {
      const searchTerm = search.toLowerCase();
      shouldFilter =
        shouldFilter &&
        (product.name.toLowerCase().includes(searchTerm) ||
          product.headline.toLowerCase().includes(searchTerm));
    }

    if (price && typeof price === "string") {
      const [min, max] = price.split("-").map(Number);
      shouldFilter = shouldFilter && product.price >= min && product.price <= max;
    }

    if (rating && typeof rating === "string") {
      const minRating = parseInt(rating);
      shouldFilter = shouldFilter && product.rating >= minRating;
    }

    return shouldFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={`/categories/${category.slug}`}>
            {category.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex items-center gap-2 mt-8 mb-2">
        <Package className="w-5 h-5 text-primary" />
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        {category.description} ({category._count.products} products)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ProductFilters categories={categories} />
        </div>
        <div className="md:col-span-3">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}