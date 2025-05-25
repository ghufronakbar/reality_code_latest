import { getProducts, getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/products/product-gallery";
import ProductInfo from "@/components/products/product-info";
import ProductTabs from "@/components/products/product-tabs";
import RelatedProducts from "@/components/products/related-products";
import ChatButton from "@/components/chat/chat-button";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage(props: Params) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts();

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} video={product.demoVideoUrl} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs
        description={product.description}
        specifications={product.productSpesifications}
        tools={product.productTools}
        reviews={product.productReviews}
      />

      <RelatedProducts products={relatedProducts} />

      <div className="fixed bottom-4 right-4 z-50">
        <ChatButton sellerId={product.sellerId} productId={product.id} />
      </div>
    </div>
  );
}
