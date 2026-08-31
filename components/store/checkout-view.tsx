"use client";

import Link from "next/link";
import { CreditCard, Landmark, LockKeyhole, Truck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { selectCartSubtotal, useShopStore } from "@/src/store/shopStore";
import type { CheckoutDetails } from "@/src/types/product";
import { formatPrice } from "@/src/utils/format";
import { EmptyState } from "./store-states";

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number."),
  country: z.string().min(2, "Choose a country."),
  city: z.string().min(2, "Enter your city."),
  address: z.string().min(6, "Enter the full delivery address."),
  postalCode: z.string().min(3, "Enter a postal code."),
  paymentMethod: z.enum(["card", "cash", "paypal"]),
});

export function CheckoutView() {
  const cart = useShopStore((state) => state.cart);
  const subtotal = useShopStore(selectCartSubtotal);
  const placeOrder = useShopStore((state) => state.placeOrder);
  const shipping = subtotal >= 100 ? 0 : 8;
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<CheckoutDetails>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "United Arab Emirates", paymentMethod: "card" },
  });
  const paymentMethod = watch("paymentMethod");

  if (!cart.length) {
    return <div className="page-width empty-page"><EmptyState title="Your bag is empty" description="Add at least one product before opening checkout." action={<Button asChild><Link href="/products">Continue shopping</Link></Button>} /></div>;
  }

  function submit(details: CheckoutDetails) {
    const order = placeOrder(details);
    if (order) window.location.assign("/order-success");
  }

  return (
    <div className="page-width checkout-page">
      <div className="checkout-heading"><Link href="/cart">← Return to bag</Link><p className="eyebrow">Secure checkout</p><h1>Delivery & payment</h1></div>
      <form onSubmit={handleSubmit(submit)} noValidate className="checkout-layout">
        <div className="checkout-fields">
          <fieldset className="form-section"><legend><span>01</span> Contact information</legend><div className="form-grid">
            <Field label="Full name" error={errors.fullName?.message}><Input autoComplete="name" aria-invalid={!!errors.fullName} {...register("fullName")} /></Field>
            <Field label="Email address" error={errors.email?.message}><Input type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} /></Field>
            <Field label="Phone number" error={errors.phone?.message} className="form-span"><Input type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} /></Field>
          </div></fieldset>
          <fieldset className="form-section"><legend><span>02</span> Shipping address</legend><div className="form-grid">
            <Field label="Country" error={errors.country?.message} className="form-span"><select aria-invalid={!!errors.country} {...register("country")}><option>United Arab Emirates</option><option>Saudi Arabia</option><option>United Kingdom</option><option>United States</option><option>Germany</option></select></Field>
            <Field label="City" error={errors.city?.message}><Input autoComplete="address-level2" aria-invalid={!!errors.city} {...register("city")} /></Field>
            <Field label="Postal code" error={errors.postalCode?.message}><Input autoComplete="postal-code" aria-invalid={!!errors.postalCode} {...register("postalCode")} /></Field>
            <Field label="Street address" error={errors.address?.message} className="form-span"><Input autoComplete="street-address" aria-invalid={!!errors.address} {...register("address")} /></Field>
          </div></fieldset>
          <fieldset className="form-section"><legend><span>03</span> Payment</legend><div className="payment-options">
            <label className={paymentMethod === "card" ? "is-selected" : ""}><input type="radio" value="card" {...register("paymentMethod")} /><CreditCard /><span><strong>Credit or debit card</strong><small>Visa, Mastercard, American Express</small></span></label>
            <label className={paymentMethod === "paypal" ? "is-selected" : ""}><input type="radio" value="paypal" {...register("paymentMethod")} /><Landmark /><span><strong>PayPal</strong><small>Continue securely after review</small></span></label>
            <label className={paymentMethod === "cash" ? "is-selected" : ""}><input type="radio" value="cash" {...register("paymentMethod")} /><Truck /><span><strong>Cash on delivery</strong><small>Available for selected addresses</small></span></label>
          </div>
          {paymentMethod === "card" && <div className="card-note"><LockKeyhole /> Card entry is disabled in this portfolio demo. No payment details are collected.</div>}
          </fieldset>
        </div>

        <aside className="order-summary checkout-summary">
          <h2>Your order</h2>
          <div className="checkout-items">{cart.map((item) => <div key={item.key}><div className="checkout-thumb"><img src={item.product.thumbnail} alt="" /><span>{item.quantity}</span></div><span><strong>{item.product.title}</strong><small>{[item.variant.color, item.variant.size].filter(Boolean).join(" · ")}</small></span><b>{formatPrice(item.product.price * item.quantity)}</b></div>)}</div>
          <dl><div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Delivery</dt><dd>{shipping ? formatPrice(shipping) : "Complimentary"}</dd></div><div className="summary-total"><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div></dl>
          <Button size="lg" type="submit" className="summary-checkout" disabled={isSubmitting}>{isSubmitting ? "Placing order…" : "Place order"}</Button>
          <p className="legal-copy">By placing this order you agree to the terms of sale. This is a demonstration checkout and no charge will be made.</p>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return <label className={`form-field ${className}`}><span>{label}</span>{children}{error && <small role="alert">{error}</small>}</label>;
}
