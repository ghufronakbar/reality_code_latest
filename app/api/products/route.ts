import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { serverSession } from "@/lib/auth";

function randomString(length = 4) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export async function POST(req: NextRequest) {
  try {
    const session = await serverSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }
    const body = await req.json();
    const {
      name,
      headline,
      description,
      thumbnailUrl,
      images,
      demoVideoUrl,
      price,
      originalPrice,
      productCategoryId,
      license,
      platforms,
      tags,
      keyFeatures,
      productSpesifications,
      productTools,
    } = body;
    if (
      !name ||
      !headline ||
      !description ||
      !thumbnailUrl ||
      !images?.length ||
      !price ||
      !productCategoryId ||
      !license ||
      !platforms?.length
    ) {
      return NextResponse.json(
        { status: 400, message: "Missing required fields", data: null },
        { status: 400 }
      );
    }
    // Get seller
    const seller = await db.seller.findUnique({
      where: { userId: session.user.id },
    });
    if (!seller) {
      return NextResponse.json(
        { status: 400, message: "Seller not found", data: null },
        { status: 400 }
      );
    }
    const replacedName = name?.toLowerCase().replace(" ", "-");
    const replacedHeadline = headline?.toLowerCase().replace(" ", "-");
    // Generate slug
    const baseSlug = `${replacedName}-${replacedHeadline}-${seller.name}-${randomString(4)}`
      .replace(/\s+/g, "-")
      .toLowerCase();
    // Create product with relations
    const product = await db.product.create({
      data: {
        name,
        headline,
        description,
        thumbnailUrl,
        images,
        demoVideoUrl,
        price: Number(price),
        originalPrice: Number(originalPrice) || Number(price),
        productCategoryId,
        license,
        platforms,
        tags: tags || [],
        keyFeatures: keyFeatures || [],
        slug: baseSlug,
        sellerId: seller.id,
        productSpesifications: productSpesifications?.length
          ? {
              create: productSpesifications.map((spec: any) => ({
                name: spec.name,
                value: spec.value,
              })),
            }
          : undefined,
        productTools: productTools?.length
          ? {
              create: productTools.map((tool: any) => ({
                name: tool.name,
                value: tool.value,
                description: tool.description || null,
              })),
            }
          : undefined,
      },
      include: {
        productSpesifications: true,
        productTools: true,
        category: true,
        seller: true,
      },
    });
    return NextResponse.json({
      status: 200,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    console.error("[PRODUCT_CREATE]", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
