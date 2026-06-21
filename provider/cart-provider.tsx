"use client";

import * as React from "react";
import {
  type Food,
  SERVICE_CHARGE,
  PLATFORM_FEE,
} from "@/helpers/student.helpers";

export interface CartItem {
  food: Food;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  platformFee: number;
  total: number;
  add: (food: Food, qty?: number) => void;
  remove: (foodId: string) => void;
  setQty: (foodId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "beleful.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  // Hydrate from localStorage once on mount. Done in an effect (rather than a
  // lazy useState initializer) so server and first client render both start
  // empty — avoiding a hydration mismatch on the cart badge.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time persisted-state hydration on mount
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore malformed cache */
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — keep in-memory */
    }
  }, [items]);

  const add = React.useCallback((food: Food, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.food.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.food.id === food.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { food, qty }];
    });
  }, []);

  const remove = React.useCallback((foodId: string) => {
    setItems((prev) => prev.filter((i) => i.food.id !== foodId));
  }, []);

  const setQty = React.useCallback((foodId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.food.id !== foodId)
        : prev.map((i) => (i.food.id === foodId ? { ...i, qty } : i)),
    );
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const value = React.useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.food.price * i.qty, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    // Highest delivery fee among the vendors in the cart (single-trip model).
    const deliveryFee = items.length ? Math.max(...items.map(() => 350)) : 0;
    const serviceCharge = items.length ? SERVICE_CHARGE : 0;
    const platformFee = items.length ? PLATFORM_FEE : 0;
    return {
      items,
      count,
      subtotal,
      deliveryFee,
      serviceCharge,
      platformFee,
      total: subtotal + deliveryFee + serviceCharge + platformFee,
      add,
      remove,
      setQty,
      clear,
    };
  }, [items, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
