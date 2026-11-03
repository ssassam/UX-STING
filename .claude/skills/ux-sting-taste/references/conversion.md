# Conversion pages — one offer, one audience, one action

For landing pages, product launches, pricing, waitlists, sign-up and lead-generation pages. Art direction decides how the page **looks**; this file decides what it **says** and in which order. A homepage serves several intents; a landing page wins one:

> **one offer → one audience → one primary action.**

Adapted from the MIT-licensed [ai-design-skills](https://github.com/elayadesign/ai-design-skills) `landing-page-design` skill (see THIRD_PARTY_NOTICES.md). Its fixed visual rules (one typeface, no gradients, fixed icon sets) are deliberately left out: in UX-STING the theme and the chosen direction set the look.

## 1. Intake → add to `brief.md`

Ask only for what is missing, in **one** batch. If nobody can answer, assume, write the assumption in one line, and continue.

| Group | Questions |
| --- | --- |
| Purpose | The ONE primary action (trial, demo, buy, book, waitlist, download)? What exactly do they get? What counts as a conversion? |
| Audience | Who is it for? What problem are they solving? The top three objections (why they do not act today)? |
| Traffic | Where do visitors come from (ads, search, social, email) and what do they already know when they land? |
| Proof | Real logos, testimonials, numbers, case studies, screenshots, demo video; guarantee, refund and cancellation terms. |

Proof that the client does not supply does not exist. Never invent it: see "Facts" in `anti-slop.md`.

## 2. Pick a page type, and say why

| Type | Use when |
| --- | --- |
| **A. Hero + argument** | The offer is clear from one picture of the product or place. The common case. |
| **B. Long-form story** | Visitors must be educated or are skeptical (new category, high price). |
| **C. Minimal conversion** | High-intent traffic (email to known customers) or a small offer: download, waitlist, RSVP. Hero, proof, action. |
| **D. Comparison** | Search intent is "X vs Y", "alternative to", "best for". Usually indexed, usually a table. |

## 3. The argument, in order

The order is an argument, not a template. Keep the jobs; let the direction's layout device decide the form (an index, a ledger, a split, a full-bleed photograph), never "three cards per section".

**First screen (required)**
1. Headline: the outcome, for whom.
2. Subheadline: how, with one specific.
3. Primary action: verb + what they get ("Book a table", "Start the 14-day trial"). One. No competing action above the fold.
4. One proof signal, next to the claim it supports: a real number, a short real quote, a logo strip.
5. A picture that does work: the product, the place, the process (see `images.md`).

**The argument**
6. Problem → solution, once.
7. Three to five benefits: what it means for them, not what it does.
8. How it works, in three steps.
9. Proof: testimonials or one case study, each beside the claim it proves.

**Objections and close**
10. FAQ, six to twelve real questions (`Accordion`). For high-friction offers, move it up.
11. Risk reversal: free trial, cancel anytime, refund, no card. At least one, only if true.
12. The final action, identical to the first.

## 4. Rules

- **Match the source.** Ad traffic: mirror the ad's headline and promise in the hero.
- **Specific beats vague.** Not "Save time and streamline", but "Cut weekly reporting from 4 hours to 15 minutes", if it is true.
- **Benefit first, then the proof:** **Faster iteration**: three layout variants in one click.
- **Headline shapes** to start from (then bend toward `unique.md`): "{Outcome} without {pain}" · "The {category} for {audience}" · "{Result} in {time}".
- **Action copy** is a verb + object. Never "Learn more", "Submit", "Get started" everywhere.
- **Messages** are calm and specific: "Booking sent to Dana", "Upload failed: the file is over 20 MB."

## 5. Index or not

- **noindex** ad-only campaign pages and time-bound offers.
- **index** evergreen offers whose promise matches search intent: a real `<title>` and meta description, links from the home and feature pages, the FAQ as plain question-and-answer text. Do not count on FAQ rich results (Google limits them to a few site types); the plain Q&A still helps answer engines.
- `ux-sting qa` reports missing description, social tags and favicon as `ship:*` findings.

## 6. Pitfalls

Several CTAs above the fold · a vague value proposition · a long feature list with no outcomes · proof buried at the bottom · a mobile layout that hides the action · no clear next step.
