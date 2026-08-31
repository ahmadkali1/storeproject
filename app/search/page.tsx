import type { Metadata } from "next";
import { CatalogueView } from "@/components/store/catalogue-view";

export const metadata: Metadata = { title: "Search", description: "Search the NORTHLINE catalogue." };
export default function SearchPage() { return <CatalogueView mode="search" />; }
