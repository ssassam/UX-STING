"use client";
import { IconButton } from "@unified-ui/react/button";
import { Tooltip } from "@unified-ui/react/tooltip";
import { CopyIcon, HeartIcon, Share2Icon } from "@unified-ui/icons";

export function Basic() {
  return (
    <div className="flex gap-2">
      <Tooltip content="Copy link">
        <IconButton aria-label="Copy link" variant="outline">
          <CopyIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content="Save to favorites" side="bottom">
        <IconButton aria-label="Save to favorites" variant="outline">
          <HeartIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content="Share · ⌘S" side="right">
        <IconButton aria-label="Share" variant="outline">
          <Share2Icon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
