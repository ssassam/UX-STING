import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterCallout,
  FooterColumn,
  FooterCopyright,
  FooterLegal,
  FooterLink,
  FooterMain,
  FooterNav,
  FooterTagline,
} from "../index.js";

function Demo() {
  return (
    <Footer>
      <FooterCallout title="List your business" actions={<a href="/add">Add</a>} />
      <FooterMain>
        <FooterBrand>
          <FooterTagline>Local places</FooterTagline>
        </FooterBrand>
        <FooterNav aria-label="Footer" columns={3}>
          <FooterColumn title="Explore">
            <FooterLink href="/cities" aria-current="page">
              Cities
            </FooterLink>
            <FooterLink href="/jobs" badge="New">
              Jobs
            </FooterLink>
          </FooterColumn>
          <FooterColumn title="More">
            <FooterLink href="https://example.com" external externalLabel="(nouvel onglet)">
              Status
            </FooterLink>
            <FooterLink asChild>
              <a href="/custom">Custom</a>
            </FooterLink>
          </FooterColumn>
        </FooterNav>
      </FooterMain>
      <FooterBottom>
        <FooterCopyright>© 2026</FooterCopyright>
        <FooterLegal>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </FooterLegal>
      </FooterBottom>
    </Footer>
  );
}

describe("Footer", () => {
  it("renders a contentinfo landmark with headed link columns", () => {
    render(<Demo />);
    expect(screen.getByRole("contentinfo")).toHaveAttribute("data-tone", "inverse");
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Explore" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cities" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Custom" })).toHaveAttribute("href", "/custom");
  });

  it("opens external links in a new tab and announces it", () => {
    render(<Demo />);
    const link = screen.getByRole("link", { name: /Status/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("(nouvel onglet)");
  });

  it("separates legal links without extra links", () => {
    render(<Demo />);
    const legal = screen.getByRole("link", { name: "Privacy" }).closest("ul")!;
    expect(legal.querySelectorAll("a")).toHaveLength(2);
    expect(legal.querySelectorAll("li[aria-hidden]")).toHaveLength(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    await expectNoA11yViolations(container);
  });
});
