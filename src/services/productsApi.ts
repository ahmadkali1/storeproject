import type { Product } from "@/src/types/product";

const API_BASE = "https://dummyjson.com";

const fallbackProducts: Product[] = [
  {
    id: 1001,
    title: "Classic Black Sunglasses",
    description: "A lightweight acetate frame with smoke lenses and a clean everyday profile.",
    category: "sunglasses",
    price: 24.99,
    discountPercentage: 9,
    rating: 4.6,
    stock: 18,
    brand: "NORTHLINE Edit",
    thumbnail: "https://cdn.dummyjson.com/product-images/sunglasses/classic-black-sunglasses/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/sunglasses/classic-black-sunglasses/1.webp"],
    availabilityStatus: "In Stock",
    shippingInformation: "Ships in 2–3 business days",
    returnPolicy: "30-day returns",
  },
  {
    id: 1002,
    title: "Brown Leather Belt Watch",
    description: "A minimal silver dial paired with a supple brown leather strap.",
    category: "mens-watches",
    price: 46.99,
    discountPercentage: 7,
    rating: 4.5,
    stock: 7,
    brand: "Urban Time",
    thumbnail: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp"],
    availabilityStatus: "Low Stock",
    shippingInformation: "Ships in 2–3 business days",
    returnPolicy: "30-day returns",
  },
  {
    id: 1003,
    title: "Black Whisk Headphones",
    description: "Comfortable over-ear headphones tuned for balanced everyday listening.",
    category: "mobile-accessories",
    price: 39.99,
    discountPercentage: 12,
    rating: 4.4,
    stock: 23,
    brand: "Whisk",
    thumbnail: "https://cdn.dummyjson.com/product-images/mobile-accessories/black-whisk/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/mobile-accessories/black-whisk/1.webp"],
    availabilityStatus: "In Stock",
    shippingInformation: "Ships next business day",
    returnPolicy: "30-day returns",
  },
  {
    id: 1004,
    title: "Black Women's Gown",
    description: "A fluid full-length silhouette designed for simple evening dressing.",
    category: "womens-dresses",
    price: 79.99,
    discountPercentage: 14,
    rating: 4.7,
    stock: 11,
    brand: "Atelier Line",
    thumbnail: "https://cdn.dummyjson.com/product-images/womens-dresses/black-womens-gown/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/womens-dresses/black-womens-gown/1.webp"],
    availabilityStatus: "In Stock",
    shippingInformation: "Ships in 2–3 business days",
    returnPolicy: "30-day returns",
  },
  {
    id: 1005,
    title: "Knitted Handbag",
    description: "A softly structured carryall with comfortable handles and a lined interior.",
    category: "womens-bags",
    price: 49.99,
    discountPercentage: 5,
    rating: 4.3,
    stock: 5,
    brand: "Carry Studio",
    thumbnail: "https://cdn.dummyjson.com/product-images/womens-bags/knitted-handbag/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/womens-bags/knitted-handbag/1.webp"],
    availabilityStatus: "Low Stock",
    shippingInformation: "Ships in 2–3 business days",
    returnPolicy: "30-day returns",
  },
  {
    id: 1006,
    title: "Wooden Bathroom Sink",
    description: "A warm oak vanity with a matte ceramic basin for compact bathrooms.",
    category: "furniture",
    price: 749.99,
    discountPercentage: 8,
    rating: 4.8,
    stock: 4,
    brand: "Bath Trends",
    thumbnail: "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/1.webp"],
    availabilityStatus: "Low Stock",
    shippingInformation: "White-glove delivery in 5–7 days",
    returnPolicy: "14-day furniture returns",
  },
  {
    id: 1007,
    title: "Silver Pot With Glass Cap",
    description: "A practical stainless-steel pot with a clear tempered glass lid.",
    category: "kitchen-accessories",
    price: 39.99,
    discountPercentage: 6,
    rating: 4.6,
    stock: 34,
    brand: "Kitchen Craft",
    thumbnail: "https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/1.webp"],
    availabilityStatus: "In Stock",
    shippingInformation: "Ships next business day",
    returnPolicy: "30-day returns",
  },
  {
    id: 1008,
    title: "Essence Mascara Lash Princess",
    description: "A defining mascara with a tapered brush for clean, buildable volume.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 10,
    rating: 4.4,
    stock: 99,
    brand: "Essence",
    thumbnail: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"],
    availabilityStatus: "In Stock",
    shippingInformation: "Ships next business day",
    returnPolicy: "Unopened items accepted within 30 days",
  },
  {
    id: 1009,
    title: "Calvin Klein CK One",
    description: "A clean, citrus-led eau de toilette with a soft musk dry down.",
    category: "fragrances",
    price: 49.99,
    discountPercentage: 4,
    rating: 4.7,
    stock: 28,
    brand: "Calvin Klein",
    thumbnail: "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.webp"],
    availabilityStatus: "In Stock",
    shippingInformation: "Ships in 2–3 business days",
    returnPolicy: "Unopened items accepted within 30 days",
  },
  {
    id: 1010,
    title: "Apple MacBook Pro 14 Inch Space Grey",
    description: "A compact professional notebook with a high-resolution display and all-day battery.",
    category: "laptops",
    price: 1999.99,
    discountPercentage: 6,
    rating: 4.9,
    stock: 8,
    brand: "Apple",
    thumbnail: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp"],
    availabilityStatus: "Low Stock",
    shippingInformation: "Free insured delivery",
    returnPolicy: "14-day electronics returns",
  },
  {
    id: 1011,
    title: "Dior J'adore",
    description: "A luminous floral fragrance built around jasmine, rose and ylang-ylang.",
    category: "fragrances",
    price: 129.99,
    discountPercentage: 3,
    rating: 4.8,
    stock: 17,
    brand: "Dior",
    thumbnail: "https://cdn.dummyjson.com/product-images/fragrances/dior-jadore/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/fragrances/dior-jadore/1.webp"],
    availabilityStatus: "In Stock",
    shippingInformation: "Ships in 2–3 business days",
    returnPolicy: "Unopened items accepted within 30 days",
  },
  {
    id: 1012,
    title: "Ice Cube Tray",
    description: "A flexible silicone tray with an easy-release base and rigid carry rim.",
    category: "kitchen-accessories",
    price: 5.99,
    discountPercentage: 0,
    rating: 4.2,
    stock: 72,
    brand: "Kitchen Craft",
    thumbnail: "https://cdn.dummyjson.com/product-images/kitchen-accessories/ice-cube-tray/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/kitchen-accessories/ice-cube-tray/1.webp"],
    availabilityStatus: "In Stock",
    shippingInformation: "Ships next business day",
    returnPolicy: "30-day returns",
  },
];

type ApiProductResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

function withDefaults(product: Product): Product {
  return {
    ...product,
    images: product.images?.length ? product.images : [product.thumbnail],
    brand: product.brand || "Independent maker",
    shippingInformation: product.shippingInformation || "Ships in 2–3 business days",
    returnPolicy: product.returnPolicy || "30-day returns",
    availabilityStatus: product.stock <= 8 ? "Low Stock" : "In Stock",
  };
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { signal });
  if (!response.ok) throw new Error("We couldn’t load the catalogue.");
  return response.json() as Promise<T>;
}

export async function getProducts(signal?: AbortSignal): Promise<ApiProductResponse> {
  try {
    const data = await request<ApiProductResponse>("/products?limit=0", signal);
    return { ...data, products: data.products.map(withDefaults) };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return { products: fallbackProducts, total: fallbackProducts.length, skip: 0, limit: fallbackProducts.length };
  }
}

export async function searchProducts(query: string, signal?: AbortSignal): Promise<ApiProductResponse> {
  if (!query.trim()) return getProducts(signal);
  try {
    const data = await request<ApiProductResponse>(`/products/search?q=${encodeURIComponent(query.trim())}`, signal);
    return { ...data, products: data.products.map(withDefaults) };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    const normalized = query.trim().toLowerCase();
    const products = fallbackProducts.filter((product) =>
      [product.title, product.brand, product.category, product.description]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalized)),
    );
    return { products, total: products.length, skip: 0, limit: products.length };
  }
}

export async function getProduct(id: number, signal?: AbortSignal): Promise<Product> {
  try {
    const data = await request<Product>(`/products/${id}`, signal);
    return withDefaults(data);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    const fallback = fallbackProducts.find((product) => product.id === id) || fallbackProducts[0];
    return fallback;
  }
}

export async function persistShopMutation(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 180));
}

export { fallbackProducts };
