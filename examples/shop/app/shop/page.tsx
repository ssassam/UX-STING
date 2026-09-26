import { Suspense } from "react";
import { ShopBrowser } from "../../components/shop-browser";

export const metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <Suspense>
      <ShopBrowser />
    </Suspense>
  );
}
