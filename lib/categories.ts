import { db } from "@/config/db";

// Function to get categories
export async function getCategories() {
  const categories = await db.productCategory.findMany({
    orderBy: {
      products: {
        _count: "desc",
      },
    },
    include: {
      _count: true,
    },
  });

  return categories;
}

export type MappedCategories = Awaited<ReturnType<typeof getCategories>>;
