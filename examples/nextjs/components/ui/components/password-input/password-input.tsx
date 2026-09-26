"use client";
import { EyeIcon, EyeOffIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, useState } from "react";
import { useMessages } from "../../provider/context";
import { Input, type InputProps } from "../input/input";
import { InputGroup, InputGroupAction } from "../input-group/input-group";

/**
 * Password field with a show/hide toggle. Paste and password managers are
 * never blocked (WCAG 2.2 accessible authentication).
 */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  function PasswordInput(
    { size = "md", className, autoComplete = "current-password", ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const messages = useMessages();
    return (
      <InputGroup size={size} className={className}>
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          size={size}
          autoComplete={autoComplete}
          {...props}
        />
        <InputGroupAction>
          <button
            type="button"
            aria-label={visible ? messages.hidePassword : messages.showPassword}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
            disabled={props.disabled}
            className={cn(
              "ui-hit-area inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4",
            )}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </InputGroupAction>
      </InputGroup>
    );
  },
);
