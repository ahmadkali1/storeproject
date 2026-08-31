import type { Metadata } from "next";
import { OrderSuccessView } from "@/components/store/order-success-view";

export const metadata: Metadata = { title: "Order received", robots: { index: false, follow: false } };
export default function OrderSuccessPage() { return <OrderSuccessView />; }
