import { db } from "@/config/db";
import { serverSession } from "@/lib/auth";
import EditProductClient from "./client";
import { notFound, redirect } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await serverSession();
  if (!session?.user?.id) return redirect("/shop/dashboard/products");
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id: id },
    include: {
      productSpesifications: true,
      productTools: true,
      category: true,
      seller: true,
    },
  });
  const seller = await db.seller.findUnique({
    where: {
      userId: session.user.id,
    },
  });
  if (!product || product.seller.userId !== session.user.id || !seller)
    return notFound();
  // Fetch all categories for the select
  const categories = await db.productCategory.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return (
    <EditProductClient
      product={product}
      categories={categories}
      seller={seller}
    />
  );
}
