"use client";

import { useState } from "react";
import { Disc } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function ConcreteCountsBattleClockWidget() {
  const [crewSize, setCrewSize] = useState(6);
  const [roundType, setRoundType] = useState<"qualifier" | "finals">("qualifier");
  const play = useAudioCue();

  const isCrewSizeCompliant = crewSize >= 4 && crewSize <= 10;

  return (
    <div className="rounded-2xl border-2 border-fuchsia-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(217,70,239,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
            <Disc className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Concrete Counts Battle Clock & Roster Desk</span>
              <span className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-[0.65rem] text-fuchsia-300">
                BASKETBALL ARENA
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              4-10 dancer roster compliance, 4-6 min qualifier timer, and surprise-track final rule.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(["qualifier", "finals"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRoundType(r);
                play("click");
              }}
              className={`rounded-lg border px-3 py-1 font-mono text-xs uppercase transition-all ${
                roundType === r
                  ? "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-300 font-bold"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {r === "qualifier" ? "Qualifier (4-6m)" : "Finals (3m Track)"}
            </button>
          ))}
        </div>
      </div>

      {/* Roster & Timer Matrix */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Active Performing Crew:</span>
            <span className={`font-bold text-sm ${isCrewSizeCompliant ? "text-emerald-400" : "text-red-400"}`}>
              {crewSize} Dancers
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={12}
            value={crewSize}
            onChange={(e) => setCrewSize(Number(e.target.value))}
            className="mt-3 w-full accent-fuchsia-400"
          />
          {!isCrewSizeCompliant && (
            <div className="mt-2 text-red-400 text-[0.7rem]">
              Must have between 4 and 10 active dancers per official crew clash rules.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="text-muted-foreground uppercase text-[0.68rem]">Official Floor Timing:</div>
          <div className="mt-1 font-bold text-foreground text-sm">
            {roundType === "qualifier" ? "4:00 - 6:00 Minutes" : "Exact 3:00 Minutes Showcase"}
          </div>
          <div className="mt-2 text-muted-foreground text-[0.72rem]">
            Finalists receive common surprise track at 18:25 IST with a 40-minute choreography window.
          </div>
        </div>
      </div>
    </div>
  );
}
