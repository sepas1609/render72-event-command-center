export const FEATURED_CREATIVE_EVENT_IDS = [
  "a6de479e-c82e-567a-a7a8-61207e455385", // FlagHorizon: Campus Capture the Flag
  "0fdc5427-4be3-59d8-9f17-1d7fc20d515a", // CodeCurrent: Monsoon Algorithm Round
  "4819d0b0-4b31-527d-ab30-44cf58ed3b11", // TrackTact: Autonomous Line-Follower Arena
  "42ba467c-d16a-5498-bcf2-f527bc29f957", // Grounded Answers: Build Your First RAG Assistant
  "6ba46a8b-0197-5ada-873e-aeadddaf57c8", // SpikeCircuit: VALORANT Campus Cup
  "f326be50-5933-5d50-b03b-86270f238b1e", // RotorRush: Netted Drone Time Trial
];

export function isFeaturedSubmissionEvent(eventId: string): boolean {
  return FEATURED_CREATIVE_EVENT_IDS.includes(eventId);
}
