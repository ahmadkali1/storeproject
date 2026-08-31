"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFilters, SortOption } from "@/src/types/product";
import { formatCategory, formatPrice } from "@/src/utils/format";

type FilterControlsProps = {
  filters: ProductFilters;
  categories: string[];
  onChange: (filters: ProductFilters) => void;
  onClear: () => void;
};

function FilterBody({ filters, categories, onChange, onClear }: FilterControlsProps) {
  const visibleCategories = Array.from(
    new Set([
      ...categories.filter((category) => ["beauty", "fragrances", "furniture", "home-decoration", "kitchen-accessories", "laptops", "mens-shirts", "mens-shoes", "mens-watches", "sunglasses", "womens-bags", "womens-dresses"].includes(category)),
      ...(filters.category !== "all" ? [filters.category] : []),
    ]),
  );
  return (
    <div className="filter-body">
      <div className="filter-heading">
        <h2>Filter</h2>
        <button onClick={onClear}>Clear all</button>
      </div>
      <fieldset className="filter-group">
        <legend>Category</legend>
        <label className="filter-choice">
          <input
            type="radio"
            name="category"
            checked={filters.category === "all"}
            onChange={() => onChange({ ...filters, category: "all" })}
          />
          <span>All categories</span>
        </label>
        {visibleCategories.map((category) => (
          <label className="filter-choice" key={category}>
            <input
              type="radio"
              name="category"
              checked={filters.category === category}
              onChange={() => onChange({ ...filters, category })}
            />
            <span>{formatCategory(category)}</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="filter-group">
        <legend>Maximum price</legend>
        <Slider
          min={20}
          max={2000}
          step={20}
          value={[filters.maxPrice]}
          onValueChange={(value) => onChange({ ...filters, maxPrice: value[0] })}
          aria-label="Maximum price"
        />
        <div className="filter-range"><span>$20</span><strong>{formatPrice(filters.maxPrice)}</strong></div>
      </fieldset>
      <fieldset className="filter-group">
        <legend>Rating</legend>
        {[0, 4, 4.5].map((rating) => (
          <label className="filter-choice" key={rating}>
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === rating}
              onChange={() => onChange({ ...filters, minRating: rating })}
            />
            <span>{rating === 0 ? "Any rating" : `${rating}+ stars`}</span>
          </label>
        ))}
      </fieldset>
      <label className="filter-choice border-top">
        <Checkbox
          checked={filters.inStockOnly}
          onCheckedChange={(checked) => onChange({ ...filters, inStockOnly: checked === true })}
        />
        <span>In stock only</span>
      </label>
    </div>
  );
}

export function DesktopFilters(props: FilterControlsProps) {
  return <aside className="desktop-filters" aria-label="Product filters"><FilterBody {...props} /></aside>;
}

export function MobileFilters(props: FilterControlsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="mobile-filter-trigger"><SlidersHorizontal /> Filter</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-xl">
        <SheetHeader><SheetTitle>Filter products</SheetTitle></SheetHeader>
        <FilterBody {...props} />
      </SheetContent>
    </Sheet>
  );
}

export function SortSelect({ value, onChange }: { value: SortOption; onChange: (value: SortOption) => void }) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as SortOption)}>
      <SelectTrigger aria-label="Sort products"><SelectValue placeholder="Sort by" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="price-asc">Price: Low to high</SelectItem>
        <SelectItem value="price-desc">Price: High to low</SelectItem>
        <SelectItem value="rating">Highest rated</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
      </SelectContent>
    </Select>
  );
}
