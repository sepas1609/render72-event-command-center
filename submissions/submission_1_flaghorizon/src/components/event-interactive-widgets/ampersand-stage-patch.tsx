"use client";

import { useState } from "react";
import { Music, Clock } from "lucide-react";

const STAGE_CHANNELS = [
  { ch: "CH 01", name: "Lead Vocal", type: "Shure SM58 / Main PA", phantom: false },
  { ch: "CH 02", name: "Guitar Lead (Left)", type: "Fender Twin Reverb Amp Mic", phantom: false },
  { ch: "CH 03", name: "Bass Guitar", type: "Active Radial DI Box", phantom: true },
  { ch: "CH 04-05", name: "Stereo Synthesizer", type: "Stereo DI Box", phantom: false },
  { ch: "CH 06", name: "Acoustic / Backing Vocal", type: "Shure SM58 / Monitor Mix", phantom: false },
];

export function AmpersandStagePatchWidget() {
  const [minutesRemaining] = useState(12);

  return (
    <div className="rounded-2xl border-2 border-violet-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(139,92,246,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Ampersand Amphitheatre Sound & Set Computer</span>
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[0.65rem] text-violet-300">
                LIVE SOUND DESK
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              12-minute performance countdown and stage patch list coordinator.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs flex items-center gap-2">
          <Clock className="h-4 w-4 text-violet-400" />
          <span className="text-foreground font-bold">{minutesRemaining}m Set Time</span>
        </div>
      </div>

      {/* Input Patch List */}
      <div className="mt-4 font-mono text-xs">
        <div className="text-muted-foreground uppercase text-[0.68rem] pb-2 border-b border-white/10">
          Amphitheatre Stage Patch List & DI Allocation:
        </div>
        <div className="mt-3 space-y-2">
          {STAGE_CHANNELS.map((ch) => (
            <div
              key={ch.ch}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[0.68rem] font-bold text-violet-300">
                  {ch.ch}
                </span>
                <span className="text-foreground font-semibold">{ch.name}</span>
              </div>
              <span className="text-muted-foreground text-[0.72rem]">{ch.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
