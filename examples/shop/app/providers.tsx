"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "../lib/data";

/** Maison Nord brand: ink on warm neutrals, small radius, serif display type. */
const nordTheme = {
  name: "nord",
  primary: "gray",
  neutral: "gray",
  radius: "small",
  fontFamily: { serif: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif' },
  colors: {
    light: {
      primary: "oklch(0.24 0.01 60)",
      "primary-hover": "oklch(0.32 0.01 60)",
      "primary-foreground": "oklch(0.98 0.005 80)",
      "primary-subtle": "oklch(0.95 0.015 80)",
      "primary-subtle-foreground": "oklch(0.3 0.02 60)",
      background: "oklch(0.99 0.004 80)",
      muted: "oklch(0.96 0.01 80)",
      ring: "oklch(0.45 0.02 60)",
    },
    dark: {
      primary: "oklch(0.95 0.01 80)",
      "primary-hover": "oklch(0.88 0.01 80)",
      "primary-foreground": "oklch(0.2 0.01 60)",
    },
  },
} as const;

export interface CartLine {
  id: string;
  color: string;
  qty: number;
}
interface CartValue {
  lines: (CartLine & { product: Product })[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, color: string, qty?: number) => void;
  update: (id: string, color: string, qty: number) => void;
  clear: () => void;
}
const CartContext = createContext<CartValue | null>(null);
export const useCart = () => {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <Providers>");
  return cart;
};

const KEY = "maison-nord-cart";

export function Providers({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartLine[];
      if (Array.isArray(saved)) setRaw(saved.filter((l) => getProduct(l.id)));
    } catch {
      // Storage unavailable: start with an empty cart.
    }
  }, []);
  const persist = useCallback((next: CartLine[]) => {
    setRaw(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Ignore: the cart still works for this visit.
    }
  }, []);
  const value = useMemo<CartValue>(() => {
    const lines = raw.map((l) => ({ ...l, product: getProduct(l.id)! }));
    return {
      lines,
      count: raw.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      open,
      setOpen,
      add: (id, color, qty = 1) => {
        const exists = raw.some((l) => l.id === id && l.color === color);
        persist(
          exists
            ? raw.map((l) =>
                l.id === id && l.color === color ? { ...l, qty: Math.min(10, l.qty + qty) } : l,
              )
            : [...raw, { id, color, qty }],
        );
      },
      update: (id, color, qty) =>
        persist(
          qty <= 0
            ? raw.filter((l) => !(l.id === id && l.color === color))
            : raw.map((l) => (l.id === id && l.color === color ? { ...l, qty } : l)),
        ),
      clear: () => persist([]),
    };
  }, [raw, open, persist]);

  return (
    <UIProvider target="document" theme={nordTheme} storageKey="nord-color-mode">
      <TooltipProvider>
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
