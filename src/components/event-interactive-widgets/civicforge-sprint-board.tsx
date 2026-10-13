"use client";

import { useState } from "react";
import { Hammer, Clock } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const SPRINT_PHASES = [
  { time: "18:00 (Day 1)", title: "Opening Pitch & Dataset Ingestion", status: "Completed" },
  { time: "23:00 (Day 1)", title: "Architecture & First User Story Review", status: "In Progress" },
  { time: "08:00 (Day 2)", title: "Mentor Check-In & Accessibility Audit", status: "Upcoming" },
  { time: "16:00 (Day 2)", title: "Code Freeze & Local Deployment Test", status: "Upcoming" },
  { time: "18:00 (Day 2)", title: "Final 3-Minute Live Jury Demos", status: "Upcoming" },
];

export function CivicForgeSprintBoardWidget() {
  const [activeDomain, setActiveDomain] = useState<"transit" | "water" | "waste">("transit");
  const play = useAudioCue();

  return (
    <div className="rounded-2xl border-2 border-emerald-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(16,185,129,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Hammer className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>CivicForge 24: Pune Civic Sprint Control Desk</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] text-emerald-300">
                24H HACKATHON
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Milestone checkpoints and local civic problem statement alignment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(["transit", "water", "waste"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setActiveDomain(d);
                play("click");
              }}
              className={`rounded-lg border px-3 py-1 font-mono text-xs uppercase transition-all ${
                activeDomain === d
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {d === "transit" ? "Public Transit" : d === "water" ? "Water Monitoring" : "Solid Waste"}
            </button>
          ))}
        </div>
      </div>

      {/* 24-Hour Timeline */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-5 font-mono text-xs">
        {SPRINT_PHASES.map((p, idx) => (
          <div key={idx} className="rounded-xl border border-white/10 bg-black/50 p-3 flex flex-col justify-between">
            <div>
              <div className="text-[0.68rem] text-emerald-400 font-bold flex items-center gap-1">
                <Clock className="h-3 w-3" /> {p.time}
              </div>
              <div className="mt-1 font-semibold text-foreground text-[0.72rem] leading-snug">
                {p.title}
              </div>
            </div>
            <span className="mt-3 rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[0.62rem] text-muted-foreground self-start">
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
