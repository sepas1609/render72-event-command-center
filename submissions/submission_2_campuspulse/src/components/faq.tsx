"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What is FlagHorizon?",
    a: "FlagHorizon is a jeopardy-style Capture the Flag (CTF) command center built on top of the public Render72 campus events API. The flagship event — FlagHorizon: Campus Capture the Flag — challenges student teams to recover hidden flags across web security, forensics, cryptography and reverse engineering in an isolated, authorized sandbox. This site turns the full events payload into a live operator console with telemetry, a defense map, dynamic scoring simulation, and complete mission briefings.",
  },
  {
    q: "Is this connected to the real Render72 API?",
    a: "Yes — every mission on the board is fetched live from https://render72.pages.dev/api/test/events. The list endpoint powers the grid, defense map, and hero stats; opening a card calls /api/test/events/{id} for the full briefing, including prizes, schedules, FAQs, coordinators, and rules. The API is public, has open CORS, and requires no authentication.",
  },
  {
    q: "Are the scoreboard and telemetry real?",
    a: "They are deterministic simulations derived from the events payload — we never invent registration counts, prices, or seat figures. The challenge board, scoreboard seeds, and telemetry baseline are computed by hashing the real event IDs, so the initial paint is stable across renders. A low-frequency tick perturbs scores and re-ranks teams to demonstrate dynamic scoring in action, without claiming to be a live competition feed.",
  },
  {
    q: "Why a CTF theme for a campus events platform?",
    a: "Capture the Flag is the canonical format for cybersecurity education: it is hands-on, team-driven, and rewards curiosity over guesswork. Building a command center around the Render72 events payload lets us frame every campus event — coding rounds, robotics arenas, sustainability workshops, photo walks — as a coordinated mission, which makes the underlying data feel alive, explorable, and genuinely engaging for judges and prospective participants alike.",
  },
  {
    q: "How does the sandbox flag submission work?",
    a: "The Sandbox section near the bottom of the page lets you submit flags against four simulated challenge families. The expected flags are baked into the page source for transparency — try inspecting elements or using the hint button. Submissions are validated client-side only; no network call is made. Accepted submissions turn green and play a confirmation cue (if you've enabled audio); rejected ones turn red and log to the terminal history.",
  },
  {
    q: "What about accessibility and performance?",
    a: "Every interactive element is keyboard accessible with visible focus rings. The interface honors prefers-reduced-motion by skipping the matrix rain, typewriter effect, and animated rank transitions. Images use next/image with explicit width/height, lazy loading, and AVIF/WebP formats. The page is semantic HTML5 (header, nav, main, section, article, footer) with ARIA labels, alt text, and JSON-LD structured data so Lighthouse scores stay in the green.",
  },
  {
    q: "Can I deploy this to Render?",
    a: "Yes — the project ships with a render.yaml that provisions a Node web service running the Next.js standalone output. Set the build command to npm run build and the start command to npm run start, and Render will serve the production bundle. There are no environment variables required to read the public API; everything works out of the box.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative scroll-mt-24 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]">
          <span aria-hidden>{"// frequently asked"}</span>
        </div>
        <h2
          id="faq-title"
          className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Operator Q&amp;A
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Quick reference for judges, mentors and prospective participants. If a question
          isn&apos;t answered here, the coordinators on every mission briefing card include a
          mailto link for direct follow-up.
        </p>
        <Accordion type="single" collapsible className="mt-6">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-white/5"
            >
              <AccordionTrigger className="font-mono text-sm text-foreground hover:text-[var(--neon)] hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
