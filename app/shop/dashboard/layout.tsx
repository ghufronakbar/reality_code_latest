import { db } from "@/config/db";
import { serverSession } from "@/lib/auth";
import { ReactNode } from "react";
import React from "react";
import DashboardLayoutClient from "./layout-client";

interface Props {
  children: ReactNode;
}

const getSellerInfo = async () => {
  const session = await serverSession();
  const seller = await db.seller.findUnique({
    where: {
      userId: session?.user.id,
    },
    select: {
      name: true,
      logo: true,
      user: {
        select: {
          name: true,
          profilePictureUrl: true,
        },
      },
    },
  });
  return seller;
};
export type SellerInfo = Awaited<ReturnType<typeof getSellerInfo>>;

export default async function SellerDashboardLayout({ children }: Props) {
  const seller = await getSellerInfo();
  return (
    <DashboardLayoutClient seller={seller}>{children}</DashboardLayoutClient>
  );
}
