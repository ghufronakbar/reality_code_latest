import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    const { data } = await req.json();
    const { name, email, password } = data;
    if (!name || !email || !password)
      return NextResponse.json("All fields are required", { status: 400 });

    const userExists = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return NextResponse.json("User already exists", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        provider: "credentials",
        role: "User",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
};
