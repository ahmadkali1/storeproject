"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopStore } from "@/src/store/shopStore";
import { ProductGrid } from "./product-grid";
import { EmptyState } from "./store-states";

export function WishlistView() {
  const wishlist = useShopStore((state) => state.wishlist);
  if (!wishlist.length) {
    return <div className="page-width empty-page"><EmptyState title="Your wishlist is quiet" description="Save products to compare them or come back to them later. They will stay on this device." action={<Button asChild><Link href="/products">Browse the catalogue</Link></Button>} /></div>;
  }
  return (
    <div className="page-width wishlist-page">
      <div className="commerce-title"><p className="eyebrow">Saved on this device</p><h1>Wishlist</h1><p><Heart fill="currentColor" /> {wishlist.length} saved {wishlist.length === 1 ? "piece" : "pieces"}</p></div>
      <ProductGrid products={wishlist} />
    </div>
  );
}
