import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: "CampusPulse 360 — Spatial Campus Day-Planner & Festival Hub",
  description:
    "CampusPulse 360 is an immersive spatial campus day-planner with interactive venue heatmaps, conflict-free multi-track scheduling, and 6 bespoke creative arts ateliers across 30 campus events.",
};

export default async function Home() {
  const initialEvents = await getEvents();

  return <HomeClient initialEvents={initialEvents} />;
}
