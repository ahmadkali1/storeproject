export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  availabilityStatus?: string;
  shippingInformation?: string;
  returnPolicy?: string;
};

export type ProductFilters = {
  category: string;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sort: SortOption;
};

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export type ProductVariant = {
  color?: string;
  size?: string;
};

export type CartItem = {
  key: string;
  product: Product;
  quantity: number;
  variant: ProductVariant;
};

export type CheckoutDetails = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: "card" | "cash" | "paypal";
};

export type Order = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  details: CheckoutDetails;
  estimatedDelivery: string;
};
