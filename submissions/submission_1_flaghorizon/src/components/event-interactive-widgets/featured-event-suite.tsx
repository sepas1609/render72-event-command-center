"use client";

import { useCtfStore } from "@/lib/ctf-store";
import { getActiveEdition } from "@/lib/submission-themes";
import { isFeaturedSubmissionEvent } from "@/lib/featured-events";
import { Sparkles } from "lucide-react";

// Edition 1 Widgets
import { FlagHorizonTerminalWidget } from "./flaghorizon-terminal";
import { CodeCurrentSimulatorWidget } from "./codecurrent-simulator";
import { TrackTactTelemetryWidget } from "./tracktact-telemetry";
import { RagDefensePlaygroundWidget } from "./rag-defense-playground";
import { SpikeCircuitVetoWidget } from "./spikecircuit-veto";
import { RotorRushFlightDeckWidget } from "./rotorrush-flight-deck";

// Edition 2 Widgets
import { SecondLifeRepairTriageWidget } from "./secondlife-repair-triage";
import { PhotoWalkEssayBuilderWidget } from "./photowalk-essay-builder";
import { ChowkRangoliDesignerWidget } from "./chowk-rangoli-designer";
import { ProductTeardownAuditWidget } from "./product-teardown-audit";
import { LinesInMotionTimerWidget } from "./lines-in-motion-timer";
import { PinchPotStudioGuideWidget } from "./pinch-pot-studio-guide";

// Edition 3 Widgets
import { CivicForgeSprintBoardWidget } from "./civicforge-sprint-board";
import { ModelMosaicBiasInspectorWidget } from "./modelmosaic-bias-inspector";
import { AmpersandStagePatchWidget } from "./ampersand-stage-patch";
import { ConcreteCountsBattleClockWidget } from "./concrete-counts-battle-clock";
import { Frame48PromptSandboxWidget } from "./frame48-prompt-sandbox";
import { YesAndImprovGeneratorWidget } from "./yes-and-improv-generator";

// Edition 4 Widgets
import { SpanCraftLoadRigWidget } from "./spancraft-load-rig";
import { LightwearCircuitStudioWidget } from "./lightwear-circuit-studio";
import { SilverShadowDarkroomTimerWidget } from "./silver-shadow-darkroom-timer";
import { GullyGourmetStationAuditWidget } from "./gully-gourmet-station-audit";
import { AccessFirstContrastAuditWidget } from "./accessfirst-contrast-audit";
import { AccessByDesignFormRepairWidget } from "./access-by-design-form-repair";

// Edition 5 Widgets
import { MotionToSpeakDebateClockWidget } from "./motion-to-speak-debate-clock";
import { NrityaRekhaRhythmDeskWidget } from "./nritya-rekha-rhythm-desk";
import { PopQuizTiebreakerBuzzerWidget } from "./pop-quiz-tiebreaker-buzzer";
import { UnmutedSlamClockWidget } from "./unmuted-slam-clock";
import { SeedStagePitchTimerWidget } from "./seed-stage-pitch-timer";
import { SkyLedgerObservingLogWidget } from "./skyledger-observing-log";

interface Props {
  eventId: string;
}

export function FeaturedEventCreativeSuite({ eventId }: Props) {
  const activeEditionId = useCtfStore((s) => s.activeEdition);
  const edition = getActiveEdition(activeEditionId);
  const isHeroInActiveEdition = isFeaturedSubmissionEvent(eventId, activeEditionId);

  // Render widget if it exists for this event
  const renderWidget = () => {
    switch (eventId) {
      // Edition 1
      case "a6de479e-c82e-567a-a7a8-61207e455385":
        return <FlagHorizonTerminalWidget />;
      case "0fdc5427-4be3-59d8-9f17-1d7fc20d515a":
        return <CodeCurrentSimulatorWidget />;
      case "4819d0b0-4b31-527d-ab30-44cf58ed3b11":
        return <TrackTactTelemetryWidget />;
      case "42ba467c-d16a-5498-bcf2-f527bc29f957":
        return <RagDefensePlaygroundWidget />;
      case "6ba46a8b-0197-5ada-873e-aeadddaf57c8":
        return <SpikeCircuitVetoWidget />;
      case "f326be50-5933-5d50-b03b-86270f238b1e":
        return <RotorRushFlightDeckWidget />;

      // Edition 2
      case "f4a7eca2-0363-5f01-96d8-40b80e7d3798":
        return <SecondLifeRepairTriageWidget />;
      case "cb79e7f0-c9fc-55a0-9fa5-e348b8ce64d3":
        return <PhotoWalkEssayBuilderWidget />;
      case "3e0a5c84-eedf-507e-a9e8-3db7a70f9371":
        return <ChowkRangoliDesignerWidget />;
      case "721c1a93-4118-56e8-8cb1-724ef7462243":
        return <ProductTeardownAuditWidget />;
      case "2debc524-b43f-54c5-affd-5246f57a51e7":
        return <LinesInMotionTimerWidget />;
      case "9a5c1819-17d6-5492-bac7-44d80df98f63":
        return <PinchPotStudioGuideWidget />;

      // Edition 3
      case "dff53692-cd0c-5464-9282-d90b791d9ecb":
        return <CivicForgeSprintBoardWidget />;
      case "78401373-ca0f-5f0e-b00c-93bb4e2212ec":
        return <ModelMosaicBiasInspectorWidget />;
      case "d10fc80a-b1dc-56f3-9e21-37ee22f0d98b":
        return <AmpersandStagePatchWidget />;
      case "91242273-2bfd-5f2a-a277-b1754636719a":
        return <ConcreteCountsBattleClockWidget />;
      case "b9148fa1-2795-563d-85a4-68d1f5ffe979":
        return <Frame48PromptSandboxWidget />;
      case "28e534ed-cf8a-5eb6-806c-44c3d61d5d36":
        return <YesAndImprovGeneratorWidget />;

      // Edition 4
      case "6dac7dc2-0d4a-5688-b6bb-323e58d07757":
        return <SpanCraftLoadRigWidget />;
      case "50f647f3-367c-5bac-bcbe-c9e63a072f3d":
        return <LightwearCircuitStudioWidget />;
      case "a3e42d20-6d43-5a11-bb14-e25b6f3ea2d1":
        return <SilverShadowDarkroomTimerWidget />;
      case "e63f2307-8b6f-575e-af50-8ab4fe2e3203":
        return <GullyGourmetStationAuditWidget />;
      case "1b87d482-b95f-519d-9bb7-1a5c5e95a954":
        return <AccessFirstContrastAuditWidget />;
      case "f7cc220d-8035-57a5-9821-aa6fc7635fcb":
        return <AccessByDesignFormRepairWidget />;

      // Edition 5
      case "9f14bfb9-e3ea-54ec-afdf-a1f07d8d17dd":
        return <MotionToSpeakDebateClockWidget />;
      case "1c991a44-7b75-5396-84f3-59f924d11fe4":
        return <NrityaRekhaRhythmDeskWidget />;
      case "757a47ab-3e29-5ed2-936a-87cff1b818a2":
        return <PopQuizTiebreakerBuzzerWidget />;
      case "4a8ba284-612f-545b-be1d-0e271cc97657":
        return <UnmutedSlamClockWidget />;
      case "6aa44f45-fdd2-56a9-a05c-f64dba85bf40":
        return <SeedStagePitchTimerWidget />;
      case "da4774c1-0acb-5caa-a7be-e875e2cc120e":
        return <SkyLedgerObservingLogWidget />;

      default:
        return null;
    }
  };

  const widget = renderWidget();
  if (!widget) return null;

  return (
    <section className="relative my-8 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0a0f1d] to-[#060810] p-1 shadow-2xl">
      {/* Glowing Neon Header Strip */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5 font-mono text-xs">
        <div className="flex items-center gap-2 text-[var(--neon)] font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-[var(--neon)] animate-pulse" />
          <span>Interactive Tactical Sandbox & Dossier Engine</span>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[0.65rem] text-muted-foreground">
          {isHeroInActiveEdition ? `${edition.badgeLabel} HERO` : "INTERACTIVE DOSSIER"}
        </span>
      </div>

      <div className="p-4 sm:p-6">{widget}</div>
    </section>
  );
}
