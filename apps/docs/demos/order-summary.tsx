"use client";
import { Button } from "@ux-sting/react/button";
import { Input } from "@ux-sting/react/input";
import { OrderSummary } from "@ux-sting/react/order-summary";

export function Default() {
  return (
    <OrderSummary
      className="max-w-sm"
      currency="EUR"
      lines={[
        { label: "Subtotal (3 items)", amount: 477 },
        { label: "Discount", amount: 47.7, kind: "discount", hint: "Code SPRING10" },
        { label: "Shipping", amount: 0, display: "Free" },
      ]}
      note="VAT included"
    >
      <div className="flex gap-2">
        <Input aria-label="Promo code" placeholder="Promo code" />
        <Button variant="outline">Apply</Button>
      </div>
      <Button size="lg" fullWidth>
        Checkout
      </Button>
    </OrderSummary>
  );
}
