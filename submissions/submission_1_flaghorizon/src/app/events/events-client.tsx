"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Filter,
  Grid2x2,
  List,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Wifi,
} from "lucide-react";
import type { EventSummary } from "@/lib/types";
import { cn, colorForStatus, formatINR, formatIstDate } from "@/lib/utils";
import { useAudioCue } from "@/hooks/use-audio-cue";
import { isFeaturedSubmissionEvent } from "@/lib/featured-events";
import { useDebounce } from "@/hooks/use-debounce";

export function EventsMatrixClient({ initialEvents }: { initialEvents: EventSummary[] }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "technical" | "cultural">("all");
  const [modeFilter, setModeFilter] = useState<"all" | "offline" | "online">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "ACTIVE" | "COMPLETED" | "CLOSED">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortKey, setSortKey] = useState<"date" | "seats" | "price" | "team">("date");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const play = useAudioCue();

  const filteredEvents = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const list = initialEvents.filter((ev) => {
      if (featuredOnly && !isFeaturedSubmissionEvent(ev.id)) return false;
      if (categoryFilter === "technical" && !ev.is_technical) return false;
      if (categoryFilter === "cultural" && ev.is_technical) return false;
      if (modeFilter === "offline" && ev.event_mode !== "OFFLINE") return false;
      if (modeFilter === "online" && ev.event_mode !== "ONLINE") return false;
      if (statusFilter !== "all" && ev.event_status !== statusFilter) return false;

      if (q) {
        const hay = `${ev.name} ${ev.blurb} ${ev.category} ${ev.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...list];
    switch (sortKey) {
      case "date":
        sorted.sort(
          (a, b) =>
            new Date(a.schedule_summary.start_date).getTime() -
            new Date(b.schedule_summary.start_date).getTime(),
        );
        break;
      case "seats":
        sorted.sort(
          (a, b) =>
            b.total_seats - b.seats_filled - (a.total_seats - a.seats_filled),
        );
        break;
      case "price":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "team":
        sorted.sort((a, b) => a.max_teamsize - b.max_teamsize);
        break;
    }
    return sorted;
  }, [initialEvents, debouncedSearch, categoryFilter, modeFilter, statusFilter, sortKey, featuredOnly]);

  const activeCount = initialEvents.filter((e) => e.event_status === "ACTIVE").length;
  const technicalCount = initialEvents.filter((e) => e.is_technical).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--neon)]/40 bg-[var(--neon)]/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-widest text-[var(--neon)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
            Full Roster · 30 Campus Signals
          </div>
          <h1 className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Campus Defense Matrix
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Declassified directory of all 30 campus events, competitions, CTF arenas, and workshops.
            Real-time capacity tracking, verified IST schedules, and direct mission briefings.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-muted-foreground">Total:</span>{" "}
            <span className="font-bold text-foreground">{initialEvents.length}</span>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-400">
            <span>Active:</span> <span className="font-bold">{activeCount}</span>
          </div>
          <div className="rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 px-3 py-2 text-[var(--neon-cyan)]">
            <span>Technical:</span> <span className="font-bold">{technicalCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0d1322]/80 p-4 backdrop-blur-xl shadow-xl sm:p-5">
        {/* Top Search & View Switcher */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by keyword, title, tag, or category..."
              className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-[var(--neon)] focus:outline-none focus:ring-1 focus:ring-[var(--neon)]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode & Sort Dropdowns */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => {
                  setViewMode("grid");
                  play("blip");
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors",
                  viewMode === "grid"
                    ? "bg-[var(--neon)]/20 text-[var(--neon)] font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Grid view"
              >
                <Grid2x2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("table");
                  play("blip");
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs transition-colors",
                  viewMode === "table"
                    ? "bg-[var(--neon)]/20 text-[var(--neon)] font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Table view"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Matrix</span>
              </button>
            </div>

            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-xs text-foreground focus:border-[var(--neon)] focus:outline-none"
            >
              <option value="date">Sort: Earliest Date</option>
              <option value="seats">Sort: Most Seats Left</option>
              <option value="price">Sort: Fee (Low to High)</option>
              <option value="team">Sort: Team Size</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground/70 mr-1">
            Category:
          </span>
          {(["all", "technical", "cultural"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategoryFilter(cat);
                play("tick");
              }}
              className={cn(
                "rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all",
                categoryFilter === cat
                  ? "bg-[var(--neon)]/20 text-[var(--neon)] border border-[var(--neon)]/40 font-semibold"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
              )}
            >
              {cat}
            </button>
          ))}

          <span className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground/70 ml-3 mr-1">
            Mode:
          </span>
          {(["all", "offline", "online"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setModeFilter(mode);
                play("tick");
              }}
              className={cn(
                "rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all",
                modeFilter === mode
                  ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/40 font-semibold"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
              )}
            >
              {mode}
            </button>
          ))}

          <span className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground/70 ml-3 mr-1">
            Status:
          </span>
          {(["all", "ACTIVE", "COMPLETED"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st as typeof statusFilter);
                play("tick");
              }}
              className={cn(
                "rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all",
                statusFilter === st
                  ? "bg-[var(--neon-amber)]/20 text-[var(--neon-amber)] border border-[var(--neon-amber)]/40 font-semibold"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
              )}
            >
              {st}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              setFeaturedOnly(!featuredOnly);
              play("tick");
            }}
            className={cn(
              "rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto sm:ml-4",
              featuredOnly
                ? "bg-[var(--neon)] text-black border border-[var(--neon)] font-bold shadow-[0_0_15px_rgba(0,255,159,0.35)]"
                : "bg-[var(--neon)]/10 border border-[var(--neon)]/30 text-[var(--neon)] hover:bg-[var(--neon)]/20",
            )}
          >
            <Sparkles className="h-3 w-3" />
            <span>6 Hero Sandboxes</span>
          </button>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="mt-6 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>
          Showing <span className="font-bold text-foreground">{filteredEvents.length}</span> of{" "}
          {initialEvents.length} events
        </span>
        {filteredEvents.length < initialEvents.length && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setModeFilter("all");
              setStatusFilter("all");
            }}
            className="text-[var(--neon-cyan)] hover:underline flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Reset all filters
          </button>
        )}
      </div>

      {/* View Rendering: Grid vs Matrix Table */}
      {viewMode === "grid" ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, idx) => {
            const seatsLeft = event.total_seats - event.seats_filled;
            const status = colorForStatus(event.event_status);
            const dateStr = formatIstDate(event.schedule_summary.start_date + "T00:00:00+05:30", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.4) }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1122]/90 transition-all hover:border-[var(--neon)]/50 hover:shadow-[0_8px_30px_rgba(0,255,159,0.15)]"
              >
                {/* Cover Image */}
                <Link
                  href={`/events/${event.id}`}
                  className="relative aspect-[16/10] w-full overflow-hidden block"
                >
                  <Image
                    src={event.cover_image_url}
                    alt={event.cover_image_alt || `${event.name} cover`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1122] via-[#0c1122]/30 to-transparent" />

                  {/* Badges Overlay */}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider backdrop-blur-md",
                        status.bg,
                        status.fg,
                        "border-current/30",
                      )}
                    >
                      {status.label}
                    </span>
                    {event.is_featured && (
                      <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-amber-300 backdrop-blur-md flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5" /> Featured
                      </span>
                    )}
                    {isFeaturedSubmissionEvent(event.id) && (
                      <span className="rounded-full border border-[var(--neon)]/50 bg-[var(--neon)]/20 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-[var(--neon)] backdrop-blur-md flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,159,0.25)]">
                        <Sparkles className="h-2.5 w-2.5" /> Hero Sandbox
                      </span>
                    )}
                  </div>

                  <div className="absolute right-3 top-3">
                    <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 font-mono text-[0.62rem] text-muted-foreground backdrop-blur-md flex items-center gap-1">
                      {event.event_mode === "ONLINE" ? (
                        <>
                          <Wifi className="h-2.5 w-2.5 text-[var(--neon-cyan)]" /> Virtual
                        </>
                      ) : (
                        <>
                          <MapPin className="h-2.5 w-2.5 text-[var(--neon-amber)]" /> Campus
                        </>
                      )}
                    </span>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="text-[var(--neon-cyan)]">{event.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {dateStr}
                    </span>
                  </div>

                  <Link href={`/events/${event.id}`}>
                    <h2 className="mt-2 font-mono text-lg font-bold text-foreground transition-colors group-hover:text-[var(--neon)] line-clamp-1">
                      {event.name}
                    </h2>
                  </Link>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {event.blurb}
                  </p>

                  {/* Seat capacity bar */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between text-[0.7rem] font-mono">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className={seatsLeft > 5 ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                        {seatsLeft} / {event.total_seats} seats left
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon)] transition-all"
                        style={{
                          width: `${Math.min(100, Math.round((event.seats_filled / event.total_seats) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Card Footer: Price & Action */}
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <div>
                      <span className="font-mono text-sm font-bold text-foreground">
                        {event.price === 0 ? "FREE" : formatINR(event.price)}
                      </span>
                      {event.price > 0 && (
                        <span className="text-[0.65rem] text-muted-foreground ml-1">
                          {event.is_per_head ? "/ person" : "/ team"}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all",
                        isFeaturedSubmissionEvent(event.id)
                          ? "bg-[var(--neon)] text-[var(--primary-foreground)] shadow-[0_0_15px_rgba(0,255,159,0.3)] hover:brightness-110"
                          : "border border-[var(--neon)]/40 bg-[var(--neon)]/10 text-[var(--neon)] hover:bg-[var(--neon)] hover:text-[var(--primary-foreground)]"
                      )}
                    >
                      <span>{isFeaturedSubmissionEvent(event.id) ? "⚡ Launch Console" : "Briefing"}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        /* Matrix Table View */
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1122]/90 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Event Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Mode</th>
                  <th className="px-4 py-3 font-semibold">Date & Time</th>
                  <th className="px-4 py-3 font-semibold">Seats Left</th>
                  <th className="px-4 py-3 font-semibold">Fee</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvents.map((event) => {
                  const seatsLeft = event.total_seats - event.seats_filled;
                  const status = colorForStatus(event.event_status);
                  return (
                    <tr
                      key={event.id}
                      className="transition-colors hover:bg-white/5 group"
                    >
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/events/${event.id}`}
                          className="font-bold text-foreground hover:text-[var(--neon)] transition-colors flex items-center gap-2"
                        >
                          <span className={cn("h-2 w-2 rounded-full", status.bg)} />
                          <span>{event.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-[var(--neon-cyan)]">{event.category}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {event.event_mode === "ONLINE" ? "Virtual" : "On-Campus"}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {event.schedule_summary.start_date} · {event.schedule_summary.start_time} IST
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={
                            seatsLeft > 5 ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"
                          }
                        >
                          {seatsLeft} left
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-foreground">
                        {event.price === 0 ? "FREE" : formatINR(event.price)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/events/${event.id}`}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--neon)]/30 bg-[var(--neon)]/10 px-2.5 py-1 text-[0.7rem] text-[var(--neon)] hover:bg-[var(--neon)] hover:text-black transition-colors"
                        >
                          <span>Open</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
          <Filter className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-mono text-lg font-bold text-foreground">No matching events found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No events match your current filter parameters. Try clearing your search query or switching
            category tabs.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setModeFilter("all");
              setStatusFilter("all");
            }}
            className="mt-5 rounded-xl bg-[var(--neon)] px-4 py-2 font-mono text-xs font-semibold text-[var(--primary-foreground)]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
