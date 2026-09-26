"use client";
import { ClaimBusiness, LeadForm } from "@unified-ui/react/lead-form";

export function Contact() {
  return <LeadForm className="max-w-lg" onSubmit={() => new Promise((r) => setTimeout(r, 800))} labels={{ message: "Describe the job" }} />;
}

export function Claim() {
  return <ClaimBusiness businessName="Café Atlas" href="#claim" className="max-w-lg" />;
}
