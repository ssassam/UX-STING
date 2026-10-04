import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import {
  AddressFields,
  Button,
  CartLineItem,
  FilterSection,
  Form,
  MegaMenu,
  PaymentFields,
  Price,
  ProductDetails,
  ProductListing,
  type MegaMenuItem,
} from "../index.js";

const menu: MegaMenuItem[] = [
  {
    label: "Women",
    allHref: "/women",
    allLabel: "All women",
    columns: [
      {
        title: "Clothing",
        links: [
          { label: "Dresses", href: "/women/dresses" },
          { label: "Jackets", href: "/women/jackets", description: "New season" },
        ],
      },
    ],
  },
  { label: "Sale", href: "/sale" },
];

describe("MegaMenu", () => {
  it("opens a category panel from the keyboard and marks the current page", async () => {
    const user = userEvent.setup();
    render(<MegaMenu items={menu} label="Shop" currentHref="/sale" />);
    const nav = screen.getByRole("navigation", { name: "Shop" });
    expect(within(nav).getByRole("link", { name: "Sale" })).toHaveAttribute("aria-current", "page");
    const trigger = within(nav).getByRole("button", { name: "Women" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("link", { name: /Jackets/ })).toHaveAttribute(
      "href",
      "/women/jackets",
    );
    expect(screen.getByRole("link", { name: "All women" })).toBeInTheDocument();
  });

  it("offers a mobile menu sheet with collapsible categories", async () => {
    const user = userEvent.setup();
    render(<MegaMenu items={menu} label="Shop" />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog", { name: "Shop" });
    await user.click(within(dialog).getByRole("button", { name: "Women" }));
    expect(within(dialog).getByRole("link", { name: "Dresses" })).toBeInTheDocument();
  });

  it("a11y", async () => {
    const { container } = render(<MegaMenu items={menu} />);
    await expectNoA11yViolations(container);
  });
});

describe("CartLineItem", () => {
  const props = {
    name: "Linen shirt",
    href: "/p/linen-shirt",
    image: { src: "/shirt.jpg", alt: "Linen shirt, sand" },
    options: [
      { label: "Color", value: "Sand" },
      { label: "Size", value: "M" },
    ],
    price: 40,
    currency: "USD",
  };

  it("shows the line total and changes quantity or removes", async () => {
    const user = userEvent.setup();
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    render(
      <ul>
        <li>
          <CartLineItem
            {...props}
            quantity={2}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        </li>
      </ul>,
    );
    expect(screen.getByRole("heading", { name: "Linen shirt" })).toBeInTheDocument();
    expect(screen.getByText("$80.00")).toBeInTheDocument();
    expect(screen.getByText("Sand")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(onQuantityChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: /Remove Linen shirt/ }));
    expect(onRemove).toHaveBeenCalled();
    expect(screen.getByRole("spinbutton", { name: "Quantity, Linen shirt" })).toBeInTheDocument();
  });

  it("renders read-only lines for order confirmations", () => {
    render(<CartLineItem {...props} quantity={3} readOnly onRemove={() => {}} />);
    expect(screen.getByText("Quantity: 3")).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("a11y", async () => {
    const { container } = render(
      <ul>
        <li>
          <CartLineItem {...props} quantity={1} onRemove={() => {}} />
        </li>
      </ul>,
    );
    await expectNoA11yViolations(container);
  });
});

describe("Checkout fields", () => {
  function Checkout({ onSubmit }: { onSubmit: (v: Record<string, unknown>) => void }) {
    return (
      <Form onSubmit={onSubmit}>
        <AddressFields
          legend="Shipping address"
          countries={[
            { value: "MA", label: "Morocco" },
            { value: "FR", label: "France" },
          ]}
          defaultCountry="FR"
        />
        <PaymentFields legend="Payment" />
        <Button type="submit">Pay</Button>
      </Form>
    );
  }

  it("uses section-scoped autofill tokens and prefixed names", () => {
    render(<Checkout onSubmit={() => {}} />);
    const group = screen.getByRole("group", { name: "Shipping address" });
    const line1 = within(group).getByRole("textbox", { name: "Address" });
    expect(line1).toHaveAttribute("autocomplete", "shipping address-line1");
    expect(line1).toHaveAttribute("name", "shipping.line1");
    expect(within(group).getByRole("combobox", { name: "Country" })).toHaveValue("FR");
    const card = screen.getByRole("textbox", { name: "Card number" });
    expect(card).toHaveAttribute("autocomplete", "cc-number");
    expect(card).toHaveAttribute("inputmode", "numeric");
  });

  it("formats card number and expiry while typing, and submits valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Checkout onSubmit={onSubmit} />);
    await user.type(screen.getByRole("textbox", { name: "Full name" }), "Amina Benali");
    await user.type(screen.getByRole("textbox", { name: "Address" }), "12 Rue de Rivoli");
    await user.type(screen.getByRole("textbox", { name: "City" }), "Paris");
    await user.type(screen.getByRole("textbox", { name: "Postal code" }), "75001");
    const card = screen.getByRole("textbox", { name: "Card number" });
    await user.type(card, "4242424242424242");
    expect(card).toHaveValue("4242 4242 4242 4242");
    await user.type(screen.getByRole("textbox", { name: "Name on card" }), "Amina Benali");
    const expiry = screen.getByRole("textbox", { name: "Expiry date" });
    await user.type(expiry, "0829");
    expect(expiry).toHaveValue("08 / 29");
    await user.type(screen.getByRole("textbox", { name: "Security code" }), "123");
    await user.click(screen.getByRole("button", { name: "Pay" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({
      "shipping.city": "Paris",
      "payment.cardNumber": "4242 4242 4242 4242",
    });
  });

  it("blocks submit and flags missing fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Checkout onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Pay" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Full name" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("a11y", async () => {
    const { container } = render(<Checkout onSubmit={() => {}} />);
    await expectNoA11yViolations(container);
  });
});

describe("ProductListing", () => {
  it("lays out heading, count, filters, chips and grid", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { container } = render(
      <ProductListing
        title="Shirts"
        resultCount={1280}
        filters={
          <FilterSection title="Size">
            <label>
              <input type="checkbox" /> M
            </label>
          </FilterSection>
        }
        activeFilters={[{ id: "m", label: "Size: M" }]}
        onRemoveFilter={onRemove}
        onClearFilters={() => {}}
        sort={
          <label>
            Sort{" "}
            <select>
              <option>Popular</option>
            </select>
          </label>
        }
      >
        <ul aria-label="Products">
          <li>Linen shirt</li>
        </ul>
      </ProductListing>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Shirts" })).toBeInTheDocument();
    expect(screen.getByText("1,280 results")).toHaveAttribute("aria-live", "polite");
    await user.click(screen.getByRole("button", { name: /Remove Size: M/ }));
    expect(onRemove).toHaveBeenCalledWith("m");
    await expectNoA11yViolations(container);
  });
});

describe("ProductDetails", () => {
  it("renders the buy box with an h1, rating link and slots", async () => {
    const { container } = render(
      <ProductDetails
        gallery={<img src="/a.jpg" alt="Shirt front" />}
        brand="Atlas"
        title="Linen shirt"
        rating={4.6}
        reviewCount={212}
        reviewsHref="#reviews"
        price={<Price amount={40} currency="USD" />}
        actions={<Button>Add to cart</Button>}
        info={<p>Free delivery over $50</p>}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Linen shirt" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /4\.6 out of 5/ })).toHaveAttribute("href", "#reviews");
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("ProductDetails details heading", () => {
  it("puts the details under a hidden h2", () => {
    render(
      <ProductDetails
        gallery={null}
        title="Linen shirt"
        price="$40"
        details={<h3>Materials</h3>}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Product details" })).toHaveClass(
      "sr-only",
    );
  });
});
