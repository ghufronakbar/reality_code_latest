import { db } from "@/config/db";
import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
export async function getIPAddress() {
  const h = await headers();
  const ip = Object.entries(h)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  return ip;
}

export async function GET(req: NextRequest) {
  const ipAddress = await getIPAddress();
  console.log("Request IP Address:", ipAddress);

  return NextResponse.json({
    message: "This is a seed route for initializing data.",
    status: "success",
    ipAddress: ipAddress || "IP address not available",
    timestamp: new Date().toISOString(),
  });
}
export const dynamic = "force-static";

