import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { serverSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await serverSession();
    if (!session?.user?.id) {
      return NextResponse.json({ status: 401, message: "Unauthorized", data: null }, { status: 401 });
    }
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: { seller: true },
    });
    if (!product || product.seller.userId !== session.user.id) {
      return NextResponse.json({ status: 403, message: "Forbidden", data: null }, { status: 403 });
    }
    const body = await req.json();
    const { version, name, description, links } = body;
    if (!version || !name || !description || !Array.isArray(links) || links.length === 0) {
      return NextResponse.json({ status: 400, message: "Missing required fields", data: null }, { status: 400 });
    }
    const created = await db.productVersion.create({
      data: {
        version,
        name,
        description,
        productId: id,
        links: {
          create: links.map((l: any) => ({
            name: l.name,
            link: l.link,
            description: l.description || "",
            tier: l.tier,
          })),
        },
      },
      include: { links: true },
    });
    return NextResponse.json({ status: 200, message: "Version created", data: created });
  } catch (error) {
    console.error("[PRODUCT_VERSION_CREATE]", error);
    return NextResponse.json({ status: 500, message: "Internal server error", data: null }, { status: 500 });
  }
} 