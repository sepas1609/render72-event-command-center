export interface SubmissionEdition {
  id: string;
  number: number;
  name: string;
  tagline: string;
  themeDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  accentColor: string;
  badgeLabel: string;
  featuredEventIds: string[];
}

export const SUBMISSION_EDITIONS: Record<string, SubmissionEdition> = {
  "1": {
    id: "flaghorizon",
    number: 1,
    name: "FlagHorizon Sentinel",
    tagline: "Cyber Arena & War-Room OS",
    themeDescription: "High-assurance cybersecurity command center with matrix telemetry, exploit sandboxes, and autonomous robotics grids.",
    heroHeadline: "Campus Defense & Capture The Flag Command Center",
    heroSubheadline: "Track live exploit payloads, analyze autonomous hardware arenas, and deploy student security squads across 30 verified campus operations.",
    accentColor: "#00ff9f",
    badgeLabel: "CYBER OPS EDITION",
    featuredEventIds: [
      "a6de479e-c82e-567a-a7a8-61207e455385", // FlagHorizon: Campus Capture the Flag
      "0fdc5427-4be3-59d8-9f17-1d7fc20d515a", // CodeCurrent: Monsoon Algorithm Round
      "4819d0b0-4b31-527d-ab30-44cf58ed3b11", // TrackTact: Autonomous Line-Follower Arena
      "42ba467c-d16a-5498-bcf2-f527bc29f957", // Grounded Answers: Build Your First RAG Assistant
      "6ba46a8b-0197-5ada-873e-aeadddaf57c8", // SpikeCircuit: VALORANT Campus Cup
      "f326be50-5933-5d50-b03b-86270f238b1e", // RotorRush: Netted Drone Time Trial
    ],
  },
  "2": {
    id: "campuspulse",
    number: 2,
    name: "CampusPulse 360",
    tagline: "Spatial Festival & Day-Planner",
    themeDescription: "Sunset Aurora & Electric Amethyst spatial festival hub with interactive venue heatmaps, itinerary conflict solvers, and creative arts ateliers.",
    heroHeadline: "CampusPulse 360: Spatial Festival & Multi-Track Planner",
    heroSubheadline: "Synchronize your weekend across 30 campus happenings with zero itinerary collisions, studio repair workflows, and visual storytelling expeditions.",
    accentColor: "#a855f7",
    badgeLabel: "SPATIAL FESTIVAL EDITION",
    featuredEventIds: [
      "f4a7eca2-0363-5f01-96d8-40b80e7d3798", // Second Life: Campus Repair Café
      "cb79e7f0-c9fc-55a0-9fa5-e348b8ce64d3", // Between Lectures: Campus Photo Walk
      "3e0a5c84-eedf-507e-a9e8-3db7a70f9371", // Chowk & Colour: Rangoli Duet
      "721c1a93-4118-56e8-8cb1-724ef7462243", // Under the Interface: Product Teardown Lab
      "2debc524-b43f-54c5-affd-5246f57a51e7", // Lines in Motion: Live Illustration Jam
      "9a5c1819-17d6-5492-bac7-44d80df98f63", // Earth in Your Hands: Pinch-Pot Studio
    ],
  },
  "3": {
    id: "hackwave",
    number: 3,
    name: "HackWave Arena",
    tagline: "Competitive Clash & 24h Hackathon Ops",
    themeDescription: "High-octane competitive clash arena with 24-hour sprint milestone trackers, AI model benchmark boards, live band stage patch bays, and dance battle timing clocks.",
    heroHeadline: "HackWave Arena: High-Stakes Hackathon & Esports Coliseum",
    heroSubheadline: "Powering 24-hour civic builds, fair AI evaluations, live amphitheatre soundchecks, and 48-hour filmmaking sprint deadlines.",
    accentColor: "#22c55e",
    badgeLabel: "COMPETITIVE CLASH EDITION",
    featuredEventIds: [
      "dff53692-cd0c-5464-9282-d90b791d9ecb", // CivicForge 24: Build for the City
      "78401373-ca0f-5f0e-b00c-93bb4e2212ec", // ModelMosaic: The Responsible AI Challenge
      "d10fc80a-b1dc-56f3-9e21-37ee22f0d98b", // Ampersand: Battle of the Bands
      "91242273-2bfd-5f2a-a277-b1754636719a", // Concrete Counts: Street Dance Crew Clash
      "b9148fa1-2795-563d-85a4-68d1f5ffe979", // Frame / Forty-Eight: Short Film Sprint
      "28e534ed-cf8a-5eb6-806c-44c3d61d5d36", // Yes, And: Campus Improv Cup
    ],
  },
  "4": {
    id: "makermatrix",
    number: 4,
    name: "MakerMatrix Studio",
    tagline: "Physical Computing & Inclusive Innovation",
    themeDescription: "Industrial Cyberpunk maker guild tracking wearable Arduino circuits, structural truss load testing rigs, analogue darkrooms, and accessible UI audits.",
    heroHeadline: "MakerMatrix Studio: Hardware, Materials & Inclusive Web",
    heroSubheadline: "Where wearable electronics meet structural civil test rigs, chemical darkroom safety trays, and WCAG accessibility repairs.",
    accentColor: "#06b6d4",
    badgeLabel: "MAKER & INCLUSION EDITION",
    featuredEventIds: [
      "50f647f3-367c-5bac-bcbe-c9e63a072f3d", // Lightwear: Arduino Wearable Studio
      "6dac7dc2-0d4a-5688-b6bb-323e58d07757", // SpanCraft: Lightweight Bridge Challenge
      "a3e42d20-6d43-5a11-bb14-e25b6f3ea2d1", // Silver & Shadow: Analogue Darkroom Lab
      "e63f2307-8b6f-575e-af50-8ab4fe2e3203", // Gully Gourmet: Street-Food Cookoff
      "1b87d482-b95f-519d-9bb7-1a5c5e95a954", // AccessFirst: The Inclusive Interface Sprint
      "f7cc220d-8035-57a5-9821-aa6fc7635fcb", // Access by Design: Inclusive App Workshop
    ],
  },
  "5": {
    id: "polymath",
    number: 5,
    name: "Polymath Conclave",
    tagline: "Arts, Debate, Thought & Celestial Nights",
    themeDescription: "Cosmic Indigo and Starlight Gold intellectual forum with parliamentary debate timers, classical solo dance rhythm meters, venture pitch checklists, and terrace telescope logs.",
    heroHeadline: "Polymath Conclave: Discourse, Performance & Astronomy",
    heroSubheadline: "Defend surprise parliamentary motions, experience classical Kathak footwork, validate venture unit economics, and navigate the November night sky.",
    accentColor: "#6366f1",
    badgeLabel: "POLYMATH CONCLAVE EDITION",
    featuredEventIds: [
      "9f14bfb9-e3ea-54ec-afdf-a1f07d8d17dd", // Motion to Speak: Parliamentary Debate Open
      "1c991a44-7b75-5396-84f3-59f924d11fe4", // Nritya Rekha: Classical Solo Showcase
      "757a47ab-3e29-5ed2-936a-87cff1b818a2", // Screen, Stream & Stadium: The India Pop Quiz
      "4a8ba284-612f-545b-be1d-0e271cc97657", // Unmuted: Student Slam Poetry
      "6aa44f45-fdd2-56a9-a05c-f64dba85bf40", // Seed Stage: The Campus Venture Pitch
      "da4774c1-0acb-5caa-a7be-e875e2cc120e", // SkyLedger: A Guided Observing Night
    ],
  },
};

export const ALL_30_EVENT_IDS = Object.values(SUBMISSION_EDITIONS).flatMap(
  (s) => s.featuredEventIds,
);

export function getActiveEdition(idOrNumber = "1"): SubmissionEdition {
  return SUBMISSION_EDITIONS[idOrNumber] || SUBMISSION_EDITIONS["1"];
}
