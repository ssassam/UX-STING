import { Suspense } from "react";
import { ShopBrowser } from "../../components/shop-browser";
import { pageMeta } from "../../lib/seo";

export const metadata = pageMeta({
  title: "Shop",
  description: "Handmade stoneware, linen, brass and plants from independent workshops.",
  path: "shop",
});

export default function ShopPage() {
  return (
    <Suspense>
      <ShopBrowser />
    </Suspense>
  );
}
