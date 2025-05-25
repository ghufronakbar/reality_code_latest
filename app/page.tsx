import Hero from "@/components/home/hero";
import FeaturedProducts from "@/components/home/featured-products";
import Categories from "@/components/home/categories";
import TrendingProducts from "@/components/home/trending-products";
import Newsletter from "@/components/home/newsletter";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products;
  const trendingProducts = products.slice(0, 6);
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <Categories categories={categories} />
      <TrendingProducts products={trendingProducts} />
      <Newsletter />
    </div>
  );
}
