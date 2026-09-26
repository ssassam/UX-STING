"use client";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@unified-ui/react/breadcrumb";

export function Basic() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbEllipsis />
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Casablanca</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Cafés</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
