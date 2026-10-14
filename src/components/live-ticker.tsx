"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Activity, Target, Zap } from "lucide-react";
import type { EventSummary } from "@/lib/types";
import { colorForStatus, formatIstDate } from "@/lib/utils";

/**
 * Infinite-ticker marquee. Items are duplicated so the loop is seamless.
 * Pauses on hover and honors prefers-reduced-motion.
 */
export function LiveTicker({ events }: { events: EventSummary[] }) {
  const items = useMemo(
    () =>
      events.slice(0, 15).map((ev) => {
        const status = colorForStatus(ev.event_status);
        const date = formatIstDate(ev.schedule_summary.start_date + "T00:00:00+05:30", {
          day: "2-digit",
          month: "short",
        });
        const seatsLeft = ev.total_seats - ev.seats_filled;
        return {
          id: ev.id,
          name: ev.name,
          date,
          status,
          seatsLeft,
          category: ev.category,
        };
      }),
    [events],
  );

  const doubled = [...items, ...items];

  return (
    <div
      className="relative z-30 border-b border-white/10 bg-[#060811]/90 backdrop-blur-md"
      role="region"
      aria-label="Live campus event signals ticker"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--neon)]/40 bg-[var(--neon)]/15 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-widest text-[var(--neon)]">
          <Activity className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
          <span>Telemetry</span>
        </div>

        <div className="group relative flex flex-1 overflow-hidden">
          <div
            className="ticker-scroll flex shrink-0 items-center gap-8 whitespace-nowrap group-hover:[animation-play-state:paused]"
            aria-hidden="false"
          >
            {doubled.map((it, idx) => (
              <Link
                key={`${it.id}-${idx}`}
                href={`/events/${it.id}`}
                prefetch={false}
                className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted-foreground hover:text-foreground transition-colors"
              >
                <Target className="h-3 w-3 text-[var(--neon-cyan)]" aria-hidden="true" />
                <span className="text-foreground/90 font-medium">{it.name}</span>
                <span className="text-[var(--neon-amber)] text-[0.68rem]">{it.category}</span>
                <span className="text-muted-foreground/60">{it.date}</span>
                <span className="text-emerald-400 font-semibold">{it.seatsLeft} seats left</span>
                <span aria-hidden="true" className="text-white/20 ml-2">
                  {"//"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 text-xs font-mono text-muted-foreground sm:flex">
          <span className="flex items-center gap-1 text-[var(--neon-rose)]">
            <Zap className="h-3 w-3" aria-hidden="true" />
            <span>30 Live Nodes</span>
          </span>
        </div>
      </div>
    </div>
  );
}
