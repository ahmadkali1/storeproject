import type { Metadata } from "next";
import { WishlistView } from "@/components/store/wishlist-view";

export const metadata: Metadata = { title: "Wishlist" };
export default function WishlistPage() { return <WishlistView />; }
