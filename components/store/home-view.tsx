"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, PackageCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/src/hooks/useProducts";
import { useShopStore } from "@/src/store/shopStore";
import { ProductGrid } from "./product-grid";
import { ErrorState, ProductGridSkeleton } from "./store-states";

const categoryEdits = [
  { title: "Accessories", note: "Quiet finishing pieces", href: "/products?category=womens-bags", className: "category-ink" },
  { title: "Objects for home", note: "Useful, never ornamental", href: "/products?category=furniture", className: "category-stone" },
  { title: "Personal care", note: "A considered daily shelf", href: "/products?category=beauty", className: "category-clay" },
];

export function HomeView() {
  const { products, loading, error, retry } = useProducts();
  const recentlyViewed = useShopStore((state) => state.recentlyViewed);
  const featuredProducts = useMemo(() => {
    const edit = ["womens-bags", "mens-watches", "sunglasses", "furniture", "home-decoration", "mobile-accessories", "laptops", "fragrances"];
    const selected = edit.flatMap((category) => {
      const product = products.filter((item) => item.category === category).sort((a, b) => b.rating - a.rating)[0];
      return product ? [product] : [];
    });
    return [...selected, ...products.filter((product) => !selected.some((item) => item.id === product.id))].slice(0, 8);
  }, [products]);

  return (
    <>
      <section className="home-hero page-width">
        <div className="hero-copy">
          <p className="eyebrow">The everyday edit · 2026</p>
          <h1>Objects that earn their place.</h1>
          <p>Functional pieces for getting dressed, getting out, and feeling at home. Selected for use, not display.</p>
          <div className="hero-actions">
            <Button asChild size="lg"><Link href="/products">Shop the edit <ArrowRight /></Link></Button>
            <Link href="/products?category=furniture" className="text-link">See home objects</Link>
          </div>
          <p className="hero-footnote"><PackageCheck /> Complimentary delivery from $100</p>
        </div>
        <div className="hero-image-wrap">
          <img src="/northline-hero.png" alt="Black everyday accessories arranged on warm stone" />
          <Link href="/products?category=womens-bags">The carry edit <ArrowRight /></Link>
        </div>
      </section>

      <section className="page-width section-space" aria-labelledby="featured-heading">
        <div className="section-heading">
          <div><p className="eyebrow">New this week</p><h2 id="featured-heading">The latest arrivals</h2></div>
          <Link href="/products" className="text-link">View all products <ArrowRight /></Link>
        </div>
        {loading ? <ProductGridSkeleton count={8} /> : error ? <ErrorState message={error} onRetry={retry} /> : <ProductGrid products={featuredProducts} limit={8} />}
      </section>

      <section className="page-width category-edits section-space" aria-labelledby="categories-heading">
        <div className="category-lead"><p className="eyebrow">Shop by use</p><h2 id="categories-heading">Fewer, better categories.</h2><p>Find the part of your day you are shopping for. We keep the edit deliberately short.</p></div>
        <div className="category-layout">
          {categoryEdits.map((category, index) => (
            <Link href={category.href} key={category.title} className={`${category.className} category-block ${index === 0 ? "category-large" : ""}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{category.title}</h3><p>{category.note}</p></div>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-strip section-space">
        <div className="page-width editorial-inner">
          <div><p className="eyebrow">Materials note 04</p><h2>Why wear changes an object for the better.</h2></div>
          <div><p>We favor leather, metal, wool and wood that develop character instead of hiding use. Care for them, repair them, keep them moving.</p><Link href="/products">Browse enduring pieces <ArrowRight /></Link></div>
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="page-width section-space" aria-labelledby="recent-heading">
          <div className="section-heading"><div><p className="eyebrow">Pick up where you left off</p><h2 id="recent-heading">Recently viewed</h2></div><RotateCcw aria-hidden="true" /></div>
          <ProductGrid products={recentlyViewed} limit={4} />
        </section>
      )}
    </>
  );
}
