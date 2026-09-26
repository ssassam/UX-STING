"use client";
import { useState } from "react";
import { Button } from "@unified-ui/react/button";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandLoading, CommandSeparator } from "@unified-ui/react/command";
import { Kbd } from "@unified-ui/react/typography";
import { CalendarIcon, MapPinIcon, PlusIcon, SettingsIcon, UserIcon } from "@unified-ui/icons";

function Items({ onSelect }: { onSelect?: (v: string) => void }) {
  return (
    <>
      <CommandEmpty />
      <CommandGroup heading="Suggestions">
        <CommandItem value="Add a place" icon={<PlusIcon />} shortcut="⌘N" onSelect={onSelect} />
        <CommandItem value="Bookings" keywords={["reservations", "calendar"]} icon={<CalendarIcon />} onSelect={onSelect} />
        <CommandItem value="Nearby" keywords={["map", "location"]} icon={<MapPinIcon />} onSelect={onSelect} />
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Account">
        <CommandItem value="Profile" icon={<UserIcon />} onSelect={onSelect} />
        <CommandItem value="Settings" icon={<SettingsIcon />} shortcut="⌘," onSelect={onSelect} />
        <CommandItem value="Billing" disabled />
      </CommandGroup>
    </>
  );
}

export function Inline() {
  const [last, setLast] = useState<string>();
  return (
    <div className="grid max-w-md gap-2">
      <Command label="Quick actions" className="rounded-lg border border-border shadow-sm">
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <Items onSelect={setLast} />
        </CommandList>
      </Command>
      <p className="text-sm text-muted-foreground" role="status">{last ? `Ran: ${last}` : "Try “resv” (matches keywords)"}</p>
    </div>
  );
}

export function Dialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open palette <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Command palette">
        <CommandInput />
        <CommandList>
          <Items onSelect={() => setOpen(false)} />
        </CommandList>
      </CommandDialog>
    </>
  );
}

export function Async() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  return (
    <Command label="Search places" shouldFilter={false} loading={loading} className="max-w-md rounded-lg border border-border">
      <CommandInput
        placeholder="Search places (simulated API)…"
        onValueChange={(q) => {
          setLoading(true);
          setTimeout(() => {
            setResults(q ? ["Café", "Riad", "Restaurant", "Rooftop bar"].map((r) => `${r} “${q}”`) : []);
            setLoading(false);
          }, 500);
        }}
      />
      <CommandList>
        <CommandLoading />
        <CommandEmpty>Start typing to search.</CommandEmpty>
        {results.map((r) => (
          <CommandItem key={r} value={r} />
        ))}
      </CommandList>
    </Command>
  );
}
