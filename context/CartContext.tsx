"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { CartProduct } from "@/lib/types";

export type CartItem = {
  product: CartProduct;
  quantity: number; // units of 100g
};

const STORAGE_KEY = "aaushadhi-cart";

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  getQuantity: (productId: number) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const hydrated = useRef(false);

  // Load the saved cart once on mount (client-only — localStorage doesn't
  // exist during SSR).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: hydrating from browser-only localStorage after mount, to avoid an SSR/client markup mismatch (server can't read it).
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch {
      // Corrupted or inaccessible storage — just start with an empty cart.
    } finally {
      hydrated.current = true;
    }
  }, []);

  // Persist on every change, but only after the initial load above has run
  // — otherwise this would immediately overwrite the saved cart with `[]`
  // on the very first render.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage full/unavailable — cart still works for this session,
      // it just won't survive a refresh.
    }
  }, [cartItems]);

  const addToCart = useCallback((product: CartProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getQuantity = useCallback(
    (productId: number) => {
      const item = cartItems.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
