"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Filter,
  Grid2x2,
  List,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { EventSummary } from "@/lib/types";
import { useCtfStore } from "@/lib/ctf-store";
import { cn, colorForStatus, formatINR, formatIstDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { MissionCard } from "@/components/mission-card";
import { useAudioCue } from "@/hooks/use-audio-cue";
import { toast } from "sonner";

export function MissionGrid({
  events,
  isLoading,
  isError,
  onRetry,
}: {
  events: EventSummary[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const view = useCtfStore((s) => s.view);
  const setView = useCtfStore((s) => s.setView);
  const sort = useCtfStore((s) => s.sort);
  const setSort = useCtfStore((s) => s.setSort);
  const search = useCtfStore((s) => s.search);
  const setSearch = useCtfStore((s) => s.setSearch);
  const categoryFilter = useCtfStore((s) => s.categoryFilter);
  const setCategoryFilter = useCtfStore((s) => s.setCategoryFilter);
  const statusFilter = useCtfStore((s) => s.statusFilter);
  const setStatusFilter = useCtfStore((s) => s.setStatusFilter);
  const modeFilter = useCtfStore((s) => s.modeFilter);
  const setModeFilter = useCtfStore((s) => s.setModeFilter);
  const play = useAudioCue();
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search input — write back to the store after 300ms idle
  useEffect(() => {
    const id = setTimeout(() => setSearch(localSearch), 300);
    return () => clearTimeout(id);
  }, [localSearch, setSearch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = events.filter((ev) => {
      if (categoryFilter === "technical" && !ev.is_technical) return false;
      if (categoryFilter === "cultural" && ev.is_technical) return false;
      if (statusFilter !== "all" && ev.event_status !== statusFilter) return false;
      if (modeFilter === "offline" && ev.event_mode !== "OFFLINE") return false;
      if (modeFilter === "online" && ev.event_mode !== "ONLINE") return false;
      if (q) {
        const hay = `${ev.name} ${ev.blurb} ${ev.category} ${ev.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case "date":
        sorted.sort(
          (a, b) =>
            new Date(a.schedule_summary.start_date + "T00:00:00").getTime() -
            new Date(b.schedule_summary.start_date + "T00:00:00").getTime(),
        );
        break;
      case "seats":
        sorted.sort(
          (a, b) => b.total_seats - b.seats_filled - (a.total_seats - a.seats_filled),
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
  }, [events, search, categoryFilter, statusFilter, modeFilter, sort]);

  const activeCount = filtered.filter((e) => e.event_status === "ACTIVE").length;
  const featured = filtered.filter((e) => e.is_featured).length;

  return (
    <section
      id="missions"
      aria-labelledby="missions-title"
      className="relative scroll-mt-24 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]">
              <Tag className="h-4 w-4" aria-hidden /> {"// mission board"}
            </div>
            <h2
              id="missions-title"
              className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              Missions
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Every event on the Render72 campus board, reframed as a CTF mission. Filter, sort and
              search across the full payload — selecting a card opens the full mission briefing
              with prizes, schedule, FAQs and coordinators.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[0.7rem] text-muted-foreground">
            <span className="rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5">
              <span className="text-[var(--neon)] tabular-nums">{filtered.length}</span> shown
            </span>
            <span className="rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5">
              <span className="text-[var(--neon-cyan)] tabular-nums">{activeCount}</span> live
            </span>
            <span className="hidden rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 sm:inline">
              <Sparkles className="mr-1 inline h-3 w-3 text-[var(--neon-amber)]" aria-hidden />
              <span className="text-[var(--neon-amber)] tabular-nums">{featured}</span> featured
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 glass rounded-2xl border border-white/10 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <label htmlFor="mission-search" className="sr-only">
                Search missions
              </label>
              <input
                id="mission-search"
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="search by name, tag, category…"
                className="w-full rounded-md border border-white/10 bg-black/40 py-2 pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--neon)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterGroup
                label="Category"
                value={categoryFilter}
                onChange={(v) => setCategoryFilter(v as typeof categoryFilter)}
                options={[
                  { value: "all", label: "All" },
                  { value: "technical", label: "Technical" },
                  { value: "cultural", label: "Cultural" },
                ]}
              />
              <FilterGroup
                label="Mode"
                value={modeFilter}
                onChange={(v) => setModeFilter(v as typeof modeFilter)}
                options={[
                  { value: "all", label: "All" },
                  { value: "offline", label: <WifiOff className="h-3 w-3" /> },
                  { value: "online", label: <Wifi className="h-3 w-3" /> },
                ]}
              />
              <FilterGroup
                label="Status"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as typeof statusFilter)}
                options={[
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "completed", label: "Done" },
                  { value: "closed", label: "Closed" },
                ]}
              />
              <SortSelect value={sort} onChange={setSort} />
              <div className="flex items-center rounded-md border border-white/10 bg-black/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  aria-label="Grid view"
                  className={cn(
                    "rounded p-1.5 transition-colors",
                    view === "grid"
                      ? "bg-[var(--neon)]/15 text-[var(--neon)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Grid2x2 className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setView("table")}
                  aria-pressed={view === "table"}
                  aria-label="Table view"
                  className={cn(
                    "rounded p-1.5 transition-colors",
                    view === "table"
                      ? "bg-[var(--neon)]/15 text-[var(--neon)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <List className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6">
          {isError ? (
            <ErrorState onRetry={onRetry} />
          ) : isLoading ? (
            <SkeletonGrid />
          ) : filtered.length === 0 ? (
            <EmptyState
              onClear={() => {
                setLocalSearch("");
                setSearch("");
                setCategoryFilter("all");
                setStatusFilter("all");
                setModeFilter("all");
              }}
            />
          ) : view === "grid" ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((ev, idx) => (
                  <motion.div
                    key={ev.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <MissionCard event={ev} priority={idx < 6} onOpen={() => play("open")} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <TableList events={filtered} onRowClick={() => play("blip")} />
          )}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: React.ReactNode }>;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div
        className="flex items-center rounded-md border border-white/10 bg-black/40 p-0.5"
        role="group"
        aria-label={label}
      >
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={cn(
              "rounded px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest transition-colors",
              value === o.value
                ? "bg-[var(--neon)]/15 text-[var(--neon)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: "date" | "seats" | "price" | "team";
  onChange: (v: "date" | "seats" | "price" | "team") => void;
}) {
  return (
    <label className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
      <Filter className="h-3 w-3" aria-hidden />
      sort
      <select
        aria-label="Sort by"
        value={value}
        onChange={(e) => onChange(e.target.value as typeof value)}
        className="bg-transparent font-mono text-[0.65rem] uppercase tracking-widest text-foreground focus:outline-none"
      >
        <option value="date">Date</option>
        <option value="seats">Seats left</option>
        <option value="price">Price</option>
        <option value="team">Team size</option>
      </select>
    </label>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="glass overflow-hidden rounded-2xl border border-white/10 p-0"
        >
          <Skeleton className="aspect-[3/2] w-full rounded-none bg-white/5" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-2/3 bg-white/5" />
            <Skeleton className="h-3 w-full bg-white/5" />
            <Skeleton className="h-3 w-5/6 bg-white/5" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
              <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-2xl border border-white/10 px-6 py-12 text-center">
      <Search className="h-8 w-8 text-muted-foreground" aria-hidden />
      <div>
        <p className="font-mono text-sm text-foreground">no missions match current filters</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try clearing the search or switching filters to widen the scope.
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-2 rounded-md border border-[var(--neon)]/40 bg-[var(--neon)]/10 px-3 py-1.5 font-mono text-xs text-[var(--neon)] hover:bg-[var(--neon)]/20"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden /> reset filters
      </button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-2xl border border-[var(--neon-rose)]/40 bg-[var(--neon-rose)]/5 px-6 py-12 text-center">
      <p className="font-mono text-sm text-[var(--neon-rose)]">
        [render72.api] connection failed
      </p>
      <p className="text-sm text-muted-foreground">
        The events endpoint is unreachable. Verify network access and try again — we kept the
        rest of the dashboard running so you can still explore the sandbox.
      </p>
      <button
        type="button"
        onClick={() => {
          onRetry();
          toast.success("Retrying Render72 events endpoint…");
        }}
        className="inline-flex items-center gap-2 rounded-md border border-[var(--neon)]/40 bg-[var(--neon)]/10 px-3 py-1.5 font-mono text-xs text-[var(--neon)] hover:bg-[var(--neon)]/20"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden /> retry fetch
      </button>
    </div>
  );
}

function TableList({
  events,
  onRowClick,
}: {
  events: EventSummary[];
  onRowClick: () => void;
}) {
  const openBriefing = useCtfStore((s) => s.openBriefing);
  return (
    <div className="glass overflow-hidden rounded-2xl border border-white/10">
      <div className="grid grid-cols-[1fr_6rem_6rem_6rem_6rem] items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
        <span>mission</span>
        <span>category</span>
        <span>date</span>
        <span className="text-right">price</span>
        <span className="text-right">status</span>
      </div>
      <ul className="divide-y divide-white/5">
        {events.map((ev) => {
          const status = colorForStatus(ev.event_status);
          return (
            <li key={ev.id}>
              <button
                type="button"
                onClick={() => {
                  openBriefing(ev.id);
                  onRowClick();
                }}
                className="grid w-full grid-cols-[1fr_6rem_6rem_6rem_6rem] items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm text-foreground">{ev.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{ev.blurb}</div>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{ev.category}</span>
                <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" aria-hidden />
                  {formatIstDate(ev.schedule_summary.start_date + "T00:00:00+05:30", { day: "2-digit", month: "short" })}
                </span>
                <span className="text-right font-mono text-xs text-foreground">{formatINR(ev.price)}</span>
                <span className={cn("text-right font-mono text-xs uppercase tracking-widest", status.fg)}>
                  {status.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
