import type { Metadata } from "next";
import { ProductDetailView } from "@/components/store/product-detail-view";
import { getProduct } from "@/src/services/productsApi";

type ProductRouteProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(Number(id));
  return {
    title: product.title,
    description: product.description,
    openGraph: { title: `${product.title} · NORTHLINE`, description: product.description, images: [{ url: product.images[0] || product.thumbnail, alt: product.title }] },
    twitter: { card: "summary_large_image", title: `${product.title} · NORTHLINE`, description: product.description, images: [product.images[0] || product.thumbnail] },
  };
}

export default async function ProductPage({ params }: ProductRouteProps) {
  const { id } = await params;
  return <ProductDetailView productId={Number(id)} />;
}
