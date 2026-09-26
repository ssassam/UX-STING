"use client";
import { IconButton } from "@ux-sting/react/button";
import { Tooltip } from "@ux-sting/react/tooltip";
import { CopyIcon, HeartIcon, Share2Icon } from "@ux-sting/icons";

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
