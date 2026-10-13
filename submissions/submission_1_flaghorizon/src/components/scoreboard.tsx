"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Medal, Trophy, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { ScoreboardRow } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Animated simulated scoreboard. Initial order is derived deterministically
 * from the events payload (see deriveScoreboard). A 4s tick slightly perturbs
 * each team's score and re-ranks them; AnimatePresence + layout transitions
 * make the rank changes feel live. Honors prefers-reduced-motion.
 */
export function Scoreboard({
  initialRows,
}: {
  initialRows: ScoreboardRow[];
}) {
  const [rows, setRows] = useState<ScoreboardRow[]>(initialRows);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => {
      setRows((prev) => {
        const next = prev.map((r) => {
          const gain = Math.round((Math.random() - 0.3) * 280);
          return {
            ...r,
            score: Math.max(0, r.score + gain),
            delta: gain,
            solves: r.solves + (gain > 0 ? 1 : 0),
            trend: (gain > 20 ? "up" : gain < -20 ? "down" : "flat") as "up" | "down" | "flat",
            lastSubmission: Date.now(),
          };
        });
        const sorted = [...next].sort((a, b) => b.score - a.score);
        return sorted.map((r, idx) => ({ ...r, rank: idx + 1 }));
      });
      setTick((t) => t + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const top = rows.slice(0, 12);

  return (
    <section
      id="scoreboard"
      aria-labelledby="sb-title"
      className="relative scroll-mt-24 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]">
              <Trophy className="h-4 w-4" aria-hidden /> {"// live leaderboard"}
            </div>
            <h2
              id="sb-title"
              className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              Scoreboard
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              A simulated live leaderboard. Initial seeds are derived deterministically from the
              events payload so the order is stable across renders; a low-frequency tick perturbs
              scores and re-ranks teams to demonstrate dynamic scoring in action.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[0.7rem] text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-[var(--neon-amber)]" aria-hidden />
            <span>
              tick <span className="text-[var(--neon)] tabular-nums">{String(tick).padStart(4, "0")}</span>
            </span>
            <span className="text-[var(--neon)]">·</span>
            <span>{rows.length} teams</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {/* Podium */}
          <div className="md:col-span-1">
            <Podium rows={rows.slice(0, 3)} />
          </div>
          {/* Table */}
          <div className="md:col-span-2">
            <div className="glass overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[2.5rem_1fr_4rem_5rem_5rem] items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                <span>rank</span>
                <span>team</span>
                <span className="text-right">solves</span>
                <span className="text-right">delta</span>
                <span className="text-right">score</span>
              </div>
              <ul className="divide-y divide-white/5">
                <AnimatePresence initial={false}>
                  {top.map((r) => (
                    <motion.li
                      key={r.handle}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        layout: { type: "spring", stiffness: 260, damping: 28 },
                        duration: 0.2,
                      }}
                      className="grid grid-cols-[2.5rem_1fr_4rem_5rem_5rem] items-center gap-2 px-4 py-2.5"
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold",
                          r.rank === 1 && "bg-[var(--neon)]/20 text-[var(--neon)]",
                          r.rank === 2 && "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]",
                          r.rank === 3 && "bg-[var(--neon-amber)]/20 text-[var(--neon-amber)]",
                          r.rank > 3 && "bg-white/5 text-muted-foreground",
                        )}
                      >
                        {r.rank}
                      </span>
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-sm text-foreground">{r.handle}</span>
                        <TrendBadge trend={r.trend} />
                      </div>
                      <span className="text-right font-mono text-sm text-muted-foreground tabular-nums">
                        {r.solves}
                      </span>
                      <span
                        className={cn(
                          "flex items-center justify-end gap-1 text-right font-mono text-sm tabular-nums",
                          r.delta > 0 && "text-[var(--neon)]",
                          r.delta < 0 && "text-[var(--neon-rose)]",
                          r.delta === 0 && "text-muted-foreground",
                        )}
                      >
                        {r.delta > 0 ? "+" : r.delta < 0 ? "−" : ""}
                        {Math.abs(r.delta)}
                      </span>
                      <span className="text-right font-mono text-sm font-semibold text-foreground tabular-nums">
                        {r.score.toLocaleString()}
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Podium({ rows }: { rows: ScoreboardRow[] }) {
  const [first, second, third] = rows;
  const cards = [
    { row: second, height: "h-28", icon: <Medal className="h-4 w-4" aria-hidden />, color: "text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40", label: "2nd" },
    { row: first, height: "h-36", icon: <Trophy className="h-5 w-5" aria-hidden />, color: "text-[var(--neon)] border-[var(--neon)]/40", label: "1st" },
    { row: third, height: "h-24", icon: <Medal className="h-4 w-4" aria-hidden />, color: "text-[var(--neon-amber)] border-[var(--neon-amber)]/40", label: "3rd" },
  ].filter((c) => c.row);
  return (
    <div className="glass flex h-full items-end justify-center gap-2 rounded-2xl border border-white/10 p-4 sm:gap-3">
      {cards.map((c) => (
        <motion.div
          key={c.label}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className={cn(
            "flex w-full flex-col items-center justify-end rounded-lg border bg-black/30 px-3 py-3 text-center",
            c.color,
            c.height,
          )}
        >
          <div className="mb-1 flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-widest">
            {c.icon} {c.label}
          </div>
          <div className="font-mono text-sm font-semibold text-foreground">
            {c.row?.handle}
          </div>
          <div className="mt-1 font-mono text-lg font-bold tabular-nums text-foreground">
            {c.row?.score.toLocaleString()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TrendBadge({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center text-[var(--neon)]">
        <TrendingUp className="h-3 w-3" aria-hidden />
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center text-[var(--neon-rose)]">
        <TrendingDown className="h-3 w-3" aria-hidden />
      </span>
    );
  return (
    <span className="inline-flex items-center text-muted-foreground">
      <Minus className="h-3 w-3" aria-hidden />
    </span>
  );
}
