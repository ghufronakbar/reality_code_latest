"use client";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { ReactNode, useState } from "react";
import { SellerInfo } from "./layout";

export default function DashboardLayoutClient({ seller, children }: { seller: SellerInfo; children: ReactNode }) {
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
          <div
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-30 transition-all duration-300 ease-in-out
              ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-64 pointer-events-none'}`}
          >
            <Sidebar seller={seller} />
          </div>
        </div>
        <main
          className={`flex-1 p-4 md:p-8 transition-all duration-300 ease-in-out ml-0
            ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
} 