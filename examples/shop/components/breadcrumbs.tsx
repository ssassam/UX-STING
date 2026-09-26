import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ux-sting/react/breadcrumb";
import NextLink from "next/link";
import { Fragment } from "react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <Breadcrumb>
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 ? <BreadcrumbSeparator /> : null}
          <BreadcrumbItem>
            {item.href ? (
              <BreadcrumbLink asChild>
                <NextLink href={item.href}>{item.label}</NextLink>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </Fragment>
      ))}
    </Breadcrumb>
  );
}
