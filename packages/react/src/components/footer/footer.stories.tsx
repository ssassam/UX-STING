import type { Meta, StoryObj } from "@storybook/react-vite";
import { MailIcon } from "@ux-sting/icons";
import { Button } from "../button/button.js";
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
} from "./footer.js";

const meta = {
  title: "Patterns/Footer",
  component: Footer,
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ tone }: { tone: "default" | "inverse" }) {
  return (
    <Footer tone={tone}>
      <FooterCallout
        title="List your business for free"
        description="Reach thousands of locals and visitors every month."
        actions={<Button>Add my business</Button>}
      />
      <FooterMain>
        <FooterBrand>
          <span className="text-2xl font-bold">citybook.ma</span>
          <FooterTagline>
            The best places near you — restaurants, cafés, hotels and services across Morocco.
          </FooterTagline>
        </FooterBrand>
        <FooterNav aria-label="Footer" columns={4}>
          <FooterColumn title="Explore">
            <FooterLink href="/categories">Categories</FooterLink>
            <FooterLink href="/cities">Cities</FooterLink>
            <FooterLink href="/collections">Collections</FooterLink>
          </FooterColumn>
          <FooterColumn title="Jobs">
            <FooterLink href="/jobs" badge="New">
              Job offers
            </FooterLink>
            <FooterLink href="/jobs/post">Post a job</FooterLink>
          </FooterColumn>
          <FooterColumn title="Business">
            <FooterLink href="/advertise">Advertise</FooterLink>
            <FooterLink href="/partners">Partners</FooterLink>
          </FooterColumn>
          <FooterColumn title="Contact">
            <FooterLink href="mailto:hello@example.com" icon={<MailIcon />}>
              hello@example.com
            </FooterLink>
            <FooterLink href="https://example.com" external>
              Status
            </FooterLink>
          </FooterColumn>
        </FooterNav>
      </FooterMain>
      <FooterBottom>
        <FooterCopyright>© 2026 citybook.ma</FooterCopyright>
        <FooterLegal>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/cookies">Cookies</a>
        </FooterLegal>
      </FooterBottom>
    </Footer>
  );
}

export const Inverse: Story = { render: () => <Demo tone="inverse" /> };
export const Surface: Story = { render: () => <Demo tone="default" /> };
