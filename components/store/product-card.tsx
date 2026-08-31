"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { persistShopMutation } from "@/src/services/productsApi";
import { useShopStore } from "@/src/store/shopStore";
import type { Product } from "@/src/types/product";
import { formatCategory, formatPrice, oldPrice } from "@/src/utils/format";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const wishlist = useShopStore((state) => state.wishlist);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const setWishlist = useShopStore((state) => state.setWishlist);
  const addToCart = useShopStore((state) => state.addToCart);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const isSaved = wishlist.some((item) => item.id === product.id);
  const comparison = oldPrice(product.price, product.discountPercentage);

  async function handleWishlist() {
    const snapshot = wishlist;
    toggleWishlist(product);
    try {
      await persistShopMutation();
      toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist");
    } catch {
      setWishlist(snapshot);
      toast.error("Couldn’t update your wishlist. Please try again.");
    }
  }

  async function handleQuickAdd() {
    if (product.stock < 1) return;
    const isApparel = /(clothing|dress|shirt|shoe|tops)/.test(product.category);
    const hasColor = /(watch|bag|sunglasses|laptop|smartphone|tablet|accessor)/.test(product.category);
    const variant = isApparel ? { color: "Black", size: "M" } : hasColor ? { color: "Black" } : {};
    const key = addToCart(product, 1, variant);
    toast.success("Added to your bag", { action: { label: "View bag", onClick: () => { window.location.href = "/cart"; } } });
    try {
      await persistShopMutation();
    } catch {
      removeFromCart(key);
      toast.error("Couldn’t update your bag. Please try again.");
    }
  }

  return (
    <article className="product-card group">
      <div className="product-media">
        <Link href={`/products/${product.id}`} aria-label={`View ${product.title}`}>
          <img
            src={product.images[0] || product.thumbnail}
            alt={product.title}
            loading={priority ? "eager" : "lazy"}
            onError={(event) => { event.currentTarget.src = "/northline-hero.png"; }}
          />
        </Link>
        {product.discountPercentage >= 8 && (
          <span className="discount-label">−{Math.round(product.discountPercentage)}%</span>
        )}
        <button
          className={`wishlist-dot ${isSaved ? "is-active" : ""}`}
          onClick={handleWishlist}
          aria-label={isSaved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          aria-pressed={isSaved}
        >
          <Heart fill={isSaved ? "currentColor" : "none"} />
        </button>
        <Button className="quick-add" onClick={handleQuickAdd} size="sm" disabled={product.stock < 1}>
          <Plus /> {product.stock < 1 ? "Out of stock" : "Quick add"}
        </Button>
      </div>
      <div className="product-copy">
        <p className="product-category">{formatCategory(product.category)}</p>
        <h3><Link href={`/products/${product.id}`}>{product.title}</Link></h3>
        <div className="price-row">
          <span>{formatPrice(product.price)}</span>
          {comparison && <del>{formatPrice(comparison)}</del>}
        </div>
        {product.stock <= 8 && <p className="low-stock">Only {product.stock} left</p>}
      </div>
    </article>
  );
}
