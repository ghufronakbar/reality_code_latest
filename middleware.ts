import { NextResponse } from "next/server";
import type { MiddlewareConfig, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware is running...");
  const now = new Date();
  const res = await fetch("https://ipinfo.io/json");
  const locationData = await res.json();
  console.log("Client Location Data:", locationData.ip);
  request.headers.set(
    "x-client-ip",
    locationData.ip || "IP address not available"
  );
  console.log("Current Date and Time:", now.toISOString());
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: "/api/test",
};
