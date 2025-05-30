import { ReactNode, useState } from "react";
import { SellerInfo } from "./layout";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

function DashboardLayoutClient({
  seller,
  children,
}: {
  seller: SellerInfo;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex flex-col min-h-screen bg-muted/50">
      <Navbar
        sidebar={<Sidebar seller={seller} />}
        onSidebarToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex w-full">
        <div className="hidden md:block">
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-30">
            {sidebarOpen && <Sidebar seller={seller} />}
          </div>
        </div>
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64">{children}</main>
      </div>
    </div>
  );
}
