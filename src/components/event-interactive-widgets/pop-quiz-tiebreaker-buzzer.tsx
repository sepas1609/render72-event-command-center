"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

export function PopQuizTiebreakerBuzzerWidget() {
  const [correctPrelimCount, setCorrectPrelimCount] = useState(24);
  const [starredCount, setStarredCount] = useState(5);

  return (
    <div className="rounded-2xl border-2 border-indigo-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(99,102,241,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Screen, Stream & Stadium: Pop Culture Scoring Engine</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[0.65rem] text-indigo-300">
                QUIZ DESK
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Written preliminary tiebreakers and top-8 pounce-and-bounce final scoring.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          <span className="text-muted-foreground">Top-8 Cutoff Status:</span>{" "}
          <span className="text-emerald-400 font-bold">
            {correctPrelimCount >= 22 ? "QUALIFIED FOR FINALS" : "RESERVE POOL"}
          </span>
        </div>
      </div>

      {/* Preliminary Scoring Calculator */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Prelim Score (/30):</span>
            <span className="font-bold text-foreground text-sm">{correctPrelimCount} pts</span>
          </div>
          <input
            type="range"
            min={10}
            max={30}
            value={correctPrelimCount}
            onChange={(e) => setCorrectPrelimCount(Number(e.target.value))}
            className="mt-3 w-full accent-indigo-400"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Starred Tiebreakers:</span>
            <span className="font-bold text-indigo-400 text-sm">{starredCount} / 6 Starred</span>
          </div>
          <input
            type="range"
            min={0}
            max={6}
            value={starredCount}
            onChange={(e) => setStarredCount(Number(e.target.value))}
            className="mt-3 w-full accent-indigo-400"
          />
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-black/50 p-4 flex flex-col justify-between">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Stage Final Rules:</span>
          <div className="mt-1 text-[0.72rem] text-muted-foreground">
            Pounce (+10 / -10 pts) · Direct (+10 pts) · Passed Bounce (+5 pts, no penalty).
          </div>
        </div>
      </div>
    </div>
  );
}
