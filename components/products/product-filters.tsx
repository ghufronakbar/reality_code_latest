"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MappedCategories } from "@/lib/categories";
import { formatPrice } from "@/helper/formatPrice";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  categories: MappedCategories;
}

const MAX_PRICE = 10000000;

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const searchQuery = useSearchParams().get("search") || "";
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const pathname = usePathname();

  const { replace } = useRouter();

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating((prev) => (prev === rating ? null : rating));
  };

  const resetFilters = () => {
    setPriceRange([0, 2000000]);
    setSelectedCategories([]);
    setSelectedRating(null);
    setSearchTerm("");
    const params = new URLSearchParams();
    params.set("search", "");
    params.delete("category");
    params.delete("price");
    params.delete("rating");
    replace(`${pathname}?${params.toString()}`);
  };

  const sp = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Search submitted:", searchTerm);
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    params.set("search", searchTerm.trim());
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }
    if (priceRange[0] > 0 || priceRange[1] < MAX_PRICE) {
      params.set("price", `${priceRange[0]}-${priceRange[1]}`);
    } else {
      params.delete("price");
    }
    if (selectedRating) {
      params.set("rating", selectedRating.toString());
    } else {
      params.delete("rating");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="search"
          placeholder={"Search applications..."}
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
      <Separator />

      <Accordion
        type="multiple"
        defaultValue={["categories", "price", "rating"]}
      >
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="mt-4 flex flex-col space-y-4">
              <Slider
                defaultValue={[0, MAX_PRICE]}
                max={MAX_PRICE}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatPrice(priceRange[0])}</span>
                <span className="text-sm">{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRating === rating}
                    onCheckedChange={() => handleRatingChange(rating)}
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {rating} Stars & Up
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
