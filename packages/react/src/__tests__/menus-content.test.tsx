import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import {
  ArticleCard,
  CategoryCard,
  ClaimBusiness,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  EventCard,
  getOpeningStatus,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  InputGroup,
  InputGroupAddon,
  LeadForm,
  Location,
  MapPlaceholder,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  NativeSelect,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  OpeningHours,
  ProductCard,
  ProfileCard,
  ReviewCard,
  SearchResult,
  Separator,
  Skeleton,
  Spinner,
  Timeline,
  TimelineItem,
  VisuallyHidden,
} from "../index.js";

describe("ContextMenu", () => {
  it("opens on right-click, is keyboard navigable and runs onSelect", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>File row</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onRename}>Rename</ContextMenuItem>
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    await user.pointer({ keys: "[MouseRight]", target: screen.getByText("File row") });
    const menu = await screen.findByRole("menu");
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    await expectNoA11yViolations(document.body);
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onRename).toHaveBeenCalledOnce();
    await waitFor(() => expect(menu).not.toBeInTheDocument());
  });
});

describe("Menubar", () => {
  it("moves between menus with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    expect(screen.getByRole("menubar")).toBeInTheDocument();
    const file = screen.getByRole("menuitem", { name: "File" });
    await user.click(file);
    expect(await screen.findByRole("menuitem", { name: "New" })).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
    await user.keyboard("{ArrowRight}");
    expect(await screen.findByRole("menuitem", { name: "Undo" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });
});

describe("NavigationMenu", () => {
  it("expands a submenu from its trigger and exposes links", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NavigationMenu aria-label="Main">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Products" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("link", { name: "Analytics" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("HoverCard", () => {
  it("opens on keyboard focus as well as hover", async () => {
    const user = userEvent.setup();
    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger href="/u/issam">@issam</HoverCardTrigger>
        <HoverCardContent>Profile preview</HoverCardContent>
      </HoverCard>,
    );
    await user.tab();
    expect(screen.getByRole("link", { name: "@issam" })).toHaveFocus();
    expect(await screen.findByText("Profile preview")).toBeInTheDocument();
  });
});

describe("form helpers", () => {
  it("NativeSelect forwards invalid state and options", async () => {
    const { container } = render(
      <NativeSelect aria-label="Size" invalid defaultValue="m">
        <option value="s">S</option>
        <option value="m">M</option>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox", { name: "Size" });
    expect(select).toHaveValue("m");
    expect(select).toHaveAttribute("aria-invalid", "true");
    await expectNoA11yViolations(container);
  });

  it("InputGroup keeps the input labelled with addons around it", async () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="Domain" />
      </InputGroup>,
    );
    await userEvent.setup().type(screen.getByRole("textbox", { name: "Domain" }), "veltein.com");
    expect(screen.getByRole("textbox", { name: "Domain" })).toHaveValue("veltein.com");
    await expectNoA11yViolations(container);
  });
});

describe("LeadForm", () => {
  it("blocks submission until required fields are filled, then shows success", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LeadForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Send request" }));
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/Full name/), "Issam");
    await user.type(screen.getByLabelText(/^Email/), "issam@example.com");
    await user.type(screen.getByLabelText(/How can we help/), "Quote please");
    await user.click(screen.getByRole("checkbox", { name: /agree to be contacted/ }));
    await user.click(screen.getByRole("button", { name: "Send request" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({
      name: "Issam",
      email: "issam@example.com",
      message: "Quote please",
    });
    expect(await screen.findByText("Request sent")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<LeadForm onSubmit={() => {}} />);
    await expectNoA11yViolations(container);
  });
});

describe("getOpeningStatus", () => {
  const periods = [
    { day: 1, open: "09:00", close: "18:00" },
    { day: 5, open: "20:00", close: "02:00" },
  ];
  // 2026-11-09 is a Monday, 2026-11-13 a Friday.
  it("handles same-day hours", () => {
    expect(getOpeningStatus(periods, new Date(2026, 10, 9, 10, 0))).toEqual({
      open: true,
      next: "18:00",
    });
    expect(getOpeningStatus(periods, new Date(2026, 10, 9, 18, 0))).toEqual({
      open: false,
      next: undefined,
    });
    expect(getOpeningStatus(periods, new Date(2026, 10, 9, 8, 0))).toEqual({
      open: false,
      next: "09:00",
    });
  });
  it("handles hours past midnight", () => {
    expect(getOpeningStatus(periods, new Date(2026, 10, 13, 23, 0)).open).toBe(true);
    expect(getOpeningStatus(periods, new Date(2026, 10, 14, 1, 30))).toEqual({
      open: true,
      next: "02:00",
    });
    expect(getOpeningStatus(periods, new Date(2026, 10, 14, 2, 0)).open).toBe(false);
  });
});

describe("ReviewCard", () => {
  it("truncates long reviews behind an expandable toggle", async () => {
    const user = userEvent.setup();
    render(
      <ReviewCard
        author={{ name: "Lina" }}
        rating={4}
        body={"Great. ".repeat(60)}
        truncateAt={40}
      />,
    );
    const toggle = screen.getByRole("button", { name: "Read more" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});

describe("MapPlaceholder", () => {
  it("renders labelled, pressable pins", async () => {
    const user = userEvent.setup();
    const onPinClick = vi.fn();
    const { container } = render(
      <MapPlaceholder
        label="Results map"
        onPinClick={onPinClick}
        pins={[
          { id: "a", x: 10, y: 20, label: "Café Atlas", active: true },
          { id: "b", x: 50, y: 50, label: "Riad Noor" },
        ]}
      />,
    );
    expect(screen.getByRole("region", { name: "Results map" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Café Atlas" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Riad Noor" }));
    expect(onPinClick).toHaveBeenCalledWith("b");
    await expectNoA11yViolations(container);
  });
});

/** Static content components: one axe pass each, so regressions in markup are caught. */
describe("content components pass axe", () => {
  const img = { src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=", alt: "Cover" };
  const cases: Array<[string, () => ReactElement]> = [
    [
      "ArticleCard",
      () => (
        <ArticleCard
          title="Best riads in Fes"
          href="/fes"
          excerpt="Where to stay."
          image={img}
          author={{ name: "Lina" }}
          date={{ display: "Nov 10", dateTime: "2026-11-10" }}
        />
      ),
    ],
    ["CategoryCard", () => <CategoryCard name="Restaurants" href="/r" count="120" />],
    [
      "EventCard",
      () => (
        <EventCard title="Jazz night" href="/e" start={new Date(2026, 10, 20, 20)} venue="Casa" />
      ),
    ],
    [
      "ProfileCard",
      () => <ProfileCard name="Issam" subtitle="Founder" stats={[{ label: "Posts", value: 12 }]} />,
    ],
    [
      "ProductCard",
      () => (
        <ProductCard
          name="Argan oil"
          href="/p"
          image={img}
          price="$12"
          rating={4.5}
          reviewCount={10}
        />
      ),
    ],
    ["ReviewCard", () => <ReviewCard author={{ name: "Reda" }} rating={5} body="Lovely." />],
    [
      "SearchResult",
      () => (
        <SearchResult title="Riad Noor" href="/riad" description="A riad in Fes" query="riad" />
      ),
    ],
    ["OpeningHours", () => <OpeningHours periods={[{ day: 1, open: "09:00", close: "18:00" }]} />],
    ["Location", () => <Location address="12 Rue Atlas, Casablanca" distance="1.2 km" />],
    ["ClaimBusiness", () => <ClaimBusiness businessName="Café Atlas" href="/claim" />],
    [
      "Timeline",
      () => (
        <Timeline>
          <TimelineItem title="Ordered" time="Nov 9" dateTime="2026-11-09" />
          <TimelineItem title="Shipped" variant="success" />
        </Timeline>
      ),
    ],
    [
      "Skeleton/Spinner/Separator/VisuallyHidden",
      () => (
        <div>
          <Skeleton className="h-4" />
          <Spinner />
          <Separator />
          <VisuallyHidden>Hidden label</VisuallyHidden>
        </div>
      ),
    ],
  ];

  it.each(cases)("%s", async (_name, ui) => {
    const { container } = render(ui());
    await expectNoA11yViolations(container);
  });
});
