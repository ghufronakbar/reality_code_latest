import { getProducts } from "@/lib/products";
import ProductFilters from "@/components/products/product-filters";
import ProductGrid from "@/components/products/product-grid";
import SearchBar from "@/components/ui/search-bar";
import { getCategories } from "@/lib/categories";

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
      console.log("Filtering by category:", arrayCategory);
      console.log("Product category:", product.category.id);
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
      <h1 className="text-3xl font-bold mb-8">Browse Applications</h1>
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
