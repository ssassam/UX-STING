import type { Responsive } from "@unified-ui/utils";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../../lib/polymorphic.js";

export type SpaceToken = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16";

export interface StackOwnProps {
  /** Gap between children using the spacing scale (responsive). */
  gap?: Responsive<SpaceToken>;
  /** Main axis direction (responsive). Defaults to `column`. */
  direction?: Responsive<"row" | "column" | "row-reverse" | "column-reverse">;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

export type StackProps<E extends ElementType = "div"> = PolymorphicProps<E, StackOwnProps>;
