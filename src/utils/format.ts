export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function formatCategory(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function oldPrice(price: number, discountPercentage: number) {
  if (!discountPercentage) return null;
  return price / (1 - discountPercentage / 100);
}
