import { db } from "@/config/db";
import { Product } from "@/types/product";

// Function to get all products
export async function getProducts() {
  const products = await db.product.findMany({
    where: {
      AND: [
        {
          isActive: true,
        },
        {
          isDeleted: false,
        },
      ],
    },
    include: {
      category: true,
      seller: true,
      productReviews: {
        select: {
          rating: true,
        },
      },
    },
  });
  const data = products.map((product) => {
    const onSale = product.originalPrice > product.price;
    const percentageDiscount = onSale
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;
    const rating =
      product.productReviews.reduce((acc, review) => acc + review.rating, 0) /
      (product.productReviews.length || 1);
    return {
      ...product,
      onSale,
      percentageDiscount,
      rating,
      reviewCount: product.productReviews.length,
    };
  });
  return data;
}

export type MappedProducts = Awaited<ReturnType<typeof getProducts>>;

// Function to get a product by ID
export async function getProductBySlug(slug: string) {
  const products = await db.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      seller: true,
      productReviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              profilePictureUrl: true,
            },
          },
        },
      },
      productSpesifications: true,
      productTools: true,
    },
  });
  if (!products) return null;
  const data = {
    ...products,
    onSale: products.originalPrice > products.price,
    rating:
      products.productReviews.reduce((acc, review) => acc + review.rating, 0) /
      (products.productReviews.length || 1),
    reviewCount: products.productReviews.length,
    percentageDiscount: products.originalPrice
      ? Math.round(
          ((products.originalPrice - products.price) / products.originalPrice) *
            100
        )
      : 0,
  };

  return data;
}
export type MappedProduct = Awaited<ReturnType<typeof getProductBySlug>>;
