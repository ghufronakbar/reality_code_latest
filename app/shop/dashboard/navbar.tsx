"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, ReactNode } from "react";
import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSes } from "@/components/session-wrapper";
import { signOut } from "next-auth/react";

interface NavbarProps {
  sidebar: ReactNode;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
}

export default function Navbar({ sidebar, onSidebarToggle, sidebarOpen }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { session } = useSes();
  const user = session?.user;
  return (
    <nav className="w-full h-16 flex items-center justify-between px-4 border-b bg-background sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          aria-label="Toggle sidebar"
          onClick={onSidebarToggle}
        >
          <span className="relative flex items-center justify-center w-5 h-5">
            <ChevronLeft
              className={`absolute left-0 top-0 h-5 w-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
            />
            <Menu
              className={`absolute left-0 top-0 h-5 w-5 transition-all duration-300 ${sidebarOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
            />
          </span>
        </Button>
        {/* Mobile sidebar toggle */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            {sidebar}
          </SheetContent>
        </Sheet>
        <span className="font-bold text-xl tracking-tight select-none">RealityCode</span>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.profilePictureUrl || undefined} alt={user?.name || user?.email || "User"} />
                <AvatarFallback>{user?.name?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium leading-none">{user?.name || "No Name"}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/shop/dashboard/profile">Profile</a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
} 