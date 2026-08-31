import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogueView } from "@/components/store/catalogue-view";
import { ProductGridSkeleton } from "@/components/store/store-states";

export const metadata: Metadata = { title: "Search", description: "Search the NORTHLINE catalogue." };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="page-width section-space"><ProductGridSkeleton count={8} /></div>}>
      <CatalogueView mode="search" />
    </Suspense>
  );
}
