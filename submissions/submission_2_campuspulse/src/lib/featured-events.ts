import { SUBMISSION_EDITIONS } from "./submission-themes";

export const FEATURED_CREATIVE_EVENT_IDS = SUBMISSION_EDITIONS["1"].featuredEventIds;

export function isFeaturedSubmissionEvent(eventId: string, edition = "1"): boolean {
  const current = SUBMISSION_EDITIONS[edition] || SUBMISSION_EDITIONS["1"];
  return current.featuredEventIds.includes(eventId);
}

export function getFeaturedEventsForEdition(edition = "1"): string[] {
  return SUBMISSION_EDITIONS[edition]?.featuredEventIds || FEATURED_CREATIVE_EVENT_IDS;
}
