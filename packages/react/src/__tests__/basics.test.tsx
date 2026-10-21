import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProvider } from "../test-utils.js";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Grid,
  Heading,
  IconButton,
  Progress,
  Stack,
  Stepper,
  Tag,
  Text,
  Toggle,
} from "../index.js";
import { ImageGallery } from "../components/media/image-gallery.js";
import { Image } from "../components/media/image.js";

describe("Button", () => {
  it("renders variants and handles clicks", async () => {
    const onClick = vi.fn();
    render(
      <Button variant="outline" size="lg" onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toContain("h-control-lg");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled and busy while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading loadingText="Saving…" onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Saving…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("supports asChild links", () => {
    render(
      <Button asChild>
        <a href="/pricing">Pricing</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
    expect(link.className).toContain("bg-primary");
  });

  it("is operable with the keyboard", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("IconButton requires and exposes a label", () => {
    render(<IconButton aria-label="Delete">×</IconButton>);
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("ui-hit-area");
  });
});

describe("Toggle", () => {
  it("toggles aria-pressed (uncontrolled)", async () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    const t = screen.getByRole("button", { name: "Bold" });
    expect(t).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(t);
    expect(t).toHaveAttribute("aria-pressed", "true");
  });

  it("respects controlled state", async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" pressed={false} onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
});

describe("layout", () => {
  it("Stack and Grid emit responsive CSS variables", () => {
    render(
      <>
        <Stack
          data-testid="stack"
          gap={{ base: "2", md: "6" }}
          direction={{ base: "column", md: "row" }}
        />
        <Grid data-testid="grid" columns={{ base: 1, md: 3 }} />
      </>,
    );
    const stack = screen.getByTestId("stack");
    expect(stack.style.getPropertyValue("--ui-gap-md")).toBe("var(--ui-space-6)");
    expect(stack.style.getPropertyValue("--ui-direction-md")).toBe("row");
    expect(screen.getByTestId("grid").style.getPropertyValue("--ui-cols-md")).toBe("3");
  });

  it("Heading keeps semantic level independent from size", () => {
    render(
      <Heading level={1} size="sm">
        Title
      </Heading>,
    );
    const h = screen.getByRole("heading", { level: 1 });
    expect(h.className).toContain("text-lg");
  });
});

describe("display components", () => {
  it("Avatar falls back to initials and groups overflow", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" />
      </AvatarGroup>,
    );
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent("AL");
    expect(screen.getByRole("img", { name: "1 more" })).toHaveTextContent("+1");
  });

  it("Tag is removable with an accessible button", async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Vegan</Tag>);
    await userEvent.click(screen.getByRole("button", { name: "Remove Vegan" }));
    expect(onRemove).toHaveBeenCalled();
  });

  it("Progress exposes value semantics", () => {
    render(<Progress value={40} label="Upload" id="p" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
  });

  it("Progress uses its label as the accessible name without an id", () => {
    render(<Progress value={60} label="Trip countdown" />);
    expect(screen.getByRole("progressbar", { name: "Trip countdown" })).toBeInTheDocument();
  });

  it("Stepper marks the current step", () => {
    render(
      <Stepper current={1} steps={[{ title: "Cart" }, { title: "Shipping" }, { title: "Pay" }]} />,
    );
    expect(screen.getByText("Shipping").closest("li")).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("(completed)", { exact: false })).toBeInTheDocument();
  });

  it("Breadcrumb marks the current page", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Cafés</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Cafés")).toHaveAttribute("aria-current", "page");
  });

  it("static components have no axe violations", async () => {
    const { container } = renderWithProvider(
      <main>
        <Heading level={1}>Dashboard</Heading>
        <Text variant="muted">Welcome back</Text>
        <Card>
          <CardHeader>
            <CardTitle as="h2">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Paid</Badge>
          </CardContent>
        </Card>
        <Alert variant="warning">
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>Your trial ends soon.</AlertDescription>
        </Alert>
        <Progress value={20} aria-label="Profile completion" />
        <IconButton aria-label="Settings">⚙</IconButton>
      </main>,
    );
    await act(async () => expectNoA11yViolations(container));
  });
});

describe("ImageGallery", () => {
  const images = Array.from({ length: 7 }, (_, i) => ({
    src: `/p${i}.jpg`,
    alt: `Photo ${i + 1}`,
  }));

  it("mosaic shows one large + four and a +n tile, never leaving gaps", () => {
    render(<ImageGallery images={images} layout="mosaic" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("mosaic falls back to a plain grid for fewer than five images", () => {
    const { container } = render(<ImageGallery images={images.slice(0, 3)} layout="mosaic" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(container.querySelector("ul")?.className).not.toContain("row-span-2");
  });
});

describe("control styles", () => {
  it("only tints read-only text fields, never buttons styled as controls", async () => {
    const { controlVariants } = await import("../lib/control.js");
    const classes = controlVariants();
    expect(classes).not.toMatch(/(^|\s)read-only:/);
    expect(classes).toContain("[&:is(input,textarea):read-only]:bg-surface");
  });
});

describe("Image", () => {
  it("shows an image that finished loading before hydration", () => {
    const complete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "complete");
    const natural = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "naturalWidth");
    Object.defineProperty(HTMLImageElement.prototype, "complete", {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
      configurable: true,
      get: () => 640,
    });
    try {
      render(<Image src="/cached.jpg" alt="Cached photo" />);
      expect(screen.getByRole("img", { name: "Cached photo" })).toHaveClass("opacity-100");
    } finally {
      if (complete) Object.defineProperty(HTMLImageElement.prototype, "complete", complete);
      else delete (HTMLImageElement.prototype as { complete?: boolean }).complete;
      if (natural) Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", natural);
    }
  });
});
