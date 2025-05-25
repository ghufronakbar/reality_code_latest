"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function SellerFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [verified, setVerified] = useState(searchParams.get("verified") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "rating");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const handleVerifiedChange = (checked: boolean) => {
    setVerified(checked);
    const params = new URLSearchParams(searchParams);
    
    if (checked) {
      params.set("verified", "true");
    } else {
      params.delete("verified");
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Filters</h3>
        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-8"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      <div>
        <h3 className="font-medium mb-4">Sort By</h3>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="products">Products Count</SelectItem>
            <SelectItem value="sales">Total Sales</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-4">Seller Status</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified"
            checked={verified}
            onCheckedChange={handleVerifiedChange}
          />
          <label
            htmlFor="verified"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Verified Sellers Only
          </label>
        </div>
      </div>
    </div>
  );
}