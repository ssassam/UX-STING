"use client";
import { Button, ButtonGroup, IconButton } from "@unified-ui/react/button";
import {
  ArrowRightIcon,
  DownloadIcon,
  PlusIcon,
  SettingsIcon,
  Trash2Icon,
} from "@unified-ui/icons";

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Button key={size} size={size}>
          Size {size}
        </Button>
      ))}
    </div>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Saving</Button>
      <Button loading loadingText="Uploading…" variant="outline">
        Upload
      </Button>
      <Button disabled>Disabled</Button>
      <Button variant="ghost" active>
        Active
      </Button>
    </div>
  );
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button startIcon={<PlusIcon />}>New listing</Button>
      <Button variant="outline" endIcon={<ArrowRightIcon className="rtl:rotate-180" />}>
        Continue
      </Button>
      <IconButton aria-label="Settings" variant="ghost">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Delete" variant="outline" shape="circle">
        <Trash2Icon />
      </IconButton>
    </div>
  );
}

export function Group() {
  return (
    <ButtonGroup attached aria-label="Export format">
      <Button variant="outline" startIcon={<DownloadIcon />}>
        CSV
      </Button>
      <Button variant="outline">Excel</Button>
      <Button variant="outline">PDF</Button>
    </ButtonGroup>
  );
}

export function AsLink() {
  return (
    <Button asChild variant="secondary">
      <a href="#pricing">View pricing</a>
    </Button>
  );
}
