"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@unified-ui/react/accordion";

const faq = [
  ["Is parking available?", "Yes — free parking for guests behind the building."],
  ["Do you accept reservations?", "Reservations are recommended on weekends."],
  ["Are pets allowed?", "Well-behaved pets are welcome on the terrace."],
];

function Faq({ variant }: { variant: "default" | "separated" | "bordered" }) {
  return (
    <Accordion type="single" collapsible defaultValue="q0" variant={variant} className="max-w-lg">
      {faq.map(([q, a], i) => (
        <AccordionItem key={q} value={`q${i}`}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent>{a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function Default() {
  return <Faq variant="default" />;
}

export function Separated() {
  return <Faq variant="separated" />;
}

export function Bordered() {
  return <Faq variant="bordered" />;
}
