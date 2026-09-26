"use client";
import { Button } from "@unified-ui/react/button";
import { Field } from "@unified-ui/react/field";
import { Input } from "@unified-ui/react/input";
import { InputGroup, InputGroupAction, InputGroupAddon } from "@unified-ui/react/input-group";
import { AtSignIcon, CopyIcon } from "@unified-ui/icons";

export function Addons() {
  return (
    <div className="grid max-w-sm gap-4">
      <Field label="Price">
        <InputGroup>
          <InputGroupAddon>€</InputGroupAddon>
          <Input inputMode="decimal" placeholder="0.00" />
          <InputGroupAddon>EUR</InputGroupAddon>
        </InputGroup>
      </Field>
      <Field label="Username">
        <InputGroup>
          <InputGroupAddon>
            <AtSignIcon />
          </InputGroupAddon>
          <Input placeholder="handle" />
        </InputGroup>
      </Field>
      <Field label="Invite link">
        <InputGroup>
          <Input readOnly defaultValue="https://example.com/invite/8f2k" />
          <InputGroupAction>
            <Button size="xs" variant="ghost" startIcon={<CopyIcon />}>
              Copy
            </Button>
          </InputGroupAction>
        </InputGroup>
      </Field>
    </div>
  );
}
