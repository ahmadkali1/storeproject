import type { Metadata } from "next";
import { CatalogueView } from "@/components/store/catalogue-view";

export const metadata: Metadata = { title: "Shop all", description: "Browse the complete NORTHLINE product edit." };
export default function ProductsPage() { return <CatalogueView />; }
