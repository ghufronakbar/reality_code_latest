import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/config/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      businessName,
      businessType,
      businessAddress,
      description,
      phoneNumber,
      website,
      bankName,
      bankAccount,
      bankHolder,
      taxIdentifier,
    } = body;

    const seller = await db.seller.create({
      data: {
        userId: session.user.id,
        name: businessName,
        description,
        businessType,
        businessAddress,
        phoneNumber,
        website,
        bankName,
        bankAccount,
        bankHolder,
        taxIdentifier,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Seller registration successful",
      data: seller,
    });
  } catch (error) {
    console.error("[SELLER_REGISTRATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}