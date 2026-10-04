import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProvider } from "../test-utils.js";
import {
  AnimatedNumber,
  Field,
  Logo,
  OrderSummary,
  ProductGallery,
  QuantitySelector,
  Reveal,
  RevealGroup,
  Swatch,
  SwatchGroup,
} from "../index.js";

describe("QuantitySelector", () => {
  it("steps with buttons and clamps to stock", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<QuantitySelector stock={3} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    const minus = screen.getByRole("button", { name: "Decrease" });
    const plus = screen.getByRole("button", { name: "Increase" });
    expect(input).toHaveValue(1);
    expect(minus).toBeDisabled();
    expect(input).toHaveAccessibleDescription("3 in stock");

    await user.click(plus);
    await user.click(plus);
    expect(input).toHaveValue(3);
    expect(plus).toBeDisabled();
    expect(onValueChange).toHaveBeenLastCalledWith(3);
  });

  it("commits typed values on blur and supports keyboard", async () => {
    const user = userEvent.setup();
    render(<QuantitySelector max={10} defaultValue={2} />);
    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "40");
    await user.tab();
    expect(input).toHaveValue(10);
    input.focus();
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveValue(9);
    await user.keyboard("{Home}");
    expect(input).toHaveValue(1);
  });

  it("works controlled", async () => {
    const user = userEvent.setup();
    function Demo() {
      const [qty, setQty] = useState(4);
      return (
        <>
          <QuantitySelector value={qty} onValueChange={setQty} />
          <output>{qty}</output>
        </>
      );
    }
    render(<Demo />);
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(screen.getByRole("status")).toHaveTextContent("5");
  });

  it("a11y", async () => {
    const { container } = render(<QuantitySelector stock={5} />);
    await expectNoA11yViolations(container);
  });
});

describe("Swatch", () => {
  function Colors(props: { onValueChange?: (v: string) => void }) {
    return (
      <SwatchGroup aria-label="Color" defaultValue="sand" {...props}>
        <Swatch value="sand" label="Sand" color="var(--ui-color-warning)" />
        <Swatch value="ink" label="Ink" color="var(--ui-color-foreground)" />
        <Swatch value="sage" label="Sage" color="var(--ui-color-success)" unavailable />
        <Swatch value="clay" label="Clay" color="var(--ui-color-destructive)" />
      </SwatchGroup>
    );
  }

  it("is a radio group that skips unavailable options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Colors onValueChange={onValueChange} />);
    const group = screen.getByRole("radiogroup", { name: "Color" });
    const radios = within(group).getAllByRole("radio");
    expect(radios).toHaveLength(4);
    expect(screen.getByRole("radio", { name: "Sand" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Sage, unavailable" })).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Ink" }));
    expect(onValueChange).toHaveBeenLastCalledWith("ink");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Clay" })).toHaveFocus();
  });

  it("renders text swatches", () => {
    render(
      <SwatchGroup aria-label="Size">
        <Swatch value="s" label="Small">
          S
        </Swatch>
        <Swatch value="m" label="M" />
      </SwatchGroup>,
    );
    expect(screen.getByRole("radio", { name: "Small" })).toHaveTextContent("S");
    expect(screen.getByRole("radio", { name: "M" })).toHaveTextContent("M");
  });

  it("a11y", async () => {
    const { container } = render(<Colors />);
    await expectNoA11yViolations(container);
  });
});

describe("ProductGallery", () => {
  const images = [
    { src: "/a.jpg", alt: "Rug, front" },
    { src: "/b.jpg", alt: "Rug, detail" },
    { src: "/c.jpg", alt: "Rug, rolled" },
  ];

  it("switches images with buttons, thumbnails and arrow keys", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} />);
    expect(screen.getByRole("img", { name: "Rug, front" })).toBeInTheDocument();
    expect(screen.getByText("Slide 1 of 3", { exact: false })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("img", { name: "Rug, detail" })).toBeInTheDocument();

    const third = screen.getByRole("button", { name: "Show image 3 of 3" });
    await user.click(third);
    expect(third).toHaveAttribute("aria-current", "true");
    expect(third).toHaveAttribute("tabindex", "0");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Show image 1 of 3" })).toHaveFocus();
    expect(screen.getByRole("img", { name: "Rug, front" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByRole("img", { name: "Rug, rolled" })).toBeInTheDocument();
  });

  it("mirrors arrow keys in RTL", async () => {
    const user = userEvent.setup();
    renderWithProvider(<ProductGallery images={images} label="صور" />, {
      providerProps: { locale: "ar" },
    });
    const buttons = within(screen.getByRole("group")).getAllByRole("button");
    buttons[0]!.focus();
    await user.keyboard("{ArrowLeft}");
    expect(buttons[1]).toHaveFocus();
  });

  it("a11y", async () => {
    const { container } = render(<ProductGallery images={images} />);
    await expectNoA11yViolations(container);
  });
});

describe("OrderSummary", () => {
  const lines = [
    { label: "Subtotal", amount: 120 },
    { label: "Discount", amount: 20, kind: "discount" as const, hint: "SPRING20" },
    { label: "Shipping", amount: 0, display: "Free" },
  ];

  it("lists amounts and computes the total", () => {
    render(<OrderSummary currency="USD" lines={lines} locale="en-US" />);
    const region = screen.getByRole("region", { name: "Order summary" });
    expect(within(region).getByRole("heading", { level: 2 })).toHaveTextContent("Order summary");
    expect(region).toHaveTextContent("−$20.00");
    expect(region).toHaveTextContent("Free");
    expect(within(region).getByText("Total").nextSibling).toHaveTextContent("$100.00");
  });

  it("a11y", async () => {
    const { container } = render(
      <OrderSummary currency="EUR" lines={lines} total={99} note="Taxes included">
        <button type="button">Checkout</button>
      </OrderSummary>,
    );
    await expectNoA11yViolations(container);
  });
});

describe("AnimatedNumber", () => {
  it("exposes only the final formatted value to assistive tech", () => {
    render(<AnimatedNumber value={1234.5} locale="en-US" data-testid="n" />);
    const n = screen.getByTestId("n");
    expect(within(n).getByText("1,234.5", { selector: ".sr-only" })).toBeInTheDocument();
    expect(n.querySelector("[aria-hidden]")).toHaveTextContent("1,234.5");
  });

  it("formats currency", () => {
    render(
      <AnimatedNumber
        value={49}
        locale="en-US"
        formatOptions={{ style: "currency", currency: "USD" }}
        data-testid="n"
      />,
    );
    expect(screen.getByTestId("n").querySelector(".sr-only")).toHaveTextContent("$49.00");
  });
});

describe("Reveal", () => {
  it("renders content visibly without IntersectionObserver", async () => {
    const { container } = render(
      <RevealGroup className="grid" stagger={50}>
        <p>One</p>
        <p>Two</p>
      </RevealGroup>,
    );
    expect(screen.getByText("Two").parentElement).toHaveStyle({ transitionDelay: "50ms" });
    expect(container.querySelector("[data-reveal]")).toBeNull();
    await expectNoA11yViolations(container);
  });

  it("forwards props", () => {
    render(<Reveal data-testid="r" effect="scale" />);
    expect(screen.getByTestId("r")).toBeInTheDocument();
  });
});

describe("QuantitySelector in a Field", () => {
  it("is named by the field label", () => {
    render(
      <Field label="Tickets" description="Up to 6">
        <QuantitySelector max={6} />
      </Field>,
    );
    expect(screen.getByRole("spinbutton", { name: "Tickets" })).toHaveAccessibleDescription(
      "Up to 6",
    );
  });
});

describe("Logo", () => {
  const mark = (
    <svg viewBox="0 0 10 10" data-testid="mark">
      <rect width="10" height="10" />
    </svg>
  );

  it("is one named image with the SVG hidden", async () => {
    const { container } = render(<Logo name="Northwind" mark={mark} />);
    const img = screen.getByRole("img", { name: "Northwind" });
    expect(img).toHaveTextContent("Northwind");
    expect(screen.getByTestId("mark").parentElement).toHaveAttribute("aria-hidden", "true");
    await expectNoA11yViolations(container);
  });

  it("renders a home link and layouts", async () => {
    const { container } = render(
      <>
        <Logo name="Northwind" label="Northwind home" mark={mark} href="/" />
        <Logo name="Mark only" mark={mark} layout="mark" />
      </>,
    );
    expect(screen.getByRole("link", { name: "Northwind home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("img", { name: "Mark only" })).not.toHaveTextContent("Mark only");
    await expectNoA11yViolations(container);
  });
});
