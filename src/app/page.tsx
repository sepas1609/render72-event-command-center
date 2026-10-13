"use client";

import { useMemo } from "react";
import { Nav } from "@/components/nav";
import { LiveTicker } from "@/components/live-ticker";
import { Hero } from "@/components/hero";
import { CommandCenter } from "@/components/command-center";
import { Scoreboard } from "@/components/scoreboard";
import { SquadBuilder } from "@/components/squad-builder";
import { MissionGrid } from "@/components/mission-grid";
import { MissionBriefing } from "@/components/mission-briefing";
import { SandboxWidget } from "@/components/sandbox-widget";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { useEvents } from "@/hooks/use-events";
import { deriveScoreboard, pickPrimaryCtfEvent } from "@/lib/api";

export default function Home() {
  const { data, isLoading, isError, refetch } = useEvents();
  const events = useMemo(() => data ?? [], [data]);

  const primary = useMemo(() => pickPrimaryCtfEvent(events), [events]);
  const scoreboard = useMemo(() => deriveScoreboard(events), [events]);
  const activeEvents = useMemo(
    () => events.filter((e) => e.event_status === "ACTIVE").length,
    [events],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--neon)] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-[var(--primary-foreground)]"
      >
        Skip to content
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

      {/* Global modal — opens when a card/defense node is clicked */}
      <MissionBriefing />
    </div>
  );
}
