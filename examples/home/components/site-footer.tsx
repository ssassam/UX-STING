import { MailIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterCallout,
  FooterColumn,
  FooterCopyright,
  FooterLink,
  FooterMain,
  FooterNav,
  FooterTagline,
} from "@ux-sting/react/footer";
import { CONTACT_EMAIL } from "../content/premium";
import { demos, GITHUB_URL, NPM_URL, SITE } from "../content/site";
import { Mark } from "./mark";

export function SiteFooter() {
  return (
    <Footer tone="inverse">
      <FooterCallout
        title="Your next page, proven before it ships."
        description="Install the skills, ask your agent for a page, and get a browser QA report with it."
        actions={
          <Button asChild>
            <a href="#install">Install UX-STING</a>
          </Button>
        }
      />
      <FooterMain>
        <FooterBrand>
          <span className="inline-flex items-center gap-2 text-2xl font-bold">
            <Mark className="size-7" /> UX-STING
          </span>
          <FooterTagline>
            Accessible React components, design tokens and agent skills — built by Veltein.
          </FooterTagline>
        </FooterBrand>
        <FooterNav aria-label="Footer" columns={3}>
          <FooterColumn title="Product">
            <FooterLink href="#inside">What&apos;s inside</FooterLink>
            <FooterLink href="#how">How it works</FooterLink>
            <FooterLink href="#pricing">Premium &amp; licensing</FooterLink>
            <FooterLink href={`${SITE}/toolkit/`}>Toolkit</FooterLink>
          </FooterColumn>
          <FooterColumn title="Live demos">
            {demos.map((d) => (
              <FooterLink key={d.id} href={d.href}>
                {d.name}
              </FooterLink>
            ))}
          </FooterColumn>
          <FooterColumn title="Resources">
            <FooterLink href={GITHUB_URL} external>
              GitHub
            </FooterLink>
            <FooterLink href={NPM_URL} external>
              npm
            </FooterLink>
            <FooterLink href={`mailto:${CONTACT_EMAIL}`} icon={<MailIcon />}>
              {CONTACT_EMAIL}
            </FooterLink>
          </FooterColumn>
        </FooterNav>
      </FooterMain>
      <FooterBottom>
        <FooterCopyright>© 2026 Veltein (Issam El Bani)</FooterCopyright>
      </FooterBottom>
    </Footer>
  );
}
