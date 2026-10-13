"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

function diffParts(target: number, now: number) {
  let d = Math.max(0, target - now);
  const days = Math.floor(d / 86_400_000);
  d -= days * 86_400_000;
  const hours = Math.floor(d / 3_600_000);
  d -= hours * 3_600_000;
  const minutes = Math.floor(d / 60_000);
  d -= minutes * 60_000;
  const seconds = Math.floor(d / 1_000);
  return { days, hours, minutes, seconds, isPast: target - now <= 0 };
}

export function CountdownClock({
  target,
  label,
  ctaText,
  ctaHref,
  className,
}: {
  target: string; // ISO date
  label?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}) {
  const [parts, setParts] = useState(() => diffParts(new Date(target).getTime(), Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setParts(diffParts(new Date(target).getTime(), Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: Array<[string, number]> = [
    ["Days", parts.days],
    ["Hrs", parts.hours],
    ["Min", parts.minutes],
    ["Sec", parts.seconds],
  ];

  return (
    <div
      className={cn(
        "glass-strong flex flex-col gap-3 rounded-xl border border-[var(--neon)]/30 p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {label ?? "Mission unlocks in"}
        </div>
        <span className="font-mono text-[0.65rem] text-muted-foreground">IST · +05:30</span>
      </div>
      {parts.isPast ? (
        <div className="font-mono text-sm text-[var(--neon-amber)]">
          ⚠ Mission window is live or has concluded.
        </div>
      ) : (
        <div
          className="grid grid-cols-4 gap-2"
          role="timer"
          aria-label={`${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds remaining`}
        >
          {cells.map(([lbl, val]) => (
            <div
              key={lbl}
              className="flex flex-col items-center justify-center rounded-md border border-white/5 bg-black/40 px-2 py-2"
            >
              <span className="font-mono text-xl font-bold tabular-nums text-foreground">
                {String(val).padStart(2, "0")}
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                {lbl}
              </span>
            </div>
          ))}
        </div>
      )}
      {ctaText && ctaHref && (
        <a
          href={ctaHref}
          className="group inline-flex items-center gap-1.5 self-start font-mono text-xs text-[var(--neon)] hover:underline"
        >
          {ctaText}
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </a>
      )}
    </div>
  );
}
