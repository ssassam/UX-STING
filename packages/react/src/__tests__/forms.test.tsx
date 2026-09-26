import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import {
  Button,
  Calendar,
  Checkbox,
  CheckboxGroup,
  Combobox,
  Dropzone,
  Field,
  Form,
  FormErrorSummary,
  Input,
  NumberInput,
  OTPInput,
  PasswordInput,
  Radio,
  RadioGroup,
  Rating,
  SearchInput,
  Switch,
  Textarea,
  UIProvider,
} from "../index.js";

describe("Field", () => {
  it("wires label, description, error and required", () => {
    render(
      <Field label="Email" description="We never share it." error="Enter a valid email" required>
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("We never share it. Enter a valid email");
  });

  it("works with textarea and has no a11y violations", async () => {
    const { container } = render(
      <Field label="Message" description="Max 500 characters">
        <Textarea />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveAccessibleDescription(
      "Max 500 characters",
    );
    await act(async () => expectNoA11yViolations(container));
  });
});

describe("Form", () => {
  function SignUp({ onSubmit = vi.fn() }: { onSubmit?: (v: Record<string, unknown>) => void }) {
    return (
      <Form
        onSubmit={onSubmit}
        validate={(v) => (v.name === "admin" ? { name: "This name is reserved" } : undefined)}
      >
        <FormErrorSummary />
        <Field name="name" label="Name" required>
          <Input />
        </Field>
        <Field name="email" label="Email" required>
          <Input type="email" />
        </Field>
        <Button type="submit">Create account</Button>
      </Form>
    );
  }

  it("shows an error summary and focuses it on failed submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignUp onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Create account" }));
    const summary = await screen.findByRole("alert", {}, { timeout: 3000 });
    expect(summary).toHaveTextContent("There are 2 problems");
    // Focus moves on the next animation frame; allow for slow CI machines.
    await waitFor(() => expect(summary).toHaveFocus(), { timeout: 3000 });
    expect(screen.getByLabelText(/Name/)).toHaveAttribute("aria-invalid", "true");
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole("link", { name: /Email/ }));
    expect(screen.getByLabelText(/Email/)).toHaveFocus();
  });

  it("runs custom validation then submits valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignUp onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Name/), "admin");
    await user.type(screen.getByLabelText(/Email/), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(
      await screen.findByText("This name is reserved", { selector: "p span" }),
    ).toBeInTheDocument();
    await user.clear(screen.getByLabelText(/Name/));
    await user.type(screen.getByLabelText(/Name/), "Ada");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { name: "Ada", email: "ada@example.com" },
        expect.anything(),
      ),
    );
  });

  it("validates on blur, not on each keystroke", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    const email = screen.getByLabelText(/Email/);
    await user.type(email, "not-an-email");
    expect(email).not.toHaveAttribute("aria-invalid");
    await user.tab();
    expect(email).toHaveAttribute("aria-invalid", "true");
  });

  it("clears an error as soon as the field is fixed, before blur", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    const email = screen.getByLabelText(/Email/);
    await user.type(email, "not-an-email");
    await user.tab();
    expect(email).toHaveAttribute("aria-invalid", "true");
    await user.clear(email);
    await user.type(email, "ada@example.com");
    expect(email).not.toHaveAttribute("aria-invalid");
  });

  it("clears a required checkbox error when it is ticked", async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <FormErrorSummary />
        <Checkbox name="terms" value="yes" required label="I agree" />
        <Button type="submit">Send</Button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    await user.click(screen.getByRole("checkbox", { name: "I agree" }));
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  });
});

describe("inputs", () => {
  it("PasswordInput toggles visibility with a labelled button", async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Password" />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("SearchInput clears with Escape and the clear button", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByRole("searchbox", { name: "Search" });
    await user.type(input, "pizza{Enter}");
    expect(onSearch).toHaveBeenCalledWith("pizza");
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(input).toHaveValue("");
    await user.type(input, "tacos{Escape}");
    expect(input).toHaveValue("");
  });

  it("NumberInput steps, clamps and formats per locale", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <UIProvider locale="fr-FR">
        <NumberInput
          aria-label="Guests"
          defaultValue={2}
          min={1}
          max={4}
          onValueChange={onValueChange}
        />
      </UIProvider>,
    );
    const input = screen.getByRole("spinbutton", { name: "Guests" });
    input.focus();
    await user.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}");
    expect(input).toHaveAttribute("aria-valuenow", "4");
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    await user.clear(input);
    await user.type(input, "3,0");
    await user.tab();
    expect(input).toHaveAttribute("aria-valuenow", "3");
  });

  it("Checkbox, Switch and RadioGroup are labelled and toggle", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox label="Accept terms" />
        <Switch label="Notifications" />
        <RadioGroup aria-label="Plan" defaultValue="free">
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      </>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeChecked();
    await user.click(screen.getByText("Notifications"));
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Free" }));
    // Radix moves focus asynchronously; hold the key as a real user would.
    await user.keyboard("{ArrowDown>}");
    await waitFor(() => expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked());
    await user.keyboard("{/ArrowDown}");
  });

  it("CheckboxGroup manages an array value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup legend="Amenities" onValueChange={onValueChange}>
        <Checkbox value="wifi" label="Wi-Fi" />
        <Checkbox value="parking" label="Parking" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole("group", { name: "Amenities" })).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Wi-Fi" }));
    await user.click(screen.getByRole("checkbox", { name: "Parking" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["wifi", "parking"]);
  });

  it("Rating is a keyboard-accessible radio group", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating label="Rate your stay" onValueChange={onValueChange} />);
    expect(screen.getByRole("radiogroup", { name: "Rate your stay" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "4 out of 5 stars" }));
    expect(onValueChange).toHaveBeenCalledWith(4);
  });

  it("OTPInput accepts pasted codes and calls onComplete", async () => {
    const onComplete = vi.fn();
    render(<OTPInput aria-label="Verification code" length={4} onComplete={onComplete} />);
    const first = screen.getByRole("textbox", { name: "Verification code 1/4" });
    fireEvent.paste(first, { clipboardData: { getData: () => "12a34" } });
    expect(onComplete).toHaveBeenCalledWith("1234");
    expect(first).toHaveAttribute("autocomplete", "one-time-code");
  });

  it("Dropzone validates type and size and is keyboard operable", async () => {
    const user = userEvent.setup({ applyAccept: false });
    const accepted = vi.fn();
    const rejected = vi.fn();
    const { container } = render(
      <Dropzone
        accept="image/*"
        maxSize={1000}
        onFilesAccepted={accepted}
        onFilesRejected={rejected}
      />,
    );
    expect(screen.getByRole("button", { name: "Browse files" })).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const good = new File(["x"], "a.png", { type: "image/png" });
    const bad = new File(["x".repeat(2000)], "b.png", { type: "image/png" });
    const pdf = new File(["x"], "c.pdf", { type: "application/pdf" });
    await user.upload(input, [good, bad, pdf]);
    expect(accepted).toHaveBeenCalledWith([good]);
    expect(rejected).toHaveBeenCalledWith([
      { file: bad, reason: "size" },
      { file: pdf, reason: "type" },
    ]);
  });
});

describe("Combobox", () => {
  it("filters options and selects with the keyboard", async () => {
    const user = userEvent.setup();
    function Demo() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <>
          <Combobox
            aria-label="City"
            value={value}
            onValueChange={setValue}
            options={[
              { value: "cas", label: "Casablanca" },
              { value: "rab", label: "Rabat" },
              { value: "par", label: "Paris" },
            ]}
          />
          <output>{value}</output>
        </>
      );
    }
    render(<Demo />);
    await user.click(screen.getByRole("combobox", { name: "City" }));
    await user.keyboard("par");
    expect(screen.queryByRole("option", { name: /Rabat/ })).toBeNull();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByText("par", { selector: "output" })).toBeInTheDocument(),
    );
    expect(screen.getByRole("combobox", { name: "City" })).toHaveTextContent("Paris");
  });
});

describe("Calendar", () => {
  it("navigates days with arrows and selects with Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar
        today={new Date(2026, 0, 15)}
        defaultMonth={new Date(2026, 0, 1)}
        onValueChange={onValueChange}
      />,
    );
    const today = screen.getByRole("button", { name: /15/ });
    expect(today).toHaveAttribute("aria-current", "date");
    today.focus();
    await user.keyboard("{ArrowRight}{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 23));
    await user.keyboard("{PageDown}");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/February 2026/);
  });

  it("mirrors horizontal arrows in RTL and localizes names", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <UIProvider locale="ar-MA">
        <Calendar
          today={new Date(2026, 0, 15)}
          defaultMonth={new Date(2026, 0, 1)}
          onValueChange={onValueChange}
        />
      </UIProvider>,
    );
    const grid = screen.getByRole("grid");
    expect(grid.closest("[dir]")).toHaveAttribute("dir", "rtl");
    const focused = grid.querySelector<HTMLButtonElement>('[data-focused="true"]')!;
    focused.focus();
    await user.keyboard("{ArrowLeft}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 16));
  });

  it("respects min/max and disabled dates", () => {
    render(
      <Calendar
        defaultMonth={new Date(2026, 0, 1)}
        min={new Date(2026, 0, 10)}
        isDisabled={(d) => d.getDay() === 0}
      />,
    );
    expect(screen.getByRole("button", { name: /January 9/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Sunday, January 11/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Monday, January 12/ })).toBeEnabled();
  });
});
