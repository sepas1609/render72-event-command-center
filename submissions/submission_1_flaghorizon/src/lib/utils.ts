import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const IST_TZ = "Asia/Kolkata";

/** Format an ISO date string (with IST offset) as a readable local date. */
export function formatIstDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TZ,
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...opts,
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatIstTime(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TZ,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatINR(amount: number): string {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function relativeTimeFromNow(iso: string): string {
  try {
    const target = new Date(iso).getTime();
    const now = Date.now();
    const diff = target - now;
    const sec = Math.round(diff / 1000);
    const min = Math.round(sec / 60);
    const hr = Math.round(min / 60);
    const day = Math.round(hr / 24);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (Math.abs(day) >= 1) return rtf.format(day, "day");
    if (Math.abs(hr) >= 1) return rtf.format(hr, "hour");
    if (Math.abs(min) >= 1) return rtf.format(min, "minute");
    return rtf.format(sec, "second");
  } catch {
    return iso;
  }
}

/** Split a long description into paragraphs separated by "\n\n". */
export function splitParagraphs(s: string): string[] {
  return s
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Distance between two hex colors (naive) — used for badge pairing. */
export function colorForStatus(
  status: "ACTIVE" | "COMPLETED" | "CLOSED",
): { fg: string; bg: string; label: string } {
  switch (status) {
    case "ACTIVE":
      return { fg: "text-[var(--neon)]", bg: "bg-[var(--neon)]/10", label: "Live" };
    case "COMPLETED":
      return { fg: "text-[var(--neon-cyan)]", bg: "bg-[var(--neon-cyan)]/10", label: "Archived" };
    case "CLOSED":
      return { fg: "text-[var(--neon-rose)]", bg: "bg-[var(--neon-rose)]/10", label: "Locked" };
  }
}

export function colorForRegistration(
  status: "OPEN" | "CLOSED" | "SOLD_OUT",
): { fg: string; bg: string; label: string } {
  switch (status) {
    case "OPEN":
      return { fg: "text-[var(--neon)]", bg: "bg-[var(--neon)]/10", label: "Open" };
    case "CLOSED":
      return { fg: "text-[var(--neon-amber)]", bg: "bg-[var(--neon-amber)]/10", label: "Closed" };
    case "SOLD_OUT":
      return { fg: "text-[var(--neon-rose)]", bg: "bg-[var(--neon-rose)]/10", label: "Sold Out" };
  }
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
