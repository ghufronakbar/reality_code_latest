import { db } from "@/config/db";
import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  await db.$connect();

  const PASSWORD = await bcrypt.hash("12345678", 10);

  const checkUser = await db.user.findFirst();
  if (checkUser) {
    return NextResponse.json({
      message: "Database already seeded.",
      status: "success",
      timestamp: new Date().toISOString(),
    });
  }
  const productCategories = await db.productCategory.createManyAndReturn({
    data: [
      {
        name: "College Task",
        description: "College task products and resources.",
      },
      {
        name: "Business",
        description: "Business products and resources.",
      },
      {
        name: "Software as a Service (SAAS)",
        description: "Software as a Service (SAAS) products and resources.",
      },
      {
        name: "Tools and Utilities",
        description: "Tools and Utilities products and resources.",
      },
      {
        name: "Hobby",
        description: "Hobby products and resources.",
      },
    ],
  });
  const users = await db.user.createManyAndReturn({
    data: [
      {
        name: "Lans The Prodigy",
        email: "lanstheprodigy@gmail.com",
        password: PASSWORD,
        bio: "Lans The Prodigy is a software engineer with a passion for coding and technology.",
        role: "Admin",
      },
      {
        name: "John Doe",
        email: "john.doe@gmail.com",
        password: PASSWORD,
        bio: "John Doe is a software engineer with a passion for coding and technology.",
        role: "User",
      },
    ],
  });

  for await (const user of users) {
    if (user.role !== "User") continue;
    await db.seller.create({
      data: {
        name: `${user.name} Shop`,
        description: `This is ${user.name}'s shop.`,
        userId: user.id,
        isActive: true,
        isVerified: true,
        isBanned: false,
        products: {
          createMany: {
            data: [
              {
                name: `Sample Product 1 from ${user.name}`,
                headline: "Sample Product 1",
                description: "This is a sample product.",
                license: "Personal",
                originalPrice: 100,
                price: 80,
                productCategoryId: productCategories[0].id,
                thumbnailUrl:
                  "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=600",
                slug: `sample-product-1-from-${user.name
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`,
                images: [
                  "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  "https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  "https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                ],
                keyFeatures: [
                  "Feature 1: This is a sample product feature.",
                  "Feature 2: This is another sample product feature.",
                  "Feature 3: This is yet another sample product feature.",
                ],
                tags: ["sample", "product", "example", "demo", "test"],
              },
              {
                name: `Sample Product 2 from ${user.name}`,
                headline: "Sample Product 2",
                description: "This is a sample product.",
                license: "Commercial",
                originalPrice: 100,
                price: 80,
                productCategoryId: productCategories[1].id,
                thumbnailUrl:
                  "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=600",
                slug: `sample-product-2-from-${user.name
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`,
                images: [
                  "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  "https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  "https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                ],
                keyFeatures: [
                  "Feature 1: This is a sample product feature.",
                  "Feature 2: This is another sample product feature.",
                  "Feature 3: This is yet another sample product feature.",
                ],
                tags: ["sample", "product", "example", "demo", "test"],
              },
            ],
          },
        },
      },
    });
  }
  await db.$disconnect();
  return NextResponse.json({
    message: "This is a seed route for initializing data.",
    status: "success",
    timestamp: new Date().toISOString(),
  });
}
export const dynamic = "force-static";
