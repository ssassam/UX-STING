import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion.js";

const meta = { title: "Data display/Accordion", component: Accordion } satisfies Meta<
  typeof Accordion
>;
export default meta;
type Story = StoryObj;

const Demo = ({ variant }: { variant: "default" | "separated" | "bordered" }) => (
  <Accordion type="single" collapsible defaultValue="1" variant={variant} className="max-w-lg">
    <AccordionItem value="1">
      <AccordionTrigger>Is parking available?</AccordionTrigger>
      <AccordionContent>Yes, free parking for guests behind the building.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="2">
      <AccordionTrigger>
        A much longer question that wraps onto multiple lines on small screens to test layout?
      </AccordionTrigger>
      <AccordionContent>Answer.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="3" disabled>
      <AccordionTrigger>Disabled item</AccordionTrigger>
      <AccordionContent>Hidden</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const Variants: Story = {
  render: () => (
    <div className="grid gap-8">
      <Demo variant="default" />
      <Demo variant="separated" />
      <Demo variant="bordered" />
    </div>
  ),
};
export const DarkMode: Story = { ...Variants, globals: { mode: "dark" } };
