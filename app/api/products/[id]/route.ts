import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { serverSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await serverSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: { seller: true },
    });
    if (!product || product.seller.userId !== session.user.id) {
      return NextResponse.json(
        { status: 403, message: "Forbidden", data: null },
        { status: 403 }
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
      isActive,
      productSpesifications,
      productTools,
    } = body;
    // Update product
    const updated = await db.product.update({
      where: { id },
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
        isActive,
        // Remove all spesifications and tools, then re-create
        productSpesifications: {
          deleteMany: {},
        },
        productTools: {
          deleteMany: {},
        },
      },
    });
    // Re-create spesifications
    if (productSpesifications?.length) {
      await db.productSpesification.createMany({
        data: productSpesifications.map((spec: any) => ({
          name: spec.name,
          value: spec.value,
          productId: id,
        })),
      });
    }
    // Re-create tools
    if (productTools?.length) {
      await db.productTool.createMany({
        data: productTools.map((tool: any) => ({
          name: tool.name,
          value: tool.value,
          description: tool.description || null,
          productId: id,
        })),
      });
    }
    // Return updated product with relations
    const result = await db.product.findUnique({
      where: { id },
      include: {
        productSpesifications: true,
        productTools: true,
        category: true,
        seller: true,
      },
    });
    return NextResponse.json({
      status: 200,
      message: "Product updated",
      data: result,
    });
  } catch (error) {
    console.error("[PRODUCT_UPDATE]", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
