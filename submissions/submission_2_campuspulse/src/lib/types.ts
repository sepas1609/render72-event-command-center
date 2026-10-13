/**
 * FlagHorizon — Render72 Events API schema (verbatim from API spec).
 * Source of truth: https://render72.pages.dev/api/test/events
 * These types are intentionally exhaustive to support both the summary list
 * response and the extended detail response.
 */

export type EventType = "EVENT" | "WORKSHOP";
export type EventMode = "OFFLINE" | "ONLINE";
export type EventStatus = "ACTIVE" | "COMPLETED" | "CLOSED";
export type RegistrationStatus = "OPEN" | "CLOSED" | "SOLD_OUT";

export interface ScheduleSummary {
  start_date: string; // YYYY-MM-DD
  start_time: string; // 24-hour HH:MM
  end_date: string; // YYYY-MM-DD
  end_time: string; // 24-hour HH:MM
}

/** Present in both list and detail responses */
export interface EventSummary {
  id: string;
  name: string;
  blurb: string;
  cover_image_url: string;
  cover_image_alt: string;
  category: string;
  tags: string[];
  event_type: EventType;
  event_mode: EventMode;
  event_status: EventStatus;
  is_featured: boolean;
  is_technical: boolean;
  price: number; // INR, whole rupees
  is_per_head: boolean;
  min_teamsize: number;
  max_teamsize: number;
  total_seats: number;
  seats_filled: number;
  registration_status: RegistrationStatus;
  registration_deadline: string; // ISO 8601 with IST offset
  schedule_summary: ScheduleSummary;
}

export interface Prize {
  rank: number;
  title: string;
  amount: number; // INR
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ScheduleSession {
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
}

export interface Organizer {
  id: string;
  name: string;
  org_type: string;
}

export interface Coordinator {
  id: string;
  name: string;
  role: string;
  contact: string;
}

/** Extended detail fields (only present in GET /api/test/events/{id}) */
export interface EventDetail extends EventSummary {
  description: string; // Paragraphs separated by \n\n
  banner_image_url: string;
  banner_image_alt: string;
  gallery_images: string[];
  highlights: string[];
  what_to_expect: string[];
  eligibility: string[];
  prerequisites: string[];
  rules: string[];
  prizes: Prize[];
  faqs: FAQ[];
  schedules: ScheduleSession[];
  organizers: Organizer[];
  coordinators: Coordinator[];
}

export interface EventsListResponse {
  events: EventSummary[];
}

export interface EventDetailResponse {
  event: EventDetail;
}

export interface ApiError {
  error: string; // machine-readable code, e.g. "not_found"
  message: string; // human-readable explanation
}

/* ------------------------------------------------------------------ */
/* FlagHorizon CTF domain layer — derives CTF-themed signals from the */
/* events payload without inventing data the API does not provide.    */
/* ------------------------------------------------------------------ */

export type ChallengeCategory =
  | "Web Security"
  | "Digital Forensics"
  | "Cryptography"
  | "Reverse Engineering"
  | "Algorithms"
  | "Hardware"
  | "Open Intel";

export interface ChallengeNode {
  id: string;
  title: string;
  category: ChallengeCategory;
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  points: number;
  solves: number;
  totalTeams: number;
  status: "untouched" | "active" | "captured";
}

export interface ScoreboardRow {
  rank: number;
  team: string;
  handle: string;
  score: number;
  solves: number;
  delta: number; // +/- vs previous tick
  lastSubmission: number; // unix ms
  trend: "up" | "down" | "flat";
}

export interface TelemetryPoint {
  t: number; // tick
  attacks: number; // attempts blocked
  solves: number; // flags captured
  hints: number; // hints requested
}
