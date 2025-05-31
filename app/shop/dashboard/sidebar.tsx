"use client";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useLayoutEffect } from "react";
import { SellerInfo } from "./layout";

const navItems = [
  {
    label: "Dashboard",
    href: "/shop/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    icon: Package,
    children: [
      { label: "All Products", href: "/shop/dashboard/products" },
      { label: "Add Product", href: "/shop/dashboard/products/new" },
    ],
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    children: [
      { label: "All Orders", href: "/shop/dashboard/orders" },
      { label: "Refunds", href: "/shop/dashboard/orders/refunds" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Profile", href: "/shop/dashboard/settings/profile" },
      { label: "Bank Info", href: "/shop/dashboard/settings/bank" },
      { label: "Security", href: "/shop/dashboard/settings/security" },
    ],
  },
];

interface SidebarProps {
  seller: SellerInfo;
}

function Expandable({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (open && ref.current) {
      setHeight(ref.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open, children]);

  return (
    <div
      style={{
        maxHeight: open ? height : 0,
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(8px)",
        transition:
          "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s, transform 0.25s",
        overflow: "hidden",
      }}
      aria-hidden={!open}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

export default function Sidebar({ seller }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="flex flex-col h-screen w-64 border-r bg-background">
      {/* User section */}
      <div className="h-20 flex items-center gap-3 px-6 border-b">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={
              seller?.logo ||
              seller?.user?.profilePictureUrl ||
              "/default-avatar.png"
            }
          />
          <AvatarFallback>
            {seller?.name
              ?.split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-lg leading-tight">
            {seller?.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {seller?.user?.name}
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname === item.href : false;
            const hasChildren = !!item.children;
            const open = openMenus[item.label] || false;
            // If any child is active, parent is active
            const isChildActive = item.children?.some(
              (child) => pathname === child.href
            );
            return hasChildren ? (
              <Collapsible
                key={item.label}
                open={!!(open || isChildActive)}
                onOpenChange={() => handleToggle(item.label)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isChildActive ? "secondary" : "ghost"}
                    className="justify-between w-full gap-2 px-2 py-2 flex items-center"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        open || isChildActive ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <Expandable open={!!(open || isChildActive)}>
                  <div className="ml-7 flex flex-col gap-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        href={child.href}
                        key={child.href}
                        legacyBehavior
                        passHref
                      >
                        <Button
                          variant={
                            pathname.startsWith(child.href)
                              ? "secondary"
                              : "ghost"
                          }
                          className="justify-start w-full text-sm px-2 py-2"
                        >
                          {child.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </Expandable>
              </Collapsible>
            ) : (
              <Link href={item.href!} key={item.label} legacyBehavior passHref>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="justify-start w-full gap-2 px-2 py-2 flex items-center"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          <Separator className="my-4" />
          <Button
            variant="ghost"
            className="justify-start w-full gap-2 text-destructive px-2 py-2"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </nav>
      </ScrollArea>
    </aside>
  );
}
