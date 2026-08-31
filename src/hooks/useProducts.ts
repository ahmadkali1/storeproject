"use client";

import { useCallback, useEffect, useState } from "react";
import { getProducts, searchProducts } from "@/src/services/productsApi";
import type { Product } from "@/src/types/product";

export function useProducts(query = "") {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  const retry = useCallback(() => setRequestKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const loader = query.trim() ? searchProducts(query, controller.signal) : getProducts(controller.signal);
    loader
      .then((data) => setProducts(data.products))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Something went wrong.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query, requestKey]);

  return { products, loading, error, retry };
}
