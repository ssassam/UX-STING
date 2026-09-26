"use client";
import { UIProvider } from "@unified-ui/react/provider";
import { Toaster } from "@unified-ui/react/toast";
import { TooltipProvider } from "@unified-ui/react/tooltip";
import { createContext, useContext, useState, type ReactNode } from "react";

interface CartLine {
  id: string;
  qty: number;
}
const CartContext = createContext<{
  lines: CartLine[];
  add: (id: string, qty?: number) => void;
  count: number;
}>({ lines: [], add: () => {}, count: 0 });
export const useCart = () => useContext(CartContext);

export function Providers({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([{ id: "2", qty: 1 }]);
  const add = (id: string, qty = 1) =>
    setLines((prev) =>
      prev.some((l) => l.id === id)
        ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
        : [...prev, { id, qty }],
    );
  return (
    <UIProvider target="document" theme="soft" storageKey="ui-color-mode">
      <TooltipProvider>
        <CartContext.Provider value={{ lines, add, count: lines.reduce((n, l) => n + l.qty, 0) }}>
          {children}
        </CartContext.Provider>
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
