"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  Cpu,
  Gauge,
  Lock,
  Radio,
  Target,
  Users,
} from "lucide-react";
import { MatrixRain } from "@/components/matrix-rain";
import { BootTerminal } from "@/components/boot-terminal";
import { LiveStat } from "@/components/live-stat";
import { CountdownClock } from "@/components/countdown";
import type { EventSummary } from "@/lib/types";

export function Hero({
  primaryEvent,
  totalEvents,
  activeEvents,
}: {
  primaryEvent: EventSummary | null;
  totalEvents: number;
  activeEvents: number;
}) {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-24 sm:pt-28"
    >
      <div className="absolute inset-0 -z-10">
        <MatrixRain className="h-full w-full opacity-[0.18]" fps={12} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.78 0.18 152 / 18%), transparent 50%), radial-gradient(circle at 75% 45%, oklch(0.82 0.16 195 / 18%), transparent 55%)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pb-20">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--neon)]/40 bg-[var(--neon)]/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--neon)]" />
            </span>
            Live · Render72 Events API · Open CORS
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="mt-5 font-mono text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            aria-label="FlagHorizon, Campus Capture the Flag"
          >
            <span
              className="glitch-text neon-text"
              data-text="FlagHorizon"
              aria-hidden="true"
            >
              FlagHorizon
            </span>
            <span className="block text-foreground/80">
              Campus Capture the Flag
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            A jeopardy-style security arena where student teams trace clues across web security,
            forensics, cryptography and reverse engineering in an isolated sandbox. This is the
            command center — live telemetry, defense map, dynamic scoring, and the full Render72
            events board in one terminal-grade experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a
              href="#command-center"
              className="group inline-flex items-center gap-2 rounded-md bg-[var(--neon)] px-5 py-2.5 font-mono text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:shadow-[0_0_36px_oklch(0.82_0.2_152/45%)]"
            >
              <Radio className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              Engage Command Center
            </a>
            <a
              href="#missions"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-sm font-medium text-foreground transition-colors hover:bg-white/10"
            >
              <Target className="h-4 w-4" aria-hidden />
              Browse {totalEvents} Ops
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <LiveStat
              icon={<Cpu className="h-4 w-4" aria-hidden />}
              label="Live Ops"
              value={String(activeEvents)}
              accent="neon"
            />
            <LiveStat
              icon={<Users className="h-4 w-4" aria-hidden />}
              label="Team Size"
              value={
                primaryEvent
                  ? `${primaryEvent.min_teamsize}–${primaryEvent.max_teamsize}`
                  : "2–4"
              }
              accent="cyan"
            />
            <LiveStat
              icon={<Gauge className="h-4 w-4" aria-hidden />}
              label="Duration"
              value={
                primaryEvent ? "6h round" : "—"
              }
              accent="amber"
            />
            <LiveStat
              icon={<Lock className="h-4 w-4" aria-hidden />}
              label="Sandbox"
              value="Isolated"
              accent="violet"
            />
          </motion.div>

          {primaryEvent && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.25 }}
              className="mt-6"
            >
              <CountdownClock
                target={primaryEvent.schedule_summary.start_date + "T" + primaryEvent.schedule_summary.start_time + ":00+05:30"}
                label="Mission unlocks in"
                ctaText="View mission briefing"
                ctaHref="#missions"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center gap-2 font-mono text-xs text-muted-foreground"
          >
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
            <span>scroll to deploy the operator console</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="lg:col-span-5"
        >
          <div className="relative">
            <div className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br from-[var(--neon)]/20 via-transparent to-[var(--neon-cyan)]/20 blur-2xl" aria-hidden />
            <BootTerminal />
            <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-black/30 px-3 py-2">
              <div className="flex items-center gap-2 font-mono text-[0.7rem] text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-[var(--neon)]" aria-hidden />
                subsystems nominal · scope verified
              </div>
              <div className="flex items-center gap-1 font-mono text-[0.7rem] text-[var(--neon)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neon)]" aria-hidden />
                LIVE
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
