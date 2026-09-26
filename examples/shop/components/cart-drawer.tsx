"use client";
import { ShoppingBagIcon, Trash2Icon, TruckIcon } from "@ux-sting/icons";
import { Button, IconButton } from "@ux-sting/react/button";
import { NumberInput } from "@ux-sting/react/number-input";
import { Currency } from "@ux-sting/react/price";
import { Progress } from "@ux-sting/react/progress";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@ux-sting/react/sheet";
import { EmptyState } from "@ux-sting/react/state";
import NextLink from "next/link";
import { useCart } from "../app/providers";
import { CURRENCY, FREE_SHIPPING } from "../lib/data";
import { sized } from "../lib/photos";

export function CartDrawer() {
  const cart = useCart();
  const toFree = Math.max(0, FREE_SHIPPING - cart.subtotal);
  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent side="end" size="md">
        <SheetHeader>
          <SheetTitle>Your bag ({cart.count})</SheetTitle>
          <SheetDescription>
            {toFree > 0
              ? `Add €${toFree.toFixed(0)} more for free delivery.`
              : "You've unlocked free delivery."}
          </SheetDescription>
          <Progress
            value={Math.min(100, (cart.subtotal / FREE_SHIPPING) * 100)}
            aria-label="Progress towards free delivery"
            size="sm"
            variant={toFree > 0 ? "default" : "success"}
            className="mt-2"
          />
        </SheetHeader>
        <SheetBody>
          {cart.lines.length ? (
            <ul className="grid divide-y divide-border">
              {cart.lines.map((l) => {
                const color = l.product.colors.find((c) => c.id === l.color);
                return (
                  <li
                    key={`${l.id}-${l.color}`}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-4"
                  >
                    <img
                      src={sized(l.product.photo, 500)}
                      alt=""
                      className="aspect-square w-18 rounded-sm bg-muted object-cover"
                    />
                    <div className="grid gap-2">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <NextLink
                            href={`/product/${l.id}`}
                            onClick={() => cart.setOpen(false)}
                            className="rounded-xs font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {l.product.name}
                          </NextLink>
                          <p className="text-sm text-muted-foreground">{color?.name}</p>
                        </div>
                        <Currency
                          value={l.product.price * l.qty}
                          currency={CURRENCY}
                          className="text-foreground"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <NumberInput
                          size="sm"
                          aria-label={`Quantity of ${l.product.name}`}
                          value={l.qty}
                          min={1}
                          max={10}
                          onValueChange={(v) => v && cart.update(l.id, l.color, v)}
                          className="w-28"
                        />
                        <IconButton
                          aria-label={`Remove ${l.product.name}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => cart.update(l.id, l.color, 0)}
                        >
                          <Trash2Icon />
                        </IconButton>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={<ShoppingBagIcon />}
              headingLevel={3}
              title="Your bag is empty"
              description="Browse the collection and add something you love."
              actions={
                <Button asChild variant="outline" onClick={() => cart.setOpen(false)}>
                  <NextLink href="/shop">Shop the collection</NextLink>
                </Button>
              }
            />
          )}
        </SheetBody>
        {cart.lines.length ? (
          <SheetFooter className="grid gap-3">
            <div className="flex justify-between text-md font-semibold">
              <span>Subtotal</span>
              <Currency value={cart.subtotal} currency={CURRENCY} />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TruckIcon aria-hidden className="size-4" /> Delivery in 2–4 working days
            </p>
            <Button asChild size="lg" fullWidth onClick={() => cart.setOpen(false)}>
              <NextLink href="/checkout">Checkout</NextLink>
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
