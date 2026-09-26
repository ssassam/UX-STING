"use client";
import { Button } from "@ux-sting/react/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ux-sting/react/collapsible";
import { ChevronsUpDownIcon } from "@ux-sting/icons";

export function Basic() {
  return (
    <Collapsible className="max-w-sm rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Advanced options</span>
        <CollapsibleTrigger asChild>
          <Button size="sm" variant="ghost" aria-label="Toggle advanced options">
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="grid gap-2 pt-3 text-sm text-muted-foreground">
          <p>Custom domain</p>
          <p>Webhooks</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
