import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Field } from "../field/field.js";
import { Input } from "../input/input.js";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog.js";

const meta = { title: "Overlays/Dialog", component: Dialog } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj;

const Demo = ({ open, long }: { open?: boolean; long?: boolean }) => (
  <Dialog defaultOpen={open}>
    <DialogTrigger asChild>
      <Button>Edit business</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit business</DialogTitle>
        <DialogDescription>Changes are visible after review.</DialogDescription>
      </DialogHeader>
      <DialogBody className="grid gap-4">
        <Field label="Name"><Input defaultValue="Café Atlas" /></Field>
        {long ? Array.from({ length: 20 }, (_, i) => <p key={i}>Paragraph {i + 1} — long content scrolls inside the body while the header and footer stay visible.</p>) : null}
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
        <Button>Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const Closed: Story = { render: () => <Demo /> };
export const Open: Story = { render: () => <Demo open /> };
export const LongContent: Story = { render: () => <Demo open long /> };
export const Mobile: Story = { render: () => <Demo open />, parameters: { viewport: { defaultViewport: "mobile" } } };
export const DarkMode: Story = { render: () => <Demo open />, globals: { mode: "dark" } };
export const RTL: Story = { render: () => <Demo open />, globals: { locale: "ar" } };
