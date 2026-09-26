"use client";
import { CopyIcon, MailIcon, Share2Icon } from "@unified-ui/icons";
import { ButtonGroup, IconButton } from "@unified-ui/react/button";
import { toast } from "@unified-ui/react/toast";
import { Tooltip } from "@unified-ui/react/tooltip";

export function ShareBar({ title }: { title: string }) {
  const url = typeof window === "undefined" ? "" : window.location.href;
  return (
    <ButtonGroup aria-label="Share this story">
      <Tooltip content="Copy link">
        <IconButton aria-label="Copy link" variant="outline" size="sm" onClick={async () => { await navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
          <CopyIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content="Share by email">
        <IconButton asChild aria-label="Share by email" variant="outline" size="sm">
          <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}><MailIcon /></a>
        </IconButton>
      </Tooltip>
      <Tooltip content="More options">
        <IconButton
          aria-label="More sharing options"
          variant="outline"
          size="sm"
          onClick={() => (navigator.share ? navigator.share({ title, url: window.location.href }).catch(() => {}) : toast("Sharing is not supported on this device"))}
        >
          <Share2Icon />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}
