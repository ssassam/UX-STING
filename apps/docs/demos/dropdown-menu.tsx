"use client";
import { useState } from "react";
import { Button } from "@ux-sting/react/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@ux-sting/react/dropdown-menu";
import { CopyIcon, EllipsisIcon, PencilIcon, Share2Icon, Trash2Icon } from "@ux-sting/icons";

export function Actions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" endIcon={<EllipsisIcon />}>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Listing</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem icon={<PencilIcon />} shortcut="⌘E">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem icon={<CopyIcon />} shortcut="⌘D">
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<Share2Icon />}>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem>Email</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" icon={<Trash2Icon />}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Options() {
  const [sort, setSort] = useState("rating");
  const [openNow, setOpenNow] = useState(true);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked={openNow} onCheckedChange={setOpenNow}>
          Open now
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="rating">Rating</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="distance">Distance</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
