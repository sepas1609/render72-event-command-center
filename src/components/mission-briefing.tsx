"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Calendar,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Mail,
  MapPin,
  Network,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useCtfStore } from "@/lib/ctf-store";
import { useEvent } from "@/hooks/use-events";
import {
  cn,
  colorForRegistration,
  colorForStatus,
  formatINR,
  formatIstDate,
  relativeTimeFromNow,
  splitParagraphs,
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAudioCue } from "@/hooks/use-audio-cue";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function MissionBriefing() {
  const id = useCtfStore((s) => s.briefingEventId);
  const openBriefing = useCtfStore((s) => s.openBriefing);
  const play = useAudioCue();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!id) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [id]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(open) => {
        if (!open) {
          openBriefing(null);
          play("blip");
        }
      }}
    >
      <DialogContent
        className="max-w-4xl gap-0 overflow-hidden border-white/10 bg-background/95 p-0 backdrop-blur-xl sm:rounded-2xl"
        aria-describedby={undefined}
      >
        <DialogDescription className="sr-only">
          Mission briefing with description, schedule, prizes, FAQs and coordinators.
        </DialogDescription>
        <AnimatePresence mode="wait">
          {id && <BriefingBody key={id} id={id} />}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function BriefingBody({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useEvent(id);
  const openBriefing = useCtfStore((s) => s.openBriefing);

  if (isLoading) return <BriefingSkeleton />;
  if (isError || !data) {
    return (
      <div className="p-6">
        <DialogTitle className="sr-only">Mission briefing error</DialogTitle>
        <div className="glass flex flex-col items-center gap-3 rounded-xl border border-[var(--neon-rose)]/40 bg-[var(--neon-rose)]/5 px-6 py-12 text-center">
          <p className="font-mono text-sm text-[var(--neon-rose)]">
            [briefing] failed to load
          </p>
          <p className="text-sm text-muted-foreground">
            {error?.message ?? "The mission briefing could not be retrieved."}
          </p>
          <button
            type="button"
            onClick={() => openBriefing(null)}
            className="rounded-md border border-white/10 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const ev = data;
  const status = colorForStatus(ev.event_status);
  const reg = colorForRegistration(ev.registration_status);
  const seatsLeft = ev.total_seats - ev.seats_filled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="relative h-44 w-full sm:h-56">
        <Image
          src={ev.banner_image_url ?? ev.cover_image_url}
          alt={ev.banner_image_alt ?? ev.cover_image_alt ?? `${ev.name} banner`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <button
          type="button"
          onClick={() => openBriefing(null)}
          aria-label="Close briefing"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground backdrop-blur transition-colors hover:bg-black/60"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        <div className="absolute inset-x-4 bottom-3 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-current/40 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest backdrop-blur",
              status.fg,
              status.bg,
            )}
          >
            {status.label}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-current/40 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest backdrop-blur",
              reg.fg,
              reg.bg,
            )}
          >
            reg {reg.label.toLowerCase()}
          </span>
          {ev.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--neon-amber)]/40 bg-[var(--neon-amber)]/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--neon-amber)] backdrop-blur">
              <Sparkles className="h-2.5 w-2.5" aria-hidden /> featured
            </span>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]">
          {ev.category} · {ev.event_type}
        </p>
        <DialogTitle asChild>
          <h2 className="mt-1 font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {ev.name}
          </h2>
        </DialogTitle>
        <DialogDescription className="sr-only">{ev.blurb}</DialogDescription>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{ev.blurb}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Date" value={formatIstDate(ev.schedule_summary.start_date + "T00:00:00+05:30", { day: "2-digit", month: "short" })} icon={<Calendar className="h-3 w-3" aria-hidden />} />
          <Stat label="Window" value={`${ev.schedule_summary.start_time}–${ev.schedule_summary.end_time}`} icon={<Clock className="h-3 w-3" aria-hidden />} />
          <Stat label="Team" value={`${ev.min_teamsize}–${ev.max_teamsize}`} icon={<Users className="h-3 w-3" aria-hidden />} />
          <Stat label="Mode" value={ev.event_mode === "ONLINE" ? "Virtual" : "On Campus"} icon={ev.event_mode === "ONLINE" ? <Network className="h-3 w-3" aria-hidden /> : <MapPin className="h-3 w-3" aria-hidden />} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="glass rounded-lg border border-white/10 p-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">Price</p>
            <p className="mt-1 font-mono text-lg font-semibold text-foreground">{formatINR(ev.price)}</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              {ev.is_per_head ? "per head" : "per team"}
            </p>
          </div>
          <div className="glass rounded-lg border border-white/10 p-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">Seats left</p>
            <p className="mt-1 font-mono text-lg font-semibold text-foreground tabular-nums">
              {seatsLeft}
              <span className="ml-1 text-[0.65rem] text-muted-foreground">/ {ev.total_seats}</span>
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              {ev.seats_filled} confirmed
            </p>
          </div>
          <div className="glass rounded-lg border border-white/10 p-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">Registration</p>
            <p className="mt-1 font-mono text-lg font-semibold text-foreground">
              {relativeTimeFromNow(ev.registration_deadline)}
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              closes {formatIstDate(ev.registration_deadline, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* Description */}
        <section className="mt-6">
          <SectionLabel icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>briefing</SectionLabel>
          <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {splitParagraphs(ev.description).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Highlights */}
        {ev.highlights.length > 0 && (
          <section className="mt-6">
            <SectionLabel icon={<Sparkles className="h-3 w-3" aria-hidden />}>highlights</SectionLabel>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {ev.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 text-[var(--neon)]" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* What to expect / eligibility / prerequisites */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {ev.what_to_expect.length > 0 && (
            <Panel title="What to expect" items={ev.what_to_expect} accent="cyan" />
          )}
          {ev.eligibility.length > 0 && (
            <Panel title="Eligibility" items={ev.eligibility} accent="neon" />
          )}
          {ev.prerequisites.length > 0 && (
            <Panel title="Prerequisites" items={ev.prerequisites} accent="amber" />
          )}
        </div>

        {/* Rules */}
        {ev.rules.length > 0 && (
          <section className="mt-6">
            <SectionLabel icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>scope &amp; rules</SectionLabel>
            <ul className="mt-2 space-y-1.5">
              {ev.rules.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-md border border-white/5 bg-black/30 px-3 py-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 font-mono text-[var(--neon-rose)]" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Prizes + Schedules */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {ev.prizes.length > 0 && (
            <section>
              <SectionLabel icon={<CircleDollarSign className="h-3 w-3" aria-hidden />}>prize pool</SectionLabel>
              <ul className="mt-2 space-y-1.5">
                {ev.prizes.map((p) => (
                  <li
                    key={p.rank}
                    className="flex items-center justify-between gap-3 rounded-md border border-white/5 bg-black/30 px-3 py-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold",
                            p.rank === 1 && "bg-[var(--neon)]/20 text-[var(--neon)]",
                            p.rank === 2 && "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]",
                            p.rank === 3 && "bg-[var(--neon-amber)]/20 text-[var(--neon-amber)]",
                            p.rank > 3 && "bg-white/5 text-muted-foreground",
                          )}
                          aria-hidden
                        >
                          {p.rank}
                        </span>
                        <span className="font-mono text-sm text-foreground">{p.title}</span>
                      </div>
                      <p className="ml-8 text-xs text-muted-foreground">{p.description}</p>
                    </div>
                    <span className="font-mono text-sm font-semibold text-[var(--neon)]">
                      {formatINR(p.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {ev.schedules.length > 0 && (
            <section>
              <SectionLabel icon={<Clock className="h-3 w-3" aria-hidden />}>schedule (IST)</SectionLabel>
              <ul className="mt-2 space-y-1.5">
                {ev.schedules.map((s, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-white/5 bg-black/30 px-3 py-2"
                  >
                    <div>
                      <p className="font-mono text-sm text-foreground">
                        {formatIstDate(s.event_date + "T00:00:00+05:30", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.venue}</p>
                    </div>
                    <span className="font-mono text-xs text-[var(--neon-cyan)] tabular-nums">
                      {s.start_time}–{s.end_time}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Gallery */}
        {ev.gallery_images.length > 0 && (
          <section className="mt-6">
            <SectionLabel icon={<Sparkles className="h-3 w-3" aria-hidden />}>field gallery</SectionLabel>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ev.gallery_images.map((src, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-md border border-white/10">
                  <Image
                    src={src}
                    alt={`${ev.name} gallery image ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {ev.faqs.length > 0 && (
          <section className="mt-6">
            <SectionLabel icon={<BadgeCheck className="h-3 w-3" aria-hidden />}>FAQ</SectionLabel>
            <ul className="mt-2 space-y-2">
              {ev.faqs.map((f, i) => (
                <li key={i} className="rounded-md border border-white/5 bg-black/30 p-3">
                  <p className="font-mono text-sm text-foreground">{f.question}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Organizers + Coordinators */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ev.organizers.length > 0 && (
            <section>
              <SectionLabel icon={<Network className="h-3 w-3" aria-hidden />}>organized by</SectionLabel>
              <ul className="mt-2 space-y-1.5">
                {ev.organizers.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center justify-between rounded-md border border-white/5 bg-black/30 px-3 py-2"
                  >
                    <span className="font-mono text-sm text-foreground">{o.name}</span>
                    <Badge variant="outline" className="border-white/10 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                      {o.org_type}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {ev.coordinators.length > 0 && (
            <section>
              <SectionLabel icon={<PhoneCall className="h-3 w-3" aria-hidden />}>coordinators</SectionLabel>
              <ul className="mt-2 space-y-1.5">
                {ev.coordinators.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-md border border-white/5 bg-black/30 px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-foreground">{c.name}</span>
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--neon-cyan)]">
                        {c.role}
                      </span>
                    </div>
                    <a
                      href={`mailto:${c.contact}`}
                      className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-[var(--neon)]"
                    >
                      <Mail className="h-3 w-3" aria-hidden /> {c.contact}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {ev.tags.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground"
            >
              #{t.toLowerCase().replace(/\s+/g, "-")}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              event id
            </span>
            <code className="rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[0.65rem] text-[var(--neon)]">
              {ev.id.slice(0, 18)}...
            </code>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <a
              href={`https://render72.pages.dev/api/test/events/${ev.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[0.7rem] text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              raw JSON
              <ChevronRight className="h-3 w-3" aria-hidden />
            </a>
            <Link
              href={`/events/${ev.id}`}
              onClick={() => openBriefing(null)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--neon)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--primary-foreground)] shadow-[0_0_15px_oklch(0.86_0.24_152/25%)] hover:brightness-110"
            >
              Open Dedicated Page
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass rounded-md border border-white/10 px-3 py-2">
      <div className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
        <span className="text-[var(--neon)]" aria-hidden>{icon}</span>
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm text-foreground">{value}</div>
    </div>
  );
}

function SectionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]">
      <span aria-hidden>{icon}</span>
      {children}
    </h3>
  );
}

function Panel({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: "neon" | "cyan" | "amber";
}) {
  const color =
    accent === "cyan"
      ? "text-[var(--neon-cyan)]"
      : accent === "amber"
        ? "text-[var(--neon-amber)]"
        : "text-[var(--neon)]";
  return (
    <section className="glass rounded-lg border border-white/10 p-3">
      <SectionLabel icon={<ChevronRight className="h-3 w-3" aria-hidden />}>
        <span className={color}>{title}</span>
      </SectionLabel>
      <ul className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${color === "text-[var(--neon)]" ? "bg-[var(--neon)]" : color === "text-[var(--neon-cyan)]" ? "bg-[var(--neon-cyan)]" : "bg-[var(--neon-amber)]"}`} aria-hidden />
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}

function BriefingSkeleton() {
  return (
    <div className="p-0">
      <DialogTitle className="sr-only">Loading mission briefing</DialogTitle>
      <Skeleton className="h-44 w-full rounded-none sm:h-56" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </div>
  );
}
