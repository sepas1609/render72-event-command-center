"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ACCENTS: Record<string, string> = {
  neon: "text-[var(--neon)] border-[var(--neon)]/30 bg-[var(--neon)]/5",
  cyan: "text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5",
  amber: "text-[var(--neon-amber)] border-[var(--neon-amber)]/30 bg-[var(--neon-amber)]/5",
  violet: "text-[var(--neon-violet)] border-[var(--neon-violet)]/30 bg-[var(--neon-violet)]/5",
  rose: "text-[var(--neon-rose)] border-[var(--neon-rose)]/30 bg-[var(--neon-rose)]/5",
};

/**
 * Animated stat tile with a subtle count-up for numeric values.
 * Skips animation if prefers-reduced-motion is set.
 */
export function LiveStat({
  icon,
  label,
  value,
  accent = "neon",
  suffix,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: keyof typeof ACCENTS | string;
  suffix?: string;
}) {
  const isNumeric = typeof value === "number";
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 18 });
  const display = useTransform(spring, (x) => Math.round(x).toString());

  useEffect(() => {
    if (!isNumeric) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      mv.set(value);
      return;
    }
    const id = setTimeout(() => mv.set(value as number), 120);
    return () => clearTimeout(id);
  }, [value, isNumeric, mv]);

  return (
    <div
      className={cn(
        "glass relative flex flex-col gap-1 rounded-lg border px-3 py-2.5 transition-colors",
        ACCENTS[accent] ?? ACCENTS.neon,
      )}
    >
      <div className="flex items-center gap-1.5">
        <span aria-hidden>{icon}</span>
        <span className="font-mono text-[0.65rem] uppercase tracking-widest opacity-80">
          {label}
        </span>
      </div>
      <div className="font-mono text-lg font-semibold leading-none">
        {isNumeric ? (
          <>
            <motion.span>{display}</motion.span>
            {suffix ?? ""}
          </>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
