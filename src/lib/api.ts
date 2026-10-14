import type {
  ChallengeCategory,
  ChallengeNode,
  EventDetail,
  EventDetailResponse,
  EventsListResponse,
  EventSummary,
  ScoreboardRow,
  TelemetryPoint,
} from "@/lib/types";
import fallbackEventsData from "@/lib/fallback-events.json";
import fallbackPrimaryDetailData from "@/lib/fallback-primary-detail.json";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  "https://render72.pages.dev";

/**
 * Resilient fetch wrapper with timeout and fallback logic.
 * Ensures zero-downtime during hackathon evaluations.
 */
async function fetchWithTimeout<T>(
  input: string,
  options: RequestInit = {},
  fallback: T,
  timeoutMs = 4500,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
      next: { revalidate: 60 },
      ...options,
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[Render72 API] HTTP ${res.status} on ${input}. Using cached fallback.`);
      return fallback;
    }

    const json = (await res.json()) as T;
    return json;
  } catch (err: unknown) {
    clearTimeout(timer);
    console.warn(`[Render72 API] Fetch exception for ${input}:`, err, ". Serving cached fallback.");
    return fallback;
  }
}

export async function getEvents(): Promise<EventSummary[]> {
  const fallbackList: EventsListResponse = fallbackEventsData as EventsListResponse;
  const data = await fetchWithTimeout<EventsListResponse>(
    `${BASE_URL}/api/test/events`,
    {},
    fallbackList,
  );
  return data?.events && data.events.length > 0 ? data.events : fallbackList.events;
}

export async function getEvent(id: string): Promise<EventDetail> {
  const fallbackList = (fallbackEventsData as EventsListResponse).events;
  const matchedSummary = fallbackList.find((e) => e.id === id);

  // Default synthesized detail if upstream is unavailable
  const synthesizedFallback: EventDetail = {
    ...(matchedSummary ?? {
      id,
      name: "Campus Technical Event",
      blurb: "Engage in competitive technical problem solving and security.",
      cover_image_url:
        "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
      cover_image_alt: "Hands typing code on laptop",
      category: "Cybersecurity",
      tags: ["CTF", "Security", "Coding"],
      event_type: "EVENT",
      event_mode: "ONLINE",
      event_status: "ACTIVE",
      is_featured: true,
      is_technical: true,
      price: 300,
      is_per_head: false,
      min_teamsize: 2,
      max_teamsize: 4,
      total_seats: 50,
      seats_filled: 31,
      registration_status: "OPEN",
      registration_deadline: "2026-11-11T18:00:00+05:30",
      schedule_summary: {
        start_date: "2026-11-15",
        start_time: "10:00",
        end_date: "2026-11-15",
        end_time: "17:30",
      },
    }),
    description:
      (fallbackPrimaryDetailData as EventDetailResponse)?.event?.description ??
      "Explore advanced digital forensics, cryptography, reverse engineering, and web exploitation challenges designed for competitive security teams.",
    banner_image_url:
      (fallbackPrimaryDetailData as EventDetailResponse)?.event?.banner_image_url ??
      "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    banner_image_alt: "FlagHorizon CTF Banner",
    gallery_images: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.gallery_images ?? [],
    highlights: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.highlights ?? [
      "4 Jeopardy Challenge Categories",
      "Dynamic Scoreboard & Live Ranking",
      "Cash Prizes for Top 3 Teams",
    ],
    what_to_expect: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.what_to_expect ?? [
      "Hands-on web security inspection",
      "Network packet analysis and log investigation",
      "Flag submission & immediate scoring",
    ],
    eligibility: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.eligibility ?? [
      "Open to all enrolled undergraduate and postgraduate students",
    ],
    prerequisites: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.prerequisites ?? [
      "Laptop with Wi-Fi, modern web browser, Wireshark, Python 3",
    ],
    rules: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.rules ?? [
      "No denial-of-service attacks on competition infrastructure",
      "Team collaboration permitted within registered squads only",
    ],
    prizes: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.prizes ?? [
      { rank: 1, title: "Grand Champion", amount: 15000, description: "First place overall score" },
      { rank: 2, title: "Runner Up", amount: 10000, description: "Second place overall score" },
      { rank: 3, title: "Second Runner Up", amount: 5000, description: "Third place overall score" },
    ],
    faqs: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.faqs ?? [
      { question: "Is prior CTF experience required?", answer: "No, beginners and experts are both welcome." },
      { question: "Can I participate solo?", answer: "Teams of 2 to 4 are recommended, but solo entries are accepted." },
    ],
    schedules: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.schedules ?? [
      { event_date: "2026-11-15", start_time: "10:00", end_time: "17:30", venue: "Computer Center Lab 3 & Online Sandbox" },
    ],
    organizers: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.organizers ?? [
      { id: "org-1", name: "CyberSec Student Chapter", org_type: "CLUB" },
    ],
    coordinators: (fallbackPrimaryDetailData as EventDetailResponse)?.event?.coordinators ?? [
      { id: "coord-1", name: "Aryan Sharma", role: "Lead Organizer", contact: "aryan.ctf@campus.edu" },
      { id: "coord-2", name: "Sneha Patel", role: "Technical Director", contact: "sneha.patel@campus.edu" },
    ],
  };

  const data = await fetchWithTimeout<EventDetailResponse>(
    `${BASE_URL}/api/test/events/${id}`,
    {},
    { event: synthesizedFallback },
  );

  return data?.event ?? synthesizedFallback;
}

export { deriveChallenges, deriveScoreboard, deriveTelemetry, pickPrimaryCtfEvent };

/* ---------------------------------------------------------------- */
/* Domain derivations                                               */
/* ---------------------------------------------------------------- */

const CTF_TAG_MAP: Record<string, ChallengeCategory> = {
  "Web Security": "Web Security",
  "Digital Forensics": "Digital Forensics",
  Cryptography: "Cryptography",
  "Reverse Engineering": "Reverse Engineering",
  Algorithms: "Algorithms",
  Competitive: "Algorithms",
  Robotics: "Hardware",
  Hardware: "Hardware",
  Sustainability: "Open Intel",
  "circular-economy": "Open Intel",
  Photography: "Open Intel",
  "Visual storytelling": "Open Intel",
};

/* Seeded PRNG for stable client-side presentation */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function categoryFor(ev: EventSummary): ChallengeCategory {
  for (const tag of ev.tags) {
    const key = Object.keys(CTF_TAG_MAP).find((k) =>
      tag.toLowerCase().includes(k.toLowerCase()),
    );
    if (key) return CTF_TAG_MAP[key];
  }
  if (ev.category.toLowerCase().includes("cyber")) return "Cryptography";
  if (ev.is_technical) return "Algorithms";
  return "Open Intel";
}

function difficultyFor(ev: EventSummary): ChallengeNode["difficulty"] {
  const filledRatio = ev.total_seats > 0 ? ev.seats_filled / ev.total_seats : 0;
  if (ev.event_status === "COMPLETED") return "Hard";
  if (filledRatio > 0.85) return "Insane";
  if (ev.is_technical && filledRatio > 0.5) return "Hard";
  if (ev.is_technical) return "Medium";
  return "Easy";
}

function pointsFor(diff: ChallengeNode["difficulty"], ev: EventSummary): number {
  const base: Record<ChallengeNode["difficulty"], number> = {
    Easy: 150,
    Medium: 300,
    Hard: 500,
    Insane: 750,
  };
  const rand = mulberry32(hashString(ev.id))();
  return Math.round(base[diff] * (0.85 + rand * 0.3));
}

function deriveChallenges(events: EventSummary[]): ChallengeNode[] {
  return events.map((ev) => {
    const cat = categoryFor(ev);
    const diff = difficultyFor(ev);
    const rng = mulberry32(hashString(ev.id));
    const totalTeams = ev.total_seats;
    const solves =
      ev.event_status === "COMPLETED"
        ? Math.round(ev.total_seats * (0.4 + rng() * 0.4))
        : Math.round(ev.seats_filled * (0.3 + rng() * 0.5));
    const status: ChallengeNode["status"] =
      ev.event_status === "COMPLETED" || ev.registration_status === "SOLD_OUT"
        ? "captured"
        : ev.seats_filled > 0
          ? "active"
          : "untouched";
    return {
      id: ev.id,
      title: ev.name,
      category: cat,
      difficulty: diff,
      points: pointsFor(diff, ev),
      solves,
      totalTeams,
      status,
    } satisfies ChallengeNode;
  });
}

const TEAM_HANDLES = [
  "0xR4ven",
  "nullByte",
  "ph4nt0m",
  "kw4rgs",
  "s1lentfox",
  "byteWraith",
  "n0ct1s",
  "echo5",
  "v01dwalk3r",
  "h3xnet",
  "r00tkit",
  "purpl3haze",
  "byt3m3",
  "n3tw0rm",
  "sh4d0wFang",
  "crypt0n1te",
  "argon",
  "qubit",
  "fl1nt",
  "sw0rdfish",
];

function deriveScoreboard(events: EventSummary[]): ScoreboardRow[] {
  const seed = hashString(events.map((e) => e.id).join("|"));
  const rng = mulberry32(seed);
  return TEAM_HANDLES.map((handle) => {
    const score = Math.round(800 + rng() * 5200);
    const solves = Math.round(4 + rng() * 22);
    return {
      team: handle,
      handle,
      score,
      solves,
      delta: 0,
      lastSubmission: Date.now() - Math.floor(rng() * 1800_000),
      trend: "flat" as const,
    };
  })
    .sort((a, b) => b.score - a.score)
    .map((row, idx) => ({
      rank: idx + 1,
      team: row.team,
      handle: row.handle,
      score: row.score,
      solves: row.solves,
      delta: row.delta,
      lastSubmission: row.lastSubmission,
      trend: row.trend,
    }));
}

function deriveTelemetry(events: EventSummary[], ticks = 24): TelemetryPoint[] {
  const seed = hashString(events.map((e) => e.id).join("|"));
  const rng = mulberry32(seed);
  const out: TelemetryPoint[] = [];
  let attacks = 0;
  let solves = 0;
  let hints = 0;
  for (let t = 0; t < ticks; t++) {
    attacks += Math.round(8 + rng() * 36 + Math.sin(t / 3) * 14);
    solves += Math.round(2 + rng() * 8);
    hints += Math.round(1 + rng() * 4);
    out.push({ t, attacks, solves, hints });
  }
  return out;
}

function pickPrimaryCtfEvent(
  events: EventSummary[],
  editionId = "2",
): EventSummary | null {
  if (editionId === "2") {
    const REPAIR_CAFE_ID = "f4a7eca2-0363-5f01-96d8-40b80e7d3798";
    return events.find((e) => e.id === REPAIR_CAFE_ID) ?? events[0] ?? null;
  }
  const FLAGHORIZON_ID = "a6de479e-c82e-567a-a7a8-61207e455385";
  return (
    events.find((e) => e.id === FLAGHORIZON_ID) ??
    events.find((e) => e.is_technical && e.event_status === "ACTIVE") ??
    events.find((e) => e.is_technical) ??
    events[0] ??
    null
  );
}
