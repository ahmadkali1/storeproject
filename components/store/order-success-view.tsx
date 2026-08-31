"use client";

import Link from "next/link";
import { ArrowRight, Check, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopStore } from "@/src/store/shopStore";
import { formatPrice } from "@/src/utils/format";
import { EmptyState } from "./store-states";

export function OrderSuccessView() {
  const order = useShopStore((state) => state.lastOrder);
  if (!order) return <div className="page-width empty-page"><EmptyState title="No recent order" description="When you place an order, its confirmation will appear here." action={<Button asChild><Link href="/products">Browse products</Link></Button>} /></div>;
  return (
    <div className="page-width success-page">
      <div className="success-icon"><Check /></div>
      <p className="eyebrow">Order received</p>
      <h1>Thank you, {order.details.fullName.split(" ")[0]}.</h1>
      <p className="success-lead">We have received your order and sent a confirmation to <strong>{order.details.email}</strong>.</p>
      <div className="success-card">
        <div className="success-meta"><div><span>Order number</span><strong>{order.id}</strong></div><div><span>Order date</span><strong>{new Date(order.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></div><div><span>Total</span><strong>{formatPrice(order.total)}</strong></div></div>
        <div className="delivery-window"><PackageCheck /><div><span>Estimated delivery</span><strong>{new Date(order.estimatedDelivery).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong><p>{order.details.address}, {order.details.city}, {order.details.country}</p></div></div>
      </div>
      <div className="success-actions"><Button asChild><Link href="/account/orders">View order <ArrowRight /></Link></Button><Button asChild variant="outline"><Link href="/products">Continue shopping</Link></Button></div>
    </div>
  );
}
