"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { LiveTicker } from "@/components/live-ticker";
import { Hero } from "@/components/hero";
import { MissionGrid } from "@/components/mission-grid";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { useEvents } from "@/hooks/use-events";
import { deriveScoreboard, pickPrimaryCtfEvent } from "@/lib/api";
import { useCtfStore } from "@/lib/ctf-store";
import type { EventSummary } from "@/lib/types";

// Below-the-fold heavy dynamic components loaded asynchronously to achieve 0ms TBT and 95+ Mobile/Desktop Lighthouse
const CommandCenter = dynamic(
  () => import("@/components/command-center").then((m) => m.CommandCenter),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-64 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
      </div>
    ),
  },
);

const Scoreboard = dynamic(
  () => import("@/components/scoreboard").then((m) => m.Scoreboard),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-48 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
      </div>
    ),
  },
);

const SquadBuilder = dynamic(
  () => import("@/components/squad-builder").then((m) => m.SquadBuilder),
  {
    ssr: false,
  },
);

const SandboxWidget = dynamic(
  () => import("@/components/sandbox-widget").then((m) => m.SandboxWidget),
  {
    ssr: false,
  },
);

const MissionBriefing = dynamic(
  () => import("@/components/mission-briefing").then((m) => m.MissionBriefing),
  {
    ssr: false,
  },
);

export function HomeClient({ initialEvents }: { initialEvents: EventSummary[] }) {
  const { data, isLoading, isError, refetch } = useEvents({
    initialData: initialEvents,
  });

  const events = useMemo(
    () => (data && data.length > 0 ? data : initialEvents),
    [data, initialEvents],
  );

  const activeEdition = useCtfStore((s) => s.activeEdition);
  const primary = useMemo(
    () => pickPrimaryCtfEvent(events, activeEdition),
    [events, activeEdition],
  );
  const scoreboard = useMemo(() => deriveScoreboard(events), [events]);
  const activeEvents = useMemo(
    () => events.filter((e) => e.event_status === "ACTIVE").length,
    [events],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#00FF9F] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-black focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Nav />
      {events.length > 0 && <LiveTicker events={events} />}

      <main id="main" className="flex-1">
        <ErrorBoundary label="hero">
          <Hero
            primaryEvent={primary}
            totalEvents={events.length}
            activeEvents={activeEvents}
          />
        </ErrorBoundary>

        {events.length > 0 && (
          <ErrorBoundary label="command-center">
            <CommandCenter events={events} scoreboard={scoreboard} />
          </ErrorBoundary>
        )}

        <ErrorBoundary label="scoreboard">
          <Scoreboard initialRows={scoreboard} />
        </ErrorBoundary>

        <ErrorBoundary label="squad-builder">
          <SquadBuilder />
        </ErrorBoundary>

        <ErrorBoundary label="missions">
          <MissionGrid
            events={events}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => void refetch()}
          />
        </ErrorBoundary>

        <ErrorBoundary label="sandbox">
          <SandboxWidget />
        </ErrorBoundary>

        <Faq />
      </main>

      <Footer />

      {/* Global modal — opens when a card or defense node is clicked */}
      <MissionBriefing />
    </div>
  );
}
