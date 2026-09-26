"use client";
import { Button } from "@unified-ui/react/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@unified-ui/react/collapsible";
import { ChevronsUpDownIcon } from "@unified-ui/icons";

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
