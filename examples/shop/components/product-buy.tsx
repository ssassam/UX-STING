"use client";
import { CheckIcon, ShoppingBagIcon, TruckIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { Field, Fieldset } from "@ux-sting/react/field";
import { NumberInput } from "@ux-sting/react/number-input";
import { Price } from "@ux-sting/react/price";
import { Text } from "@ux-sting/react/typography";
import { useState } from "react";
import { useCart } from "../app/providers";
import { CURRENCY, type Product } from "../lib/data";

export function ProductBuy({ product }: { product: Product }) {
  const cart = useCart();
  const [color, setColor] = useState(product.colors[0]!.id);
  const [qty, setQty] = useState<number | null>(1);
  const chosen = product.colors.find((c) => c.id === color)!;
  return (
    <div className="grid gap-5">
      <Price
        amount={product.price}
        compareAt={product.compareAt}
        currency={CURRENCY}
        size="xl"
        fractionDigits={0}
      />
      <Fieldset legend={`Colour: ${chosen.name}`}>
        <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-2">
          {product.colors.map((c) => {
            const on = c.id === color;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={c.name}
                onClick={() => setColor(c.id)}
                className={`ui-hit-area relative flex size-10 items-center justify-center rounded-full border-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${on ? "border-foreground" : "border-transparent"}`}
              >
                <span
                  className="size-8 rounded-full border border-border-strong"
                  style={{ background: c.swatch }}
                />
                {on ? (
                  <CheckIcon
                    aria-hidden
                    className="absolute size-4 text-background mix-blend-difference"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </Fieldset>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Quantity" className="w-32">
          <NumberInput value={qty} onValueChange={setQty} min={1} max={10} />
        </Field>
        <Button
          size="lg"
          className="flex-1"
          startIcon={<ShoppingBagIcon />}
          onClick={() => {
            cart.add(product.id, color, qty ?? 1);
            cart.setOpen(true);
          }}
        >
          Add to bag
        </Button>
      </div>
      <Text size="sm" variant="muted" className="flex items-center gap-1.5">
        <TruckIcon aria-hidden className="size-4" />
        {product.stock > 10 ? "In stock — ships today" : `Only ${product.stock} left — ships today`}
      </Text>
    </div>
  );
}
