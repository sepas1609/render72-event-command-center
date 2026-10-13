import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Mail,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Wifi,
} from "lucide-react";
import { getEvent } from "@/lib/api";
import {
  colorForStatus,
  formatINR,
  formatIstDate,
  splitParagraphs,
} from "@/lib/utils";
import fallbackEvents from "@/lib/fallback-events.json";
import { FeaturedEventCreativeSuite } from "@/components/event-interactive-widgets/featured-event-suite";
import { isFeaturedSubmissionEvent } from "@/lib/featured-events";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const events = (fallbackEvents as { events: Array<{ id: string }> }).events;
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const event = await getEvent(id);
    return {
      title: `${event.name} | FlagHorizon Sentinel`,
      description: event.blurb,
      openGraph: {
        title: `${event.name} — Campus Event Briefing`,
        description: event.blurb,
        images: [{ url: event.cover_image_url, width: 1200, height: 800, alt: event.cover_image_alt }],
      },
    };
  } catch {
    return {
      title: "Event Dossier | FlagHorizon Sentinel",
    };
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const seatsLeft = event.total_seats - event.seats_filled;
  const status = colorForStatus(event.event_status);
  const paragraphs = splitParagraphs(event.description);

  // Schema.org JSON-LD for rich snippet SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.blurb,
    startDate: `${event.schedule_summary.start_date}T${event.schedule_summary.start_time}:00+05:30`,
    endDate: `${event.schedule_summary.end_date}T${event.schedule_summary.end_time}:00+05:30`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      event.event_mode === "ONLINE"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.schedules?.[0]?.venue || "Campus Main Ground / Online",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Campus",
        addressCountry: "IN",
      },
    },
    image: [event.banner_image_url || event.cover_image_url],
    offers: {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "INR",
      availability:
        seatsLeft > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      validFrom: "2026-01-01T00:00:00+05:30",
    },
  };

  return (
    <article className="min-h-screen bg-transparent pt-6 pb-24 text-foreground">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Events Matrix</span>
          </Link>

          <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>ID:</span>
            <span className="rounded bg-black/50 px-2 py-0.5 text-[var(--neon-cyan)] border border-white/10 text-[0.7rem]">
              {event.id.slice(0, 13)}...
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0c1122]/90 shadow-2xl">
          <div className="relative aspect-[21/9] min-h-[280px] w-full overflow-hidden">
            <Image
              src={event.banner_image_url || event.cover_image_url}
              alt={event.banner_image_alt || event.name}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1122] via-[#0c1122]/60 to-transparent" />

            {/* Floating Top Badges */}
            <div className="absolute left-6 top-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[var(--neon-cyan)] backdrop-blur-md">
                {event.category}
              </span>
              <span
                className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest backdrop-blur-md ${status.bg} ${status.fg} border-current/40`}
              >
                {status.label}
              </span>
              {event.is_featured && (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 font-mono text-xs uppercase tracking-widest text-amber-300 backdrop-blur-md flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Featured Mission
                </span>
              )}
              {isFeaturedSubmissionEvent(event.id) && (
                <span className="rounded-full border border-[var(--neon)]/50 bg-[var(--neon)]/20 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[var(--neon)] backdrop-blur-md flex items-center gap-1 shadow-[0_0_12px_rgba(0,255,159,0.3)]">
                  <Sparkles className="h-3 w-3" /> Sentinel Classified Hero
                </span>
              )}
            </div>

            {/* Bottom Header Info */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="font-mono text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {event.name}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {event.blurb}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 bg-black/40 p-6 sm:grid-cols-4">
            <div>
              <div className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">
                Date & Start Time
              </div>
              <div className="mt-1 font-mono text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[var(--neon)]" />
                <span>
                  {event.schedule_summary.start_date} · {event.schedule_summary.start_time} IST
                </span>
              </div>
            </div>

            <div>
              <div className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">
                Format & Mode
              </div>
              <div className="mt-1 font-mono text-sm font-semibold text-foreground flex items-center gap-1.5">
                {event.event_mode === "ONLINE" ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-[var(--neon-cyan)]" /> Virtual Arena
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-[var(--neon-amber)]" /> Campus Ground
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">
                Team Size Constraint
              </div>
              <div className="mt-1 font-mono text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[var(--neon-rose)]" />
                <span>
                  {event.min_teamsize === event.max_teamsize
                    ? `${event.min_teamsize} Person`
                    : `${event.min_teamsize} - ${event.max_teamsize} Persons`}
                </span>
              </div>
            </div>

            <div>
              <div className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">
                Registration Fee
              </div>
              <div className="mt-1 font-mono text-base font-bold text-[var(--neon)]">
                {event.price === 0 ? "FREE" : formatINR(event.price)}
                {event.price > 0 && (
                  <span className="text-[0.65rem] text-muted-foreground font-normal ml-1">
                    {event.is_per_head ? "/ person" : "/ squad"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Capacity & Registration Action Strip */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0d1322]/80 p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Arena Capacity Status:</span>
              <span className={seatsLeft > 5 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {seatsLeft} Seats Remaining ({event.seats_filled} of {event.total_seats} Filled)
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon)] to-[var(--neon-amber)] transition-all"
                style={{
                  width: `${Math.min(100, Math.round((event.seats_filled / event.total_seats) * 100))}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono text-xs text-muted-foreground text-right hidden sm:block">
              <div>Deadline:</div>
              <div className="text-foreground font-semibold">
                {formatIstDate(event.registration_deadline, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--neon-cyan)] px-6 py-3 font-mono text-xs font-bold text-[var(--primary-foreground)] shadow-[0_0_24px_oklch(0.86_0.24_152/35%)] transition-all hover:brightness-110 active:scale-95"
            >
              Register for Event
            </button>
          </div>
        </div>

        {/* 6 Tailored Creative Featured Widgets */}
        <FeaturedEventCreativeSuite eventId={event.id} />

        {/* Content Grid: Dossier Body & Sidebar */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Column */}
          <div className="space-y-10 lg:col-span-8">
            {/* Description Paragraphs */}
            <section className="rounded-2xl border border-white/10 bg-[#0c1122]/90 p-6 sm:p-8 backdrop-blur-xl">
              <h2 className="flex items-center gap-2 font-mono text-xl font-bold text-foreground">
                <FileText className="h-5 w-5 text-[var(--neon)]" />
                <span>Mission Briefing & Objective</span>
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--neon-cyan)]">
                    Key Highlights
                  </h3>
                  <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {event.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90 font-mono">
                        <CheckCircle2 className="h-4 w-4 text-[var(--neon)] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* What to Expect & Eligibility */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-[#0c1122]/90 p-6 backdrop-blur-xl">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--neon-amber)] flex items-center gap-2">
                  <Compass className="h-4 w-4" /> What to Expect
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
                  {event.what_to_expect?.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--neon-amber)] font-bold">›</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0c1122]/90 p-6 backdrop-blur-xl">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--neon-rose)] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Eligibility & Prerequisites
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
                  {event.eligibility?.map((e, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--neon-rose)] font-bold">›</span>
                      <span>{e}</span>
                    </li>
                  ))}
                  {event.prerequisites?.map((pr, idx) => (
                    <li key={`pre-${idx}`} className="flex items-start gap-2 text-foreground/80">
                      <span className="text-[var(--neon-rose)] font-bold">›</span>
                      <span>Required: {pr}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Session Schedule Breakdown */}
            {event.schedules && event.schedules.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-[#0c1122]/90 p-6 sm:p-8 backdrop-blur-xl">
                <h2 className="flex items-center gap-2 font-mono text-xl font-bold text-foreground">
                  <Clock className="h-5 w-5 text-[var(--neon-cyan)]" />
                  <span>Session Timeline & Venue</span>
                </h2>
                <div className="mt-6 space-y-4">
                  {event.schedules.map((sch, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-mono font-bold text-xs">
                          0{idx + 1}
                        </div>
                        <div>
                          <div className="font-mono text-sm font-bold text-foreground">
                            {sch.event_date} · {sch.start_time} - {sch.end_time} IST
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-[var(--neon-amber)]" />
                            <span>{sch.venue}</span>
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-[0.65rem] text-emerald-400 self-start sm:self-auto">
                        Scheduled
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rules */}
            {event.rules && event.rules.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-[#0c1122]/90 p-6 backdrop-blur-xl">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[var(--neon-rose)]" />
                  <span>Rules of Engagement</span>
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                  {event.rules.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-[var(--neon-rose)] font-bold">[{idx + 1}]</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs Accordion */}
            {event.faqs && event.faqs.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-[#0c1122]/90 p-6 sm:p-8 backdrop-blur-xl">
                <h2 className="font-mono text-xl font-bold text-foreground">Frequently Asked Questions</h2>
                <div className="mt-5 divide-y divide-white/10">
                  {event.faqs.map((faq, idx) => (
                    <details key={idx} className="group py-4">
                      <summary className="flex cursor-pointer items-center justify-between font-mono text-sm font-semibold text-foreground hover:text-[var(--neon)] transition-colors">
                        <span>{faq.question}</span>
                        <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6 lg:col-span-4">
            {/* Prize Pool Breakdown */}
            {event.prizes && event.prizes.length > 0 && (
              <div className="rounded-2xl border border-[var(--neon-amber)]/30 bg-gradient-to-b from-[#0c1122] via-[#0d1428] to-[#0c1122] p-6 shadow-xl">
                <div className="flex items-center gap-2 font-mono text-base font-bold text-[var(--neon-amber)]">
                  <Trophy className="h-5 w-5" />
                  <span>Prize Pool Breakdown</span>
                </div>
                <div className="mt-4 space-y-3">
                  {event.prizes.map((pz) => (
                    <div
                      key={pz.rank}
                      className="rounded-xl border border-white/10 bg-black/40 p-4 transition-transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Rank #{pz.rank}
                        </span>
                        <span className="font-mono text-base font-extrabold text-[var(--neon-amber)]">
                          {formatINR(pz.amount)}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-sm font-semibold text-foreground">
                        {pz.title}
                      </div>
                      {pz.description && (
                        <p className="mt-1 text-[0.72rem] text-muted-foreground">{pz.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coordinators & Contacts */}
            {event.coordinators && event.coordinators.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#0c1122]/90 p-6 backdrop-blur-xl">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--neon-cyan)]" /> Event Coordinators
                </h3>
                <div className="mt-4 space-y-3">
                  {event.coordinators.map((c) => (
                    <div key={c.id} className="rounded-xl border border-white/5 bg-black/40 p-3.5">
                      <div className="font-mono text-sm font-bold text-foreground">{c.name}</div>
                      <div className="text-xs text-[var(--neon-cyan)] font-mono">{c.role}</div>
                      <a
                        href={`mailto:${c.contact}`}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{c.contact}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizing Body */}
            {event.organizers && event.organizers.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#0c1122]/90 p-6 backdrop-blur-xl">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Organized By
                </h3>
                <div className="mt-3 space-y-2">
                  {event.organizers.map((org) => (
                    <div key={org.id} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-foreground">{org.name}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                        {org.org_type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
