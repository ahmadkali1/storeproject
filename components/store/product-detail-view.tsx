"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Heart, Minus, Plus, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getProduct, persistShopMutation } from "@/src/services/productsApi";
import { useProducts } from "@/src/hooks/useProducts";
import { useShopStore } from "@/src/store/shopStore";
import type { Product } from "@/src/types/product";
import { formatCategory, formatPrice, oldPrice } from "@/src/utils/format";
import { ProductGrid } from "./product-grid";
import { ErrorState } from "./store-states";

export function ProductDetailView({ productId }: { productId: number }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [storage, setStorage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const addToCart = useShopStore((state) => state.addToCart);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const wishlist = useShopStore((state) => state.wishlist);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const setWishlist = useShopStore((state) => state.setWishlist);
  const addRecentlyViewed = useShopStore((state) => state.addRecentlyViewed);
  const recentlyViewed = useShopStore((state) => state.recentlyViewed);
  const { products: catalogue } = useProducts();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getProduct(productId, controller.signal)
      .then((result) => {
        setProduct(result);
        addRecentlyViewed(result);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "This product could not be loaded.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [productId, requestKey, addRecentlyViewed]);

  const needsSize = product ? /(clothing|dress|shirt|shoe|tops)/.test(product.category) : false;
  const needsStorage = product ? /(laptop|smartphone|tablet)/.test(product.category) : false;
  const needsColor = Boolean(product);
  const isValid = (!needsColor || color) && (!needsSize || size) && (!needsStorage || storage);
  const isSaved = product ? wishlist.some((item) => item.id === product.id) : false;
  const related = useMemo(() => {
    if (!product) return [];
    return catalogue.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  }, [catalogue, product]);

  if (loading) return <ProductDetailSkeleton />;
  if (error || !product) return <div className="page-width detail-error"><ErrorState message={error || "Product not found."} onRetry={() => setRequestKey((key) => key + 1)} /></div>;

  const images = Array.from(new Set([...(product.images || []), product.thumbnail])).slice(0, 5);
  const comparison = oldPrice(product.price, product.discountPercentage);

  async function addProduct() {
    if (!isValid || !product || product.stock < 1) return;
    setAdding(true);
    const variant = { color, size: needsStorage ? storage : size };
    const key = addToCart(product, quantity, variant);
    try {
      await persistShopMutation();
      toast.success("Added to your bag");
    } catch {
      removeFromCart(key);
      toast.error("Couldn’t update your bag. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function saveProduct() {
    if (!product) return;
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

  return (
    <>
      <div className="page-width breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><ChevronRight /><Link href="/products">Products</Link><ChevronRight /><span aria-current="page">{product.title}</span>
      </div>
      <div className="page-width product-detail">
        <section className="product-gallery" aria-label={`${product.title} images`}>
          <div className="gallery-thumbs" aria-label="Choose product image">
            {images.map((image, index) => (
              <button key={`${image}-${index}`} className={activeImage === index ? "is-active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`} aria-pressed={activeImage === index}>
                <img src={image} alt="" onError={(event) => { event.currentTarget.src = "/northline-hero.png"; }} />
              </button>
            ))}
          </div>
          <div className="gallery-main">
            <img src={images[activeImage]} alt={`${product.title}, view ${activeImage + 1}`} onError={(event) => { event.currentTarget.src = "/northline-hero.png"; }} />
            <div className="gallery-dots" aria-hidden="true">{images.map((_, index) => <span className={activeImage === index ? "is-active" : ""} key={index} />)}</div>
          </div>
        </section>

        <section className="product-info">
          <p className="product-brand">{product.brand}</p>
          <h1>{product.title}</h1>
          <div className="detail-rating"><span><Star fill="currentColor" /> {product.rating.toFixed(1)}</span><a href="#reviews">{Math.max(12, Math.round(product.rating * 37))} reviews</a></div>
          <div className="detail-price"><strong>{formatPrice(product.price)}</strong>{comparison && <del>{formatPrice(comparison)}</del>}{product.discountPercentage >= 5 && <span>Save {Math.round(product.discountPercentage)}%</span>}</div>
          <p className="detail-description">{product.description}</p>
          <div className="stock-line"><span className={product.stock <= 8 ? "low" : ""} />{product.stock <= 8 ? `Low stock — ${product.stock} remaining` : "In stock and ready to ship"}</div>

          <VariantGroup label="Color" required>
            <div className="color-options">
              {["Black", "Stone", "Rust"].map((option) => (
                <button key={option} className={color === option ? "is-selected" : ""} onClick={() => setColor(option)} aria-pressed={color === option}><span data-color={option.toLowerCase()} />{option}</button>
              ))}
            </div>
          </VariantGroup>

          {needsSize && <VariantGroup label="Size" required><div className="size-options">{["S", "M", "L", "XL"].map((option) => <button key={option} disabled={option === "XL"} className={size === option ? "is-selected" : ""} onClick={() => setSize(option)} aria-pressed={size === option}>{option}</button>)}</div><Link href="#size-guide" className="variant-help">Size guide</Link></VariantGroup>}
          {needsStorage && <VariantGroup label="Storage" required><div className="size-options">{["256 GB", "512 GB", "1 TB"].map((option) => <button key={option} className={storage === option ? "is-selected" : ""} onClick={() => setStorage(option)} aria-pressed={storage === option}>{option}</button>)}</div></VariantGroup>}

          <div className="purchase-row">
            <div className="quantity-stepper" aria-label="Quantity selector">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity === 1} aria-label="Decrease quantity"><Minus /></button>
              <span aria-live="polite">{quantity}</span>
              <button onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} disabled={quantity >= product.stock} aria-label="Increase quantity"><Plus /></button>
            </div>
            <Button size="lg" className="add-main" onClick={addProduct} disabled={!isValid || adding || product.stock < 1}>{adding ? "Adding…" : product.stock < 1 ? "Out of stock" : isValid ? "Add to bag" : "Choose options"}</Button>
            <Button variant="outline" size="icon-lg" onClick={saveProduct} aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}><Heart fill={isSaved ? "currentColor" : "none"} /></Button>
          </div>
          <div className="purchase-note">Pay in full or choose installments at checkout.</div>

          <div className="service-list" id="delivery">
            <div><Truck /><span><strong>Delivery</strong>{product.shippingInformation}</span></div>
            <div><RotateCcw /><span><strong>Returns</strong>{product.returnPolicy}</span></div>
            <div><ShieldCheck /><span><strong>Product assurance</strong>Authenticity checked by our buying team</span></div>
          </div>
          <details><summary>Product details <Plus /></summary><p>Category: {formatCategory(product.category)}. SKU: {product.sku || `NL-${product.id}`}. Materials and care information are included with the product.</p></details>
          <details><summary>Delivery & returns <Plus /></summary><p>{product.shippingInformation}. {product.returnPolicy}. Items should be returned unused with original packaging.</p></details>
        </section>
      </div>

      {related.length > 0 && <section className="page-width section-space"><div className="section-heading"><div><p className="eyebrow">From the same edit</p><h2>You may also like</h2></div></div><ProductGrid products={related} /></section>}
      {recentlyViewed.filter((item) => item.id !== product.id).length > 0 && <section className="page-width section-space recent-detail"><div className="section-heading"><div><p className="eyebrow">Your recent history</p><h2>Recently viewed</h2></div></div><ProductGrid products={recentlyViewed.filter((item) => item.id !== product.id)} limit={4} /></section>}
    </>
  );
}

function VariantGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <fieldset className="variant-group"><legend>{label} {required && <span>Required</span>}</legend>{children}</fieldset>;
}

function ProductDetailSkeleton() {
  return (
    <div className="page-width product-detail detail-skeleton" aria-label="Loading product" aria-busy="true">
      <div className="detail-image-skeleton shimmer" />
      <div className="detail-copy-skeleton"><div className="skeleton-line shimmer w-1/3" /><div className="skeleton-line shimmer w-5/6 h-10" /><div className="skeleton-line shimmer w-1/2" /><div className="skeleton-block shimmer" /></div>
    </div>
  );
}
