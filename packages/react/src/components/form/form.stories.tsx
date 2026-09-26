import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Field } from "../field/field.js";
import { Input } from "../input/input.js";
import { PasswordInput } from "../password-input/password-input.js";
import { Form, FormErrorSummary } from "./form.js";

const meta = { title: "Forms/Form", component: Form, tags: ["no-visual"] } satisfies Meta<typeof Form>;
export default meta;
type Story = StoryObj;

export const SignUp: Story = {
  render: () => (
    <Form className="max-w-md" onSubmit={() => new Promise((r) => setTimeout(r, 600))}>
      <FormErrorSummary />
      <Field name="name" label="Full name" required><Input autoComplete="name" /></Field>
      <Field name="email" label="Email" required><Input type="email" autoComplete="email" /></Field>
      <Field name="password" label="Password" description="At least 8 characters." required><PasswordInput minLength={8} /></Field>
      <Checkbox name="terms" value="yes" required label="I accept the terms" />
      <Button type="submit" className="justify-self-start">Create account</Button>
    </Form>
  ),
};
export const ServerErrors: Story = {
  render: () => (
    <Form className="max-w-md" errors={{ email: "This email is already registered." }}>
      <Field name="email" label="Email"><Input type="email" defaultValue="ada@example.com" /></Field>
    </Form>
  ),
};
