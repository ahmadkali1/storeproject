"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CheckoutDetails, Order, Product, ProductVariant } from "@/src/types/product";

type ShopState = {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: Product[];
  orders: Order[];
  lastOrder: Order | null;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => string;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  replaceCart: (cart: CartItem[]) => void;
  toggleWishlist: (product: Product) => void;
  setWishlist: (products: Product[]) => void;
  addRecentlyViewed: (product: Product) => void;
  clearCart: () => void;
  placeOrder: (details: CheckoutDetails) => Order | null;
};

function itemKey(product: Product, variant: ProductVariant = {}) {
  return `${product.id}:${variant.color || "default"}:${variant.size || "default"}`;
}

function money(value: number) {
  return Math.round(value * 100) / 100;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      orders: [],
      lastOrder: null,
      addToCart: (product, quantity = 1, variant = {}) => {
        const key = itemKey(product, variant);
        set((state) => {
          const existing = state.cart.find((item) => item.key === key);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.key === key
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, { key, product, quantity: Math.min(quantity, product.stock), variant }] };
        });
        return key;
      },
      removeFromCart: (key) => set((state) => ({ cart: state.cart.filter((item) => item.key !== key) })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
              : item,
          ),
        })),
      replaceCart: (cart) => set({ cart }),
      toggleWishlist: (product) =>
        set((state) => ({
          wishlist: state.wishlist.some((item) => item.id === product.id)
            ? state.wishlist.filter((item) => item.id !== product.id)
            : [product, ...state.wishlist],
        })),
      setWishlist: (wishlist) => set({ wishlist }),
      addRecentlyViewed: (product) =>
        set((state) => ({
          recentlyViewed: [product, ...state.recentlyViewed.filter((item) => item.id !== product.id)].slice(0, 8),
        })),
      clearCart: () => set({ cart: [] }),
      placeOrder: (details) => {
        const cart = get().cart;
        if (!cart.length) return null;
        const subtotal = money(cart.reduce((total, item) => total + item.product.price * item.quantity, 0));
        const shipping = subtotal >= 100 ? 0 : 8;
        const delivery = new Date();
        delivery.setDate(delivery.getDate() + 5);
        const order: Order = {
          id: `NL-${String(Date.now()).slice(-8)}`,
          date: new Date().toISOString(),
          status: "Processing",
          items: cart,
          subtotal,
          shipping,
          total: money(subtotal + shipping),
          details,
          estimatedDelivery: delivery.toISOString(),
        };
        set((state) => ({ cart: [], orders: [order, ...state.orders], lastOrder: order }));
        return order;
      },
    }),
    {
      name: "northline-shop",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        orders: state.orders,
        lastOrder: state.lastOrder,
      }),
    },
  ),
);

export const selectCartCount = (state: ShopState) => state.cart.reduce((count, item) => count + item.quantity, 0);
export const selectCartSubtotal = (state: ShopState) =>
  state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
