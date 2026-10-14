"use client";

import { Github, Heart, Radio, ShieldHalf, Twitter } from "lucide-react";
import { useCtfStore } from "@/lib/ctf-store";
import { getActiveEdition } from "@/lib/submission-themes";

export function Footer() {
  const activeEdition = useCtfStore((s) => s.activeEdition);
  const edition = getActiveEdition(activeEdition);

  return (
    <footer className="relative mt-auto border-t border-white/5 bg-black/40">
      <div className="terminal-grid-bg absolute inset-0 -z-10 opacity-20" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--neon)]/15 text-[var(--neon)] neon-border">
                <ShieldHalf className="h-5 w-5" aria-hidden />
              </span>
              <div className="leading-tight">
                <p className="font-mono text-sm font-semibold text-foreground">
                  {edition.name}
                </p>
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-slate-300">
                  {edition.tagline}
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-md text-sm text-slate-300">
              {edition.heroSubheadline} Built on the public Render72 Events API with multi-track itinerary planning, interactive ateliers, and 100% zero-crash resilience.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://render72.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <Radio className="h-3.5 w-3.5" aria-hidden /> Render72 API
              </a>
              <a
                href="#top"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                back to top
              </a>
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--neon)]">
              operators
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-300">
              <li>
                <a
                  href="#command-center"
                  className="inline-flex items-center py-1.5 hover:text-white transition-colors"
                >
                  Command Center
                </a>
              </li>
              <li>
                <a
                  href="#scoreboard"
                  className="inline-flex items-center py-1.5 hover:text-white transition-colors"
                >
                  Live Scoreboard
                </a>
              </li>
              <li>
                <a
                  href="#missions"
                  className="inline-flex items-center py-1.5 hover:text-white transition-colors"
                >
                  Mission Board
                </a>
              </li>
              <li>
                <a
                  href="#sandbox"
                  className="inline-flex items-center py-1.5 hover:text-white transition-colors"
                >
                  Flag Sandbox
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="inline-flex items-center py-1.5 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--neon)]">
              stack
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Next.js 16 · App Router</li>
              <li>TypeScript 5 strict</li>
              <li>Tailwind CSS 4 · shadcn/ui</li>
              <li>Recharts · Framer Motion</li>
              <li>Render deployment ready</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-5 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.7rem] text-muted-foreground">
            © {new Date().getFullYear()} FlagHorizon · built for Render72 ·
            <span className="ml-1 text-[var(--neon)]">scope verified · authorized targets only</span>
          </p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1.5 font-mono text-[0.7rem]">
              crafted with
              <Heart className="h-3 w-3 text-[var(--neon-rose)]" aria-hidden />
              for student teams
            </span>
            <span aria-hidden className="h-3 w-px bg-white/10" />
            <a
              href="https://render72.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Render72 on the web"
              className="hover:text-foreground"
            >
              <Twitter className="h-3.5 w-3.5" aria-hidden />
            </a>
            <a
              href="https://render72.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source code"
              className="hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
