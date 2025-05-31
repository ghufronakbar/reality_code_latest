import { getProducts, getProductBySlug, getProductById } from "@/lib/products";
import { redirect } from "next/navigation";
import ProductGallery from "@/components/products/product-gallery";
import ProductInfo from "@/components/products/product-info";
import ProductTabs from "@/components/products/product-tabs";
import ChatButton from "@/components/chat/chat-button";
import { serverSession } from "@/lib/auth";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

interface Params {
  params: Promise<{ id: string }>;
}

export default async function ProductPage(props: Params) {
  const [{ id }, session] = await Promise.all([
    await props.params,
    await serverSession(),
  ]);
  const product = await getProductById(id);

  if (!product || product.seller.userId !== session?.user?.id) {
    return redirect("/shop/dashboard/products");
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} video={product.demoVideoUrl} />
        <ProductInfo product={product} isSeller />
      </div>

      <ProductTabs
        description={product.description}
        specifications={product.productSpesifications}
        tools={product.productTools}
        reviews={product.productReviews}
      />

      <div className="fixed bottom-4 right-4 z-50">
        <ChatButton sellerId={product.sellerId} productId={product.id} />
      </div>
    </div>
  );
}
