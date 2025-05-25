import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/products/product-grid";

export default async function DealsPage() {
  const products = await getProducts();
  const dealsProducts = products.filter(product => product.onSale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Special Deals</h1>
        <p className="text-muted-foreground mt-2">
          Take advantage of our limited-time offers on premium software
        </p>
      </div>

      {dealsProducts.length > 0 ? (
        <ProductGrid products={dealsProducts} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No deals available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
}