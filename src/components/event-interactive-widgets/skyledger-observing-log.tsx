"use client";

import { useState } from "react";
import { Moon } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const TARGETS = [
  { name: "Saturn & Cassini Division", optics: "8-inch Dobsonian Reflector (120x)", seeing: "Clear / Low Turbulence", note: "Observed subtle golden-yellow disc banding and razor-thin ring shadow across equatorial limb." },
  { name: "Pleiades Star Cluster (M45)", optics: "20x80 Giant Observation Binoculars", seeing: "Excellent Wide-field Transparency", note: "Counted 7 prominent bright blue-white B-type stars surrounded by faint reflection nebulosity." },
  { name: "Lunar Terminator (Crater Tycho)", optics: "4-inch Apochromatic Refractor (80x)", seeing: "High Contrast Shadow Edge", note: "Central mountain peak casting distinct sharp triangular shadow across eastern crater floor." },
];

export function SkyLedgerObservingLogWidget() {
  const [selectedTargetIdx, setSelectedTargetIdx] = useState(0);
  const [isRedLightMode, setIsRedLightMode] = useState(false);
  const play = useAudioCue();

  const target = TARGETS[selectedTargetIdx];

  return (
    <div
      className={`rounded-2xl border-2 transition-colors p-6 backdrop-blur-xl ${
        isRedLightMode
          ? "border-red-600/50 bg-[#140505] shadow-[0_0_35px_rgba(220,38,38,0.2)] text-red-400"
          : "border-indigo-500/30 bg-[#070b16] shadow-[0_0_35px_rgba(99,102,241,0.12)] text-foreground"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Moon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <span>SkyLedger Terrace Astronomical Observation Desk</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[0.65rem] text-indigo-300">
                CAMPUS OBSERVATORY
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Night-vision red-light protection and astronomical observing log sheet.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsRedLightMode(!isRedLightMode);
            play("click");
          }}
          className={`rounded-xl border px-3 py-1 font-mono text-xs font-bold transition-all ${
            isRedLightMode
              ? "border-red-500 bg-red-600 text-black shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              : "border-white/15 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
          }`}
        >
          {isRedLightMode ? "Disable Red Night-Mode" : "Enable Red Night-Mode (Preserve Vision)"}
        </button>
      </div>

      {/* Target Selector */}
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
        {TARGETS.map((t, idx) => (
          <button
            key={t.name}
            type="button"
            onClick={() => {
              setSelectedTargetIdx(idx);
              play("click");
            }}
            className={`rounded-lg border px-3 py-1.5 transition-all ${
              selectedTargetIdx === idx
                ? "border-indigo-400 bg-indigo-500/20 font-bold"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Observation Log Sheet */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/60 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Optical Instrument Used:</span>
          <div className="mt-1 font-bold text-sm">{target.optics}</div>
          <div className="mt-2 text-[0.72rem] text-muted-foreground">Sky Seeing: {target.seeing}</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Telescope Field Notes:</span>
          <div className="mt-1 text-[0.75rem] leading-relaxed italic">
            &ldquo;{target.note}&rdquo;
          </div>
          <div className="mt-2 text-[0.68rem] text-muted-foreground">
            Strict rule: No white phone torches or green laser pointers on the active viewing terrace.
          </div>
        </div>
      </div>
    </div>
  );
}
