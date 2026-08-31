import type { Metadata } from "next";
import { AccountView } from "@/components/store/account-view";

export const metadata: Metadata = { title: "Orders", robots: { index: false, follow: false } };
export default function OrdersPage() { return <AccountView section="orders" />; }
