"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  UserIcon,
  LogOutIcon,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MappedCategories } from "@/lib/categories";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSes } from "../session-wrapper";
import { signOut } from "next-auth/react";

interface Props {
  categories: MappedCategories;
}

export default function Header({ categories }: Props) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { session } = useSes();

  const { replace } = useRouter();
  const [hovered, setHovered] = useState(false);

  if (pathname.startsWith("/shop/dashboard")) {
    return null;
  }

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    if (search.trim()) {
      // Redirect to search results page
      replace(`/search?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session) {
      setHovered(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setHovered(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <MobileNav
                categories={categories}
                onSubmitSearch={onSubmitSearch}
                setSearch={setSearch}
                search={search}
              />
            </SheetContent>
          </Sheet>

          <Link href="/" className="mr-6 flex items-center space-x-2 px-2">
            <span className="font-bold text-xl">RealityCode</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <ListItem
                          key={category.slug}
                          title={category.name}
                          href={`/categories/${category.slug}`}
                        >
                          {category.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/products" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      All Products
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/sellers" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Sellers
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/deals" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Deals
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {isSearchOpen ? (
            <form className="flex items-center gap-2" onSubmit={onSubmitSearch}>
              <Input
                type="search"
                placeholder="Search..."
                className="h-9 w-[200px] lg:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search ? (
                <Button variant="ghost" size="icon" type="submit">
                  <Search className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <ModeToggle />

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          <div className="relative">
            <Avatar
              className="h-10 w-10 rounded-full object-cover overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/profile">
                <AvatarImage
                  src={session?.user?.profilePictureUrl || ""}
                  className="object-cover"
                />
              </Link>
              <AvatarFallback className="bg-transparent">
                <div className="flex h-full items-center justify-center">
                  {session ? (
                    <Link href="/profile">
                      <p>
                        {session?.user?.name
                          ?.split(" ")
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")}
                      </p>
                    </Link>
                  ) : (
                    <Link href="/auth/signin">
                      <User className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </AvatarFallback>
            </Avatar>
            {hovered && (
              <div
                className="absolute top-full right-0 z-10 hidden rounded bg-background p-2 shadow-lg transition-opacity hover:opacity-100 md:flex flex-col gap-2 w-fit"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start flex flex-row"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start flex flex-row"
                  onClick={() => signOut()}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface MobileNavProps {
  onSubmitSearch: (e: React.FormEvent) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

function MobileNav({
  categories,
  onSubmitSearch,
  search,
  setSearch,
}: Props & MobileNavProps) {
  const { status } = useSes();
  return (
    <div className="flex flex-col h-full">
      <Link href="/" className="py-4 font-bold text-xl">
        RealityCode
      </Link>

      <form className="py-4">
        <Input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmitSearch(e)}
        />
      </form>

      <nav className="flex flex-col space-y-4 py-4">
        <Link href="/products" className="py-2 hover:underline">
          All Products
        </Link>
        <div>
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="space-y-2 pl-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="block py-1 hover:underline"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/deals" className="py-2 hover:underline">
          Deals
        </Link>
      </nav>

      <div className="mt-auto pb-8 space-y-2">
        {status === "loading" ? null : status === "authenticated" ? (
          <>
            <Link href="/profile" className="block py-2 hover:underline">
              Profile
            </Link>
            <div
              onClick={() => signOut()}
              className="block py-2 hover:underline"
            >
              Sign Out
            </div>
          </>
        ) : (
          <>
            <Link href="/auth/signin" className="block py-2 hover:underline">
              Sign In
            </Link>
            <Link href="/auth/signup" className="block py-2 hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

function navigationMenuTriggerStyle() {
  return cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 data-[active]:bg-accent/50"
  );
}
