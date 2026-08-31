"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useProducts } from "@/src/hooks/useProducts";
import type { Product, ProductFilters } from "@/src/types/product";
import { formatCategory } from "@/src/utils/format";
import { DesktopFilters, MobileFilters, SortSelect } from "./filter-controls";
import { ProductGrid } from "./product-grid";
import { EmptyState, ErrorState, ProductGridSkeleton } from "./store-states";

const defaultFilters: ProductFilters = {
  category: "all",
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
  sort: "featured",
};

function applyFilters(products: Product[], filters: ProductFilters) {
  const filtered = products.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category) return false;
    if (product.price > filters.maxPrice) return false;
    if (product.rating < filters.minRating) return false;
    if (filters.inStockOnly && product.stock < 1) return false;
    return true;
  });
  return [...filtered].sort((a, b) => {
    if (filters.sort === "price-asc") return a.price - b.price;
    if (filters.sort === "price-desc") return b.price - a.price;
    if (filters.sort === "rating") return b.rating - a.rating;
    if (filters.sort === "newest") return b.id - a.id;
    const categoryPriority: Record<string, number> = {
      "womens-bags": 12,
      "mens-watches": 11,
      sunglasses: 10,
      furniture: 9,
      "home-decoration": 8,
      "mobile-accessories": 7,
      laptops: 6,
      "womens-dresses": 5,
      "mens-shirts": 5,
      beauty: 4,
      fragrances: 4,
      "kitchen-accessories": 3,
    };
    const score = (product: Product) => (categoryPriority[product.category] || 0) * 100 + product.rating * 10 + product.discountPercentage;
    return score(b) - score(a);
  });
}

export function CatalogueView({ mode = "products" }: { mode?: "products" | "search" }) {
  const params = useSearchParams();
  const urlQuery = params.get("q") || "";
  const initialCategory = params.get("category") || "all";
  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedQuery = useDebounce(searchInput, 400);
  const [filters, setFilters] = useState<ProductFilters>({ ...defaultFilters, category: initialCategory });
  const [visibleCount, setVisibleCount] = useState(12);
  const { products, loading, error, retry } = useProducts(mode === "search" ? debouncedQuery : "");

  useEffect(() => {
    if (mode !== "search") return;
    const currentQuery = new URL(window.location.href).searchParams.get("q") || "";
    if (currentQuery === debouncedQuery) return;
    const next = debouncedQuery ? `/search?q=${encodeURIComponent(debouncedQuery)}` : "/search";
    window.history.replaceState(null, "", next);
  }, [debouncedQuery, mode]);

  useEffect(() => {
    setVisibleCount(12);
  }, [filters, debouncedQuery]);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products]);
  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);
  const heading = mode === "search" ? (debouncedQuery ? `Results for “${debouncedQuery}”` : "Search the catalogue") : "All products";

  function clearFilters() {
    setFilters(defaultFilters);
  }

  return (
    <div className="page-width catalogue-page">
      <div className="catalogue-header">
        <p className="eyebrow">NORTHLINE catalogue</p>
        <h1>{heading}</h1>
        <p>{mode === "search" ? "Search by product, brand or material." : "A concise collection of objects for getting dressed and feeling at home."}</p>
      </div>

      {mode === "search" && (
        <div className="catalogue-search-wrap">
          <Search aria-hidden="true" />
          <Input
            autoFocus={!urlQuery}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Try ‘watch’, ‘bag’ or ‘chair’"
            aria-label="Search the catalogue"
          />
          {searchInput && <button onClick={() => setSearchInput("")} aria-label="Clear search"><X /></button>}
          {searchInput !== debouncedQuery && <span className="searching-label">Searching…</span>}
        </div>
      )}

      <div className="catalogue-toolbar">
        <div className="catalogue-count" aria-live="polite">
          {loading ? "Loading products…" : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
          {filters.category !== "all" && <span> in {formatCategory(filters.category)}</span>}
        </div>
        <div className="toolbar-actions">
          <MobileFilters filters={filters} categories={categories} onChange={setFilters} onClear={clearFilters} />
          <SortSelect value={filters.sort} onChange={(sort) => setFilters({ ...filters, sort })} />
        </div>
      </div>

      <div className="catalogue-layout">
        <DesktopFilters filters={filters} categories={categories} onChange={setFilters} onClear={clearFilters} />
        <div className="catalogue-results">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : filtered.length === 0 ? (
            <EmptyState
              search={mode === "search"}
              title={debouncedQuery ? `No results for “${debouncedQuery}”` : "No products match your filters"}
              description="Try a broader phrase, raise the maximum price, or clear the active filters."
              action={<div className="state-actions"><Button onClick={clearFilters}>Clear filters</Button>{mode === "search" && <Button variant="outline" asChild><Link href="/products">Browse all products</Link></Button>}</div>}
            />
          ) : (
            <>
              <ProductGrid products={filtered.slice(0, visibleCount)} />
              {visibleCount < filtered.length && <Button variant="outline" className="load-more" onClick={() => setVisibleCount((count) => count + 12)}>Load more <span>{Math.min(12, filtered.length - visibleCount)} products</span></Button>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
