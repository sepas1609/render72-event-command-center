"use client";

import { FlagHorizonTerminalWidget } from "./flaghorizon-terminal";
import { CodeCurrentSimulatorWidget } from "./codecurrent-simulator";
import { TrackTactTelemetryWidget } from "./tracktact-telemetry";
import { RagDefensePlaygroundWidget } from "./rag-defense-playground";
import { SpikeCircuitVetoWidget } from "./spikecircuit-veto";
import { RotorRushFlightDeckWidget } from "./rotorrush-flight-deck";
import { Sparkles } from "lucide-react";
import { isFeaturedSubmissionEvent } from "@/lib/featured-events";

interface Props {
  eventId: string;
}

export function FeaturedEventCreativeSuite({ eventId }: Props) {
  if (!isFeaturedSubmissionEvent(eventId)) {
    return null;
  }

  return (
    <section className="relative my-8 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0a0f1d] to-[#060810] p-1 shadow-2xl">
      {/* Glowing Neon Header Strip */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5 font-mono text-xs">
        <div className="flex items-center gap-2 text-[var(--neon)] font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-[var(--neon)] animate-pulse" />
          <span>Sentinel Classified Interactive Simulator</span>
        </div>
        <span className="rounded-full border border-[var(--neon)]/30 bg-[var(--neon)]/10 px-2.5 py-0.5 text-[0.65rem] text-[var(--neon)]">
          SUBMISSION 1 HERO FEATURE
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {eventId === "a6de479e-c82e-567a-a7a8-61207e455385" && <FlagHorizonTerminalWidget />}
        {eventId === "0fdc5427-4be3-59d8-9f17-1d7fc20d515a" && <CodeCurrentSimulatorWidget />}
        {eventId === "4819d0b0-4b31-527d-ab30-44cf58ed3b11" && <TrackTactTelemetryWidget />}
        {eventId === "42ba467c-d16a-5498-bcf2-f527bc29f957" && <RagDefensePlaygroundWidget />}
        {eventId === "6ba46a8b-0197-5ada-873e-aeadddaf57c8" && <SpikeCircuitVetoWidget />}
        {eventId === "f326be50-5933-5d50-b03b-86270f238b1e" && <RotorRushFlightDeckWidget />}
      </div>
    </section>
  );
}
