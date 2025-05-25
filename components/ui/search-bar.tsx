"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search...",
}: SearchBarProps) {
  const sp = useSearchParams();
  const query = sp.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const pathname = usePathname();

  const { replace } = useRouter();

  const setQuery = (newQuery: string) => {
    const params = new URLSearchParams(sp.toString());
    if (newQuery) {
      params.set("search", newQuery);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const handleSubmit = (e: React.FormEvent) => {
    console.log("Search submitted:", searchTerm);
    e.preventDefault();    
    setQuery(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-12"
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
  );
}
