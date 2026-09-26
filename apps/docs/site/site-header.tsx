"use client";
import { MapPinIcon, SearchIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { ColorModeToggle } from "@ux-sting/react/color-mode-toggle";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ux-sting/react/command";
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarLink,
  NavbarMobileLink,
  NavbarMobileMenu,
} from "@ux-sting/react/navbar";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Kbd } from "@ux-sting/react/typography";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export interface SearchEntry {
  href: string;
  title: string;
  group: string;
  keywords?: string[];
}

export interface ThemeControlsProps {
  theme: string;
  density: string;
  locale: string;
  onThemeChange: (v: string) => void;
  onDensityChange: (v: string) => void;
  onLocaleChange: (v: string) => void;
}

export function SiteHeader({
  entries,
  controls,
}: {
  entries: SearchEntry[];
  controls: ThemeControlsProps;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const groups = [...new Set(entries.map((e) => e.group))];
  return (
    <>
      <Navbar maxWidth="full">
        <NavbarBrand asChild>
          <a
            href="/"
            className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MapPinIcon className="size-5 text-primary" />
            UX-STING
          </a>
        </NavbarBrand>
        <NavbarContent>
          <NavbarLink href="/docs/introduction" active={pathname.startsWith("/docs")}>
            Docs
          </NavbarLink>
          <NavbarLink href="/components" active={pathname.startsWith("/components")}>
            Components
          </NavbarLink>
          <NavbarLink href="/docs/patterns">Patterns</NavbarLink>
          <NavbarLink href="/docs/cli">CLI</NavbarLink>
        </NavbarContent>
        <NavbarActions>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            startIcon={<SearchIcon />}
            aria-label="Search documentation"
            className="text-muted-foreground"
          >
            <span className="hidden sm:inline">Search…</span>
            <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
          </Button>
          <div className="hidden items-center gap-1 lg:flex">
            <NativeSelect
              size="sm"
              aria-label="Theme"
              value={controls.theme}
              onChange={(e) => controls.onThemeChange(e.target.value)}
              className="w-32"
            >
              {[
                "default",
                "neutral",
                "modern",
                "compact",
                "soft",
                "high-contrast",
                "material",
                "fluent",
                "carbon",
                "polaris",
                "apple",
                "baseweb",
                "stripe",
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              size="sm"
              aria-label="Density"
              value={controls.density}
              onChange={(e) => controls.onDensityChange(e.target.value)}
              className="w-36"
            >
              {["compact", "comfortable", "spacious"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              size="sm"
              aria-label="Language"
              value={controls.locale}
              onChange={(e) => controls.onLocaleChange(e.target.value)}
              className="w-28"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </NativeSelect>
          </div>
          <ColorModeToggle />
          <NavbarMobileMenu title="UX-STING">
            <NavbarMobileLink href="/docs/introduction">Docs</NavbarMobileLink>
            <NavbarMobileLink href="/components">Components</NavbarMobileLink>
            <NavbarMobileLink href="/docs/patterns">Patterns</NavbarMobileLink>
            <NavbarMobileLink href="/docs/cli">CLI</NavbarMobileLink>
          </NavbarMobileMenu>
        </NavbarActions>
      </Navbar>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search documentation">
        <CommandInput placeholder="Search components and guides…" />
        <CommandList>
          <CommandEmpty />
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {entries
                .filter((e) => e.group === group)
                .map((e) => (
                  <CommandItem
                    key={e.href}
                    value={e.title}
                    keywords={e.keywords}
                    onSelect={() => {
                      setOpen(false);
                      router.push(e.href);
                    }}
                  />
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
