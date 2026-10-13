"use client";

import { useState } from "react";
import { SunMedium } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const TRAYS = [
  { name: "1. Developer Tray", duration: "90s", temp: "20°C ± 1°C", chem: "Ilford Multigrade Developer (1+9)" },
  { name: "2. Stop Bath Tray", duration: "30s", temp: "Room Temp", chem: "Citric acid indicator stop bath" },
  { name: "3. Rapid Fixer", duration: "120s", temp: "Room Temp", chem: "Hypo rapid fixer (Removes unexposed halides)" },
  { name: "4. Archival Water Wash", duration: "300s", temp: "Running Water", chem: "Clean running water rinse" },
];

export function SilverShadowDarkroomTimerWidget() {
  const [activeTrayIdx, setActiveTrayIdx] = useState(0);
  const play = useAudioCue();

  const tray = TRAYS[activeTrayIdx];

  return (
    <div className="rounded-2xl border-2 border-stone-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(168,162,158,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-500/20 text-stone-300">
            <SunMedium className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Silver & Shadow: Darkroom Wet-Process Sequence Desk</span>
              <span className="rounded-full bg-stone-500/20 px-2 py-0.5 text-[0.65rem] text-stone-300">
                MEDIA ARTS DARKROOM
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Enlarger test-strip timing and chemical sequence (Developer → Stop → Fixer → Wash).
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-red-400 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span>Safelight Area Active</span>
        </div>
      </div>

      {/* Tray Sequence Selector */}
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
        {TRAYS.map((t, idx) => (
          <button
            key={t.name}
            type="button"
            onClick={() => {
              setActiveTrayIdx(idx);
              play("click");
            }}
            className={`rounded-lg border px-3 py-1.5 transition-all ${
              activeTrayIdx === idx
                ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Tray Specs */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Submersion Duration:</span>
          <div className="mt-1 font-bold text-amber-400 text-base">{tray.duration}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Bath Temperature:</span>
          <div className="mt-1 font-bold text-foreground text-sm">{tray.temp}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Chemical Solution:</span>
          <div className="mt-1 font-semibold text-stone-300 text-[0.72rem] leading-snug">{tray.chem}</div>
        </div>
      </div>
    </div>
  );
}
