import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import {
  BusinessCard,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  ColorModeToggle,
  FilterChips,
  getOpeningStatus,
  Highlight,
  MobileNavigation,
  MobileNavigationItem,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarLink,
  NavbarMobileLink,
  NavbarMobileMenu,
  PremiumBadge,
  Price,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
  toast,
  Toaster,
  UIProvider,
  useMessages,
} from "../index.js";

describe("UIProvider", () => {
  it("applies theme, mode, density, locale and direction", () => {
    const { container } = render(
      <UIProvider theme="compact" colorMode="dark" density="compact" locale="ar">
        content
      </UIProvider>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-ui-theme", "compact");
    expect(root).toHaveAttribute("data-theme", "dark");
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root).toHaveAttribute("dir", "rtl");
    expect(root).toHaveAttribute("lang", "ar");
  });

  it("provides localized messages (en, fr, ar) with overrides", () => {
    function Probe() {
      const m = useMessages();
      return <span>{m.close}|{m.pageOf(2, 5)}</span>;
    }
    const { rerender } = render(<UIProvider locale="fr-CA"><Probe /></UIProvider>);
    expect(screen.getByText("Fermer|Page 2 sur 5")).toBeInTheDocument();
    rerender(<UIProvider locale="ar"><Probe /></UIProvider>);
    expect(screen.getByText("إغلاق|الصفحة 2 من 5")).toBeInTheDocument();
    rerender(<UIProvider locale="en" messages={{ close: "Dismiss" }}><Probe /></UIProvider>);
    expect(screen.getByText("Dismiss|Page 2 of 5")).toBeInTheDocument();
  });

  it("injects CSS for custom theme objects", () => {
    const { container } = render(<UIProvider theme={{ name: "brand", primary: "pink", radius: "large" }}>x</UIProvider>);
    const style = container.querySelector("style[data-ui-custom-theme='brand']");
    expect(style?.textContent).toContain('[data-ui-theme="brand"]');
    expect(style?.textContent).toContain("--ui-radius: 0.875rem");
  });

  it("toggles color mode and persists it", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <UIProvider storageKey="test-mode">
        <ColorModeToggle />
      </UIProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(container.firstElementChild).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("test-mode")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });
});

describe("Toast", () => {
  it("announces politely, runs actions and dismisses", async () => {
    const user = userEvent.setup();
    const undo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.success("Listing saved", { description: "Visible to everyone", action: { label: "Undo", onClick: undo } });
    });
    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("Listing saved");
    expect(status).toHaveAttribute("aria-live", "polite");
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText("Listing saved")).toBeNull());
  });

  it("uses assertive alerts for errors and resolves promises", async () => {
    render(<Toaster />);
    let resolve!: (v: string) => void;
    act(() => {
      void toast.promise(new Promise<string>((r) => (resolve = r)), { loading: "Uploading…", success: (v) => `Uploaded ${v}`, error: "Failed" });
    });
    expect(await screen.findByText("Uploading…")).toBeInTheDocument();
    await act(async () => resolve("photo.jpg"));
    expect(await screen.findByText("Uploaded photo.jpg")).toBeInTheDocument();
    act(() => {
      toast.error("Payment failed");
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("Payment failed");
    act(() => toast.dismiss());
  });
});

describe("navigation", () => {
  it("Navbar marks the current page and opens the mobile menu", async () => {
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarBrand>Acme</NavbarBrand>
        <NavbarContent>
          <NavbarLink href="/" active>Home</NavbarLink>
          <NavbarLink href="/explore">Explore</NavbarLink>
        </NavbarContent>
        <NavbarMobileMenu>
          <NavbarMobileLink href="/explore">Explore</NavbarMobileLink>
        </NavbarMobileMenu>
      </Navbar>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("Sidebar collapses on desktop and keeps labels for screen readers", async () => {
    const user = userEvent.setup();
    const mql = window.matchMedia;
    window.matchMedia = ((q: string) => ({ ...mql(q), matches: q.includes("min-width") })) as typeof window.matchMedia;
    render(
      <SidebarProvider>
        <Sidebar label="App">
          <SidebarContent>
            <SidebarGroup label="Main">
              <SidebarItem href="/" active icon={<span />}>Dashboard</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle sidebar" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    window.matchMedia = mql;
  });

  it("MobileNavigation warns above five items", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <MobileNavigation>
        {Array.from({ length: 6 }, (_, i) => (
          <MobileNavigationItem key={i} href={`/${i}`} icon={<span />}>Item {i}</MobileNavigationItem>
        ))}
      </MobileNavigation>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("at most 5 items"));
    warn.mockRestore();
  });
});

describe("Carousel & Resizable", () => {
  it("carousel exposes slides, controls and a pause button", async () => {
    const user = userEvent.setup();
    render(
      <Carousel label="Photos" autoplay={4000}>
        <CarouselContent>
          {[1, 2, 3].map((n) => (
            <CarouselItem key={n} index={n - 1}>Slide {n}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselPlayToggle />
      </Carousel>,
    );
    expect(screen.getByRole("region", { name: "Photos" })).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("group", { name: "Slide 2 of 3" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Pause slideshow" }));
    expect(screen.getByRole("button", { name: "Play slideshow" })).toBeInTheDocument();
  });

  it("resizable handle is a keyboard-operable separator", async () => {
    const user = userEvent.setup();
    const onSizesChange = vi.fn();
    render(
      <ResizablePanelGroup onSizesChange={onSizesChange}>
        <ResizablePanel>A</ResizablePanel>
        <ResizableHandle aria-label="Resize panels" />
        <ResizablePanel>B</ResizablePanel>
      </ResizablePanelGroup>,
    );
    const handle = screen.getByRole("separator", { name: "Resize panels" });
    expect(handle).toHaveAttribute("aria-valuenow", "50");
    handle.focus();
    await user.keyboard("{ArrowRight}");
    expect(onSizesChange).toHaveBeenLastCalledWith([55, 45]);
  });
});

describe("patterns", () => {
  it("BusinessCard has one stretched link and readable metadata", async () => {
    const { container } = render(
      <BusinessCard
        name="Café Atlas"
        href="/places/cafe-atlas"
        category="Coffee shop"
        rating={4.6}
        reviewCount={128}
        priceLevel={2}
        address="12 Rue de Fès"
        distance="850 m"
        badges={<PremiumBadge />}
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Café Atlas" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "4.6 out of 5 stars" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Price level 2 of 4" })).toBeInTheDocument();
    await act(async () => expectNoA11yViolations(container));
  });

  it("Price formats currency per locale with accessible compare-at", () => {
    render(
      <UIProvider locale="fr-FR">
        <Price amount={49.9} currency="EUR" compareAt={69} />
      </UIProvider>,
    );
    expect(screen.getByText(/49,90/)).toBeInTheDocument();
    expect(screen.getByText("Original price:", { exact: false })).toHaveClass("sr-only");
  });

  it("computes opening status across midnight", () => {
    const periods = [{ day: 5, open: "18:00", close: "02:00" }];
    expect(getOpeningStatus(periods, new Date(2026, 0, 2, 23, 0)).open).toBe(true);
    expect(getOpeningStatus(periods, new Date(2026, 0, 3, 1, 30)).open).toBe(true);
    expect(getOpeningStatus(periods, new Date(2026, 0, 3, 3, 0)).open).toBe(false);
  });

  it("Highlight marks accent-insensitive matches", () => {
    const { container } = render(<Highlight text="Crème brûlée café" query="cafe creme" />);
    expect(Array.from(container.querySelectorAll("mark")).map((m) => m.textContent)).toEqual(["Crème", "café"]);
  });

  it("FilterChips remove individual filters", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<FilterChips filters={[{ id: "open", label: "Open now" }]} onRemove={onRemove} onClearAll={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Remove Open now" }));
    expect(onRemove).toHaveBeenCalledWith("open");
  });
});
