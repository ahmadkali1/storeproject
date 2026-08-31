"use client";

import Link from "next/link";
import { MapPin, Package, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopStore } from "@/src/store/shopStore";
import { formatPrice } from "@/src/utils/format";
import { EmptyState } from "./store-states";

export function AccountView({ section = "profile" }: { section?: "profile" | "orders" }) {
  const orders = useShopStore((state) => state.orders);
  return (
    <div className="page-width account-page">
      <div className="commerce-title"><p className="eyebrow">NORTHLINE account</p><h1>{section === "orders" ? "Your orders" : "Account overview"}</h1><p>Demo profile — local to this browser.</p></div>
      <div className="account-layout">
        <nav className="account-nav" aria-label="Account sections"><Link href="/account" className={section === "profile" ? "is-active" : ""}><UserRound /> Profile</Link><Link href="/account/orders" className={section === "orders" ? "is-active" : ""}><Package /> Orders</Link><a href="#addresses"><MapPin /> Addresses</a></nav>
        {section === "orders" ? <OrdersPanel orders={orders} /> : <ProfilePanel orderCount={orders.length} />}
      </div>
    </div>
  );
}

function ProfilePanel({ orderCount }: { orderCount: number }) {
  return <section className="account-panel"><div className="profile-banner"><div className="profile-mark">M</div><div><h2>Welcome back</h2><p>Your details appear after completing a demonstration order.</p></div></div><div className="account-stat-grid"><div><span>Orders</span><strong>{orderCount}</strong><Link href="/account/orders">View history</Link></div><div><span>Saved addresses</span><strong>0</strong><a href="#addresses">Add address</a></div><div><span>Preferences</span><strong>Email only</strong><button>Manage</button></div></div><div className="profile-section" id="addresses"><h2>Personal information</h2><div><label>Full name<input value="Maya Ahmed" readOnly /></label><label>Email address<input value="maya@example.com" readOnly /></label></div><Button variant="outline" disabled>Save changes</Button><p>Profile editing is intentionally disabled in this portfolio build.</p></div></section>;
}

function OrdersPanel({ orders }: { orders: ReturnType<typeof useShopStore.getState>["orders"] }) {
  if (!orders.length) return <section className="account-panel"><EmptyState title="No orders yet" description="Completed demo orders will appear here with their status and delivery details." action={<Button asChild><Link href="/products">Start shopping</Link></Button>} /></section>;
  return <section className="account-panel order-list">{orders.map((order) => <article key={order.id}><header><div><span>{order.id}</span><time>{new Date(order.date).toLocaleDateString()}</time></div><span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span></header><div className="order-products">{order.items.slice(0, 4).map((item) => <img src={item.product.thumbnail} alt={item.product.title} key={item.key} />)}<div><strong>{order.items.reduce((count, item) => count + item.quantity, 0)} items</strong><span>{order.items.map((item) => item.product.title).join(", ")}</span></div></div><footer><strong>{formatPrice(order.total)}</strong><Button size="sm" variant="outline">View details</Button></footer></article>)}</section>;
}
