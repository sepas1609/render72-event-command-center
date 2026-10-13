"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import {
  Activity,
  Crosshair,
  Lock,
  ShieldAlert,
  Target,
  Zap,
} from "lucide-react";
import type {
  ChallengeNode,
  EventSummary,
  ScoreboardRow,
  TelemetryPoint,
} from "@/lib/types";
import { deriveChallenges, deriveTelemetry } from "@/lib/api";
import { ErrorBoundary } from "@/components/error-boundary";
import { LiveStat } from "@/components/live-stat";
import { cn } from "@/lib/utils";
import { useCtfStore } from "@/lib/ctf-store";

function useCtfStoreBriefing(id: string) {
  const openBriefing = useCtfStore((s) => s.openBriefing);
  return () => openBriefing(id);
}

function ArrowRightSmall({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const CAT_COLORS: Record<string, string> = {
  "Web Security": "var(--neon)",
  "Digital Forensics": "var(--neon-cyan)",
  Cryptography: "var(--neon-violet)",
  "Reverse Engineering": "var(--neon-amber)",
  Algorithms: "var(--neon-rose)",
  Hardware: "var(--neon-cyan)",
  "Open Intel": "var(--neon)",
};

const DIFF_BADGE: Record<ChallengeNode["difficulty"], string> = {
  Easy: "text-[var(--neon)] border-[var(--neon)]/40 bg-[var(--neon)]/10",
  Medium: "text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10",
  Hard: "text-[var(--neon-amber)] border-[var(--neon-amber)]/40 bg-[var(--neon-amber)]/10",
  Insane: "text-[var(--neon-rose)] border-[var(--neon-rose)]/40 bg-[var(--neon-rose)]/10",
};

export function CommandCenter({
  events,
  scoreboard,
}: {
  events: EventSummary[];
  scoreboard: ScoreboardRow[];
}) {
  const baseTelemetry = useMemo(() => deriveTelemetry(events), [events]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>(baseTelemetry);

  // Live "feed" — appends a new telemetry point every 3s, derived from the
  // last point. This is a simulation, but stays stable across renders because
  // the seed series is deterministic.
  useEffect(() => {
    if (!baseTelemetry.length) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => {
      setTelemetry((prev) => {
        const last = prev[prev.length - 1] ?? { t: 0, attacks: 0, solves: 0, hints: 0 };
        const next: TelemetryPoint = {
          t: last.t + 1,
          attacks: last.attacks + Math.round(6 + Math.random() * 32 + Math.sin(last.t / 3) * 10),
          solves: last.solves + Math.round(1 + Math.random() * 7),
          hints: last.hints + Math.round(1 + Math.random() * 4),
        };
        return [...prev.slice(-23), next];
      });
    }, 3000);
    return () => clearInterval(id);
  }, [baseTelemetry]);

  const challenges = useMemo(() => deriveChallenges(events), [events]);
  const recent = telemetry.slice(-12);

  const totals = useMemo(() => {
    const totalSolves = challenges.reduce((a, c) => a + c.solves, 0);
    const totalAttempts = telemetry.reduce((a, t) => a + t.attacks, 0);
    const captured = challenges.filter((c) => c.status === "captured").length;
    const active = challenges.filter((c) => c.status === "active").length;
    return { totalSolves, totalAttempts, captured, active };
  }, [challenges, telemetry]);

  return (
    <section
      id="command-center"
      aria-labelledby="cc-title"
      className="relative scroll-mt-24 py-16 sm:py-24"
    >
      <div className="terminal-grid-bg absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="// operator console"
          icon={<Crosshair className="h-4 w-4" aria-hidden />}
          title="Command Center"
          subtitle="Live telemetry from the FlagHorizon sandbox. Attacks, solves and hint requests are aggregated from the events payload — a deterministic simulation grounded in real Render72 data."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LiveStat icon={<Zap className="h-4 w-4" />} label="Attempts Blocked" value={totals.totalAttempts} accent="rose" />
          <LiveStat icon={<Target className="h-4 w-4" />} label="Flags Captured" value={totals.totalSolves} accent="neon" />
          <LiveStat icon={<Activity className="h-4 w-4" />} label="Active Ops" value={totals.active} accent="cyan" />
          <LiveStat icon={<Lock className="h-4 w-4" />} label="Captured Zones" value={totals.captured} accent="violet" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Telemetry chart */}
          <ErrorBoundary label="telemetry" >
            <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-4 lg:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">
                    Live Telemetry
                  </h3>
                  <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                    attacks vs solves · 3s refresh
                  </p>
                </div>
                <div className="flex items-center gap-3 font-mono text-[0.7rem]">
                  <span className="flex items-center gap-1.5 text-[var(--neon-rose)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--neon-rose)]" aria-hidden /> attacks
                  </span>
                  <span className="flex items-center gap-1.5 text-[var(--neon)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--neon)]" aria-hidden /> solves
                  </span>
                  <span className="flex items-center gap-1.5 text-[var(--neon-amber)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--neon-amber)]" aria-hidden /> hints
                  </span>
                </div>
              </div>
              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={recent} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="g-attacks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--neon-rose)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--neon-rose)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g-solves" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--neon)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(1 0 0 / 8%)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="t"
                      stroke="oklch(0.66 0.01 240)"
                      tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `t${String(v)}`}
                    />
                    <YAxis
                      stroke="oklch(0.66 0.01 240)"
                      tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <Tooltip
                      cursor={{ stroke: "oklch(1 0 0 / 15%)", strokeDasharray: "3 3" }}
                      contentStyle={{
                        background: "oklch(0.08 0.014 240 / 92%)",
                        border: "1px solid oklch(1 0 0 / 12%)",
                        borderRadius: 8,
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 12,
                        color: "oklch(0.95 0.005 240)",
                      }}
                      labelStyle={{ color: "oklch(0.66 0.01 240)" }}
                      labelFormatter={(v) => `tick t${v}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="attacks"
                      stroke="var(--neon-rose)"
                      strokeWidth={2}
                      fill="url(#g-attacks)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="solves"
                      stroke="var(--neon)"
                      strokeWidth={2}
                      fill="url(#g-solves)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recent} margin={{ top: 0, right: 4, bottom: 0, left: -20 }}>
                    <XAxis dataKey="t" hide />
                    <YAxis
                      stroke="oklch(0.66 0.01 240)"
                      tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.08 0.014 240 / 92%)",
                        border: "1px solid oklch(1 0 0 / 12%)",
                        borderRadius: 8,
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 12,
                        color: "oklch(0.95 0.005 240)",
                      }}
                      labelFormatter={(v) => `tick t${v}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="hints"
                      stroke="var(--neon-amber)"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ErrorBoundary>

          {/* Live ticker / scoreboard top 5 */}
          <ErrorBoundary label="scoreboard-mini">
            <div className="glass flex flex-col gap-3 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-semibold text-foreground">
                  Top Teams
                </h3>
                <span className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--neon)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neon)]" aria-hidden />
                  live
                </span>
              </div>
              <ol className="space-y-1.5">
                {scoreboard.slice(0, 6).map((r) => (
                  <li
                    key={r.handle}
                    className="flex items-center justify-between gap-2 rounded-md border border-white/5 bg-black/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold",
                          r.rank === 1 && "bg-[var(--neon)]/20 text-[var(--neon)]",
                          r.rank === 2 && "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]",
                          r.rank === 3 && "bg-[var(--neon-amber)]/20 text-[var(--neon-amber)]",
                          r.rank > 3 && "bg-white/5 text-muted-foreground",
                        )}
                        aria-hidden
                      >
                        {r.rank}
                      </span>
                      <div className="leading-tight">
                        <div className="font-mono text-sm text-foreground">{r.handle}</div>
                        <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                          {r.solves} solves
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-foreground tabular-nums">
                        {r.score.toLocaleString()}
                      </div>
                      {r.delta !== 0 && (
                        <div
                          className={cn(
                            "font-mono text-[0.65rem]",
                            r.delta > 0 ? "text-[var(--neon)]" : "text-[var(--neon-rose)]",
                          )}
                        >
                          {r.delta > 0 ? "▲" : "▼"} {Math.abs(r.delta)}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              <a
                href="#scoreboard"
                className="mt-auto inline-flex items-center gap-1.5 self-start font-mono text-xs text-[var(--neon)] hover:underline"
              >
                Full leaderboard
                <ArrowRightSmall aria-hidden />
              </a>
            </div>
          </ErrorBoundary>
        </div>

        {/* Defense Map */}
        <ErrorBoundary label="defense-map">
          <div className="glass mt-6 rounded-2xl border border-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[var(--neon)]" aria-hidden />
                <h3 className="font-mono text-sm font-semibold text-foreground">
                  Active Defense Map
                </h3>
              </div>
              <p className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                {challenges.length} ops · 4 zones
              </p>
            </div>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Each cell is a CTF node derived from a Render72 event — category and difficulty come
              from the event&apos;s tags, technical flag, and seat saturation. Captured zones
              correspond to SOLD_OUT or COMPLETED events. Click a node to open the full mission
              briefing in the Missions grid below.
            </p>

            <div
              className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
              role="list"
              aria-label="Defense map challenge nodes"
            >
              {challenges.slice(0, 24).map((c, i) => (
                <DefenseNode key={c.id} node={c} index={i} />
              ))}
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </section>
  );
}

function DefenseNode({ node, index }: { node: ChallengeNode; index: number }) {
  const open = useCtfStoreBriefing(node.id);
  const color = CAT_COLORS[node.category] ?? "var(--neon)";
  return (
    <motion.button
      type="button"
      onClick={() => open()}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.4) }}
      whileHover={{ y: -2 }}
      className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/40 p-2 text-left transition-colors hover:border-[var(--neon)]/40"
      aria-label={`${node.title} — ${node.category} — ${node.difficulty} — ${node.points} points — ${node.solves} solves`}
    >
      <div
        className="absolute inset-0 -z-10 opacity-25 transition-opacity group-hover:opacity-50"
        style={{ background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)` }}
        aria-hidden
      />
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-1">
          <span
            className="font-mono text-[0.6rem] uppercase tracking-widest"
            style={{ color }}
          >
            {node.category.split(" ")[0]}
          </span>
          <span
            className={cn(
              "rounded-sm border px-1 py-px font-mono text-[0.55rem] uppercase tracking-widest",
              DIFF_BADGE[node.difficulty],
            )}
          >
            {node.difficulty}
          </span>
        </div>
        <div className="flex items-end justify-between gap-1">
          <span className="font-mono text-sm font-bold text-foreground">{node.points}</span>
          <span className="font-mono text-[0.6rem] text-muted-foreground">
            {node.solves}/{node.totalTeams}
          </span>
        </div>
      </div>
      {node.status === "captured" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--neon)]">
            ✓ captured
          </span>
        </div>
      )}
      {node.status === "active" && (
        <span className="absolute right-1 top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neon)]" aria-hidden />
      )}
    </motion.button>
  );
}

function SectionHeading({
  eyebrow,
  icon,
  title,
  subtitle,
}: {
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]">
        {icon}
        {eyebrow}
      </div>
      <h2 className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
    </div>
  );
}
