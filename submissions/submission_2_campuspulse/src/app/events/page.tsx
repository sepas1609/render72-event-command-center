import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import { EventsMatrixClient } from "./events-client";

export const metadata: Metadata = {
  title: "Events Matrix | FlagHorizon Sentinel",
  description:
    "Explore all 30 campus competitions, capture-the-flag arenas, workshops, and cultural showcases with real-time seat tracking and schedules.",
  openGraph: {
    title: "Events Matrix — FlagHorizon Sentinel",
    description: "Full directory of 30 campus events with live registration and seat metrics.",
  },
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-transparent pt-8 pb-20">
      <EventsMatrixClient initialEvents={events} />
    </main>
  );
}
