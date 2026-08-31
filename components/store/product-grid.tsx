import type { Product } from "@/src/types/product";
import { ProductCard } from "./product-card";

export function ProductGrid({ products, limit }: { products: Product[]; limit?: number }) {
  const visible = typeof limit === "number" ? products.slice(0, limit) : products;
  return (
    <div className="product-grid">
      {visible.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
