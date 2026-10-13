import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: "FlagHorizon — Campus Capture the Flag Command Center",
  description:
    "FlagHorizon is a jeopardy-style campus Capture the Flag command center with live telemetry, an interactive defense map, dynamic scoring, and the full Render72 events board.",
};

export default async function Home() {
  const initialEvents = await getEvents();

  return <HomeClient initialEvents={initialEvents} />;
}
