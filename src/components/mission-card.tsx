"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Signal,
  Sparkles,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { EventSummary } from "@/lib/types";
import { useCtfStore } from "@/lib/ctf-store";
import {
  cn,
  colorForRegistration,
  colorForStatus,
  formatINR,
  formatIstDate,
} from "@/lib/utils";

const STATUS_LABEL = {
  ACTIVE: "Live",
  COMPLETED: "Archived",
  CLOSED: "Locked",
} as const;

/**
 * Mission Card — the single event card in the grid. Hover lifts and glows;
 * focus is fully keyboard accessible. Bookmark toggle persists to local
 * storage via the CTF store.
 */
export function MissionCard({
  event,
  onOpen,
  priority = false,
}: {
  event: EventSummary;
  onOpen?: () => void;
  priority?: boolean;
}) {
  const openBriefing = useCtfStore((s) => s.openBriefing);
  const bookmarks = useCtfStore((s) => s.bookmarks);
  const toggleBookmark = useCtfStore((s) => s.toggleBookmark);
  const isBookmarked = bookmarks.includes(event.id);

  const status = colorForStatus(event.event_status);
  const reg = colorForRegistration(event.registration_status);
  const seatsLeft = event.total_seats - event.seats_filled;
  const seatRatio = event.total_seats > 0 ? event.seats_filled / event.total_seats : 0;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition-colors hover:border-[var(--neon)]/40"
    >
      <button
        type="button"
        onClick={() => {
          openBriefing(event.id);
          onOpen?.();
        }}
        className="relative block aspect-[3/2] w-full overflow-hidden"
        aria-label={`Open mission briefing for ${event.name}`}
      >
        <Image
          src={event.cover_image_url}
          alt={event.cover_image_alt ?? `${event.name} cover`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          // when above-the-fold, fetch at high priority
          fetchPriority={priority ? "high" : "auto"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest backdrop-blur",
              status.fg,
              status.bg,
              "border-current/40",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
            {STATUS_LABEL[event.event_status]}
          </span>
          {event.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--neon-amber)]/40 bg-[var(--neon-amber)]/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--neon-amber)] backdrop-blur">
              <Sparkles className="h-2.5 w-2.5" aria-hidden /> featured
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest backdrop-blur",
              reg.fg,
              reg.bg,
              "border-current/40",
            )}
          >
            {event.event_mode === "ONLINE" ? (
              <Wifi className="h-2.5 w-2.5" aria-hidden />
            ) : (
              <WifiOff className="h-2.5 w-2.5" aria-hidden />
            )}
            {event.event_mode}
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--neon)]">
            {event.category}
          </p>
          <h3 className="mt-0.5 line-clamp-2 font-mono text-base font-semibold leading-snug text-foreground">
            {event.name}
          </h3>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">{event.blurb}</p>

        <div className="flex flex-wrap gap-1.5">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground"
            >
              #{tag.toLowerCase().replace(/\s+/g, "-")}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="rounded-sm border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
              +{event.tags.length - 3}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-[var(--neon)]" aria-hidden />
            {formatIstDate(event.schedule_summary.start_date + "T00:00:00+05:30", {
              day: "2-digit",
              month: "short",
            })}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-[var(--neon-cyan)]" aria-hidden />
            {event.schedule_summary.start_time} IST
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3 w-3 text-[var(--neon-amber)]" aria-hidden />
            {event.min_teamsize === event.max_teamsize
              ? `${event.min_teamsize}-person`
              : `${event.min_teamsize}–${event.max_teamsize}`}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-[var(--neon-violet)]" aria-hidden />
            {event.event_mode === "ONLINE" ? "Virtual" : "On Campus"}
          </div>
        </div>

        {/* Seat progress */}
        <div>
          <div className="flex items-center justify-between font-mono text-[0.65rem] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Signal className="h-3 w-3 text-[var(--neon)]" aria-hidden />
              {event.seats_filled}/{event.total_seats} seats
            </span>
            <span className={cn("tabular-nums", seatsLeft <= 5 && "text-[var(--neon-rose)]")}>
              {seatsLeft} left
            </span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, Math.round(seatRatio * 100))}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                seatRatio > 0.9
                  ? "bg-[var(--neon-rose)]"
                  : seatRatio > 0.7
                    ? "bg-[var(--neon-amber)]"
                    : "bg-[var(--neon)]",
              )}
            />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/5 pt-3">
          <div className="font-mono text-sm">
            {event.price === 0 ? (
              <span className="text-[var(--neon)]">FREE</span>
            ) : (
              <span className="text-foreground">{formatINR(event.price)}</span>
            )}
            <span className="ml-1 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              {event.is_per_head ? "/ head" : "/ team"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleBookmark(event.id)}
              aria-pressed={isBookmarked}
              aria-label={isBookmarked ? "Remove from watchlist" : "Add to watchlist"}
              title={isBookmarked ? "Remove from watchlist" : "Add to watchlist"}
              className={cn(
                "rounded-md border p-1.5 transition-colors",
                isBookmarked
                  ? "border-[var(--neon)]/40 bg-[var(--neon)]/10 text-[var(--neon)]"
                  : "border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <Bookmark className="h-3.5 w-3.5" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                openBriefing(event.id);
                onOpen?.();
              }}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--neon)]/10 px-2 py-1.5 font-mono text-[0.68rem] text-[var(--neon)] transition-colors hover:bg-[var(--neon)]/20"
              title="Quick modal preview"
            >
              quick preview
            </button>
            <Link
              href={`/events/${event.id}`}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--neon)] px-2.5 py-1.5 font-mono text-[0.68rem] font-bold text-[var(--primary-foreground)] transition-colors hover:brightness-110"
              title="Open full dedicated event dossier"
            >
              dossier
              <ChevronRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
