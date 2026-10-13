"use client";

import { useState } from "react";
import { Mic, Clock } from "lucide-react";

export function UnmutedSlamClockWidget() {
  const [hasTwoOriginalPoems, setHasTwoOriginalPoems] = useState(true);
  const [contentNote, setContentNote] = useState("Explores hostel displacement and nostalgic childhood monsoons.");

  return (
    <div className="rounded-2xl border-2 border-indigo-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(99,102,241,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Unmuted: Slam Poetry Performance & Stage Clock</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[0.65rem] text-indigo-300">
                COURTYARD ARENA
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              4-minute performance timer (10s grace), 2-poem final qualification, and content note check.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-indigo-300 flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>4:00 Min Limit (+10s Grace)</span>
        </div>
      </div>

      {/* Slam Rule Matrix */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Mandatory Two-Poem Requirement:</span>
          <label className="mt-2 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasTwoOriginalPoems}
              onChange={(e) => setHasTwoOriginalPoems(e.target.checked)}
              className="accent-indigo-400"
            />
            <span className="text-foreground">Two distinct original poems prepared for final</span>
          </label>
          <p className="mt-2 text-[0.72rem] text-muted-foreground leading-relaxed">
            Performers entering finals must recite a fresh original piece; repeating the preliminary poem is disqualified.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Courtyard Content Note:</span>
          <input
            type="text"
            value={contentNote}
            onChange={(e) => setContentNote(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/60 px-3 py-1.5 text-foreground text-[0.75rem] focus:border-indigo-400 focus:outline-none"
          />
          <div className="mt-2 text-[0.68rem] text-muted-foreground">
            Languages Permitted: English, Hindi, Marathi, or natural fluid multilingual blend.
          </div>
        </div>
      </div>
    </div>
  );
}
