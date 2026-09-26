import { Suspense } from "react";
import { Checkout } from "../../components/checkout";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Suspense>
        <Checkout />
      </Suspense>
    </div>
  );
}
