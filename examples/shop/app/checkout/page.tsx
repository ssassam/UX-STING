import { Checkout } from "../../components/checkout";
import { pageMeta } from "../../lib/seo";

export const metadata = pageMeta({
  title: "Checkout",
  description: "Complete your order.",
  path: "checkout",
  noindex: true,
});

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Checkout />
    </div>
  );
}
