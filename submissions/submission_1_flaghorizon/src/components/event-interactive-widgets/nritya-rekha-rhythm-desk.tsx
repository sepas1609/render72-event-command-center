"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function NrityaRekhaRhythmDeskWidget() {
  const [classicalForm, setClassicalForm] = useState<"bharatanatyam" | "kathak">("bharatanatyam");
  const play = useAudioCue();

  return (
    <div className="rounded-2xl border-2 border-rose-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(244,63,94,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Nritya Rekha Classical Solo Timing & Stage Desk</span>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[0.65rem] text-rose-300">
                STUDIO THEATRE
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              45-second spoken prologue timer, 6-8 minute solo dance rule, and wooden stage floor protection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {(["bharatanatyam", "kathak"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setClassicalForm(f);
                play("click");
              }}
              className={`rounded-lg border px-3 py-1 uppercase transition-all ${
                classicalForm === f
                  ? "border-rose-400 bg-rose-500/20 text-rose-300 font-bold"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {f === "bharatanatyam" ? "Bharatanatyam" : "Kathak"}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Breakdown */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Stage Protocol Breakdown:</span>
          <div className="mt-2 space-y-1.5 text-[0.72rem] text-muted-foreground">
            <div>1. Spoken Context / Sahitya Note: <strong className="text-foreground">Max 45 seconds</strong></div>
            <div>2. Timed Solo Performance: <strong className="text-rose-400">6:00 - 8:00 Minutes</strong></div>
            <div>3. Audio: Labelled backing track playback via studio sound console.</div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="text-muted-foreground uppercase text-[0.68rem] pb-2 border-b border-white/10">
            Stage Wooden Floor Regulations:
          </div>
          <div className="mt-2 space-y-1 text-[0.72rem] text-muted-foreground">
            <div>- Strictly no loose flower petals or decorative powder.</div>
            <div>- No lit diya lamps or open flames on wooden surface.</div>
            <div>- Practice ghungroo checked for secure lacing before entrance.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
