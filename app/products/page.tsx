import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogueView } from "@/components/store/catalogue-view";
import { ProductGridSkeleton } from "@/components/store/store-states";

export const metadata: Metadata = { title: "Shop all", description: "Browse the complete NORTHLINE product edit." };

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="page-width section-space"><ProductGridSkeleton count={8} /></div>}>
      <CatalogueView />
    </Suspense>
  );
}
