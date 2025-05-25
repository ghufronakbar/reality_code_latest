import { getProducts } from "@/lib/products";
import ProductFilters from "@/components/products/product-filters";
import ProductGrid from "@/components/products/product-grid";
import SearchBar from "@/components/ui/search-bar";
import { getCategories } from "@/lib/categories";
import { PageHeader } from "@/components/ui/page-header";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const products = await getProducts();
  const categories = await getCategories();
  const { category, search, price, rating } = await searchParams;

  // Filter products based on search params
  const filteredProducts = products.filter((product) => {
    let shouldFilter = true;
    if (category && typeof category === "string") {
      const arrayCategory = category.split(",");
      shouldFilter = arrayCategory.includes(product.category.id);
    }
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      shouldFilter =
        product.name.toLowerCase().includes(searchTerm) ||
        product.headline.toLowerCase().includes(searchTerm);
    }
    if (price) {
      const stringPrice = price as string;
      const priceRange = stringPrice.split("-").map(Number);
      shouldFilter =
        product.price >= priceRange[0] && product.price <= priceRange[1];
    }

    if (rating && typeof rating === "string") {
      const ratingValue = parseInt(rating);
      shouldFilter = product.rating >= ratingValue;
    }

    return shouldFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        heading="Browse Applications"
        description="Discover and purchase high-quality software applications for every need"
      />
      
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