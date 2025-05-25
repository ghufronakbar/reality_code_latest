import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/products/product-grid";
import { PageHeader } from "@/components/ui/page-header";

export default async function DealsPage() {
  const products = await getProducts();
  const dealsProducts = products.filter(product => product.onSale);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        heading="Special Deals"
        description="Take advantage of our limited-time offers on premium software"
      />

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