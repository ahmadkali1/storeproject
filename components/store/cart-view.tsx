"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { persistShopMutation } from "@/src/services/productsApi";
import { selectCartSubtotal, useShopStore } from "@/src/store/shopStore";
import { formatPrice } from "@/src/utils/format";
import { EmptyState } from "./store-states";

export function CartView() {
  const cart = useShopStore((state) => state.cart);
  const subtotal = useShopStore(selectCartSubtotal);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const updateQuantity = useShopStore((state) => state.updateQuantity);
  const replaceCart = useShopStore((state) => state.replaceCart);
  const shipping = subtotal >= 100 ? 0 : 8;

  async function mutateCart(action: () => void, successMessage?: string) {
    const snapshot = cart;
    action();
    try {
      await persistShopMutation();
      if (successMessage) toast.success(successMessage);
    } catch {
      replaceCart(snapshot);
      toast.error("Couldn’t update your bag. Please try again.");
    }
  }

  if (!cart.length) {
    return (
      <div className="page-width empty-page">
        <EmptyState title="Your bag is empty" description="The right thing might still be in the edit. Your saved items are waiting too." action={<div className="state-actions"><Button asChild><Link href="/products">Shop all products</Link></Button><Button variant="outline" asChild><Link href="/wishlist">View wishlist</Link></Button></div>} />
      </div>
    );
  }

  return (
    <div className="page-width commerce-page">
      <div className="commerce-title"><p className="eyebrow">Your selection</p><h1>Shopping bag</h1><p>{cart.length} {cart.length === 1 ? "line item" : "line items"}</p></div>
      <div className="cart-layout">
        <section className="cart-items" aria-label="Items in your bag">
          {cart.map((item) => (
            <article className="cart-item" key={item.key}>
              <Link href={`/products/${item.product.id}`} className="cart-image"><img src={item.product.thumbnail} alt={item.product.title} onError={(event) => { event.currentTarget.src = "/northline-hero.png"; }} /></Link>
              <div className="cart-item-info">
                <div><p>{item.product.brand}</p><h2><Link href={`/products/${item.product.id}`}>{item.product.title}</Link></h2><p className="cart-variant">{[item.variant.color, item.variant.size].filter(Boolean).join(" · ")}</p></div>
                <div className="cart-line-bottom">
                  <div className="quantity-stepper compact">
                    <button aria-label={`Decrease ${item.product.title} quantity`} disabled={item.quantity === 1} onClick={() => mutateCart(() => updateQuantity(item.key, item.quantity - 1))}><Minus /></button>
                    <span>{item.quantity}</span>
                    <button aria-label={`Increase ${item.product.title} quantity`} disabled={item.quantity >= item.product.stock} onClick={() => mutateCart(() => updateQuantity(item.key, item.quantity + 1))}><Plus /></button>
                  </div>
                  <button className="remove-link" onClick={() => mutateCart(() => removeFromCart(item.key), "Removed from your bag")}><Trash2 /> Remove</button>
                </div>
              </div>
              <strong className="cart-line-price">{formatPrice(item.product.price * item.quantity)}</strong>
            </article>
          ))}
        </section>
        <aside className="order-summary">
          <h2>Order summary</h2>
          <dl><div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Delivery</dt><dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd></div><div><dt>Estimated tax</dt><dd>Calculated at checkout</dd></div><div className="summary-total"><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div></dl>
          {subtotal < 100 && <div className="shipping-progress"><p>Add {formatPrice(100 - subtotal)} for complimentary delivery</p><div><span style={{ width: `${Math.min(100, subtotal)}%` }} /></div></div>}
          <Button asChild size="lg" className="summary-checkout"><Link href="/checkout">Continue to checkout <ArrowRight /></Link></Button>
          <div className="summary-note"><ShoppingBag /><span>Your bag is saved on this device. Taxes and delivery are confirmed before placing the order.</span></div>
        </aside>
      </div>
    </div>
  );
}
