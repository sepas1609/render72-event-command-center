"use client";

import { useState } from "react";
import { Eye, Keyboard } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function AccessFirstContrastAuditWidget() {
  const [activeContrast, setActiveContrast] = useState<"pass" | "fail">("pass");
  const play = useAudioCue();

  return (
    <div className="rounded-2xl border-2 border-cyan-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(6,182,212,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>AccessFirst: Inclusive Interface Sprint Usability Desk</span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[0.65rem] text-cyan-300">
                DESIGN STUDIO
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Keyboard focus order, WCAG 4.5:1 contrast, and recoverable error state verifier.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(["pass", "fail"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setActiveContrast(c);
                play("click");
              }}
              className={`rounded-lg border px-3 py-1 font-mono text-xs uppercase transition-all ${
                activeContrast === c
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {c === "pass" ? "Compliant (7.2:1 Contrast)" : "Failing (2.4:1 Low Contrast)"}
            </button>
          ))}
        </div>
      </div>

      {/* Focus & Contrast Demo Box */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div
          className={`rounded-xl border p-4 transition-all ${
            activeContrast === "pass"
              ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
              : "border-red-500/30 bg-red-950/20 text-stone-500"
          }`}
        >
          <div className="text-[0.68rem] uppercase font-bold">Live UI Contrast Preview:</div>
          <div className="mt-2 text-base font-bold">
            &ldquo;Reserve Quiet Pod #4 for 2 Hours&rdquo;
          </div>
          <p className="mt-2 text-[0.72rem] leading-relaxed">
            {activeContrast === "pass"
              ? "✓ Contrast ratio 7.2:1 exceeds WCAG AA standards. Clearly legible under low-vision glare."
              : "✗ Contrast ratio 2.4:1 fails WCAG AA standards. Weak grey-on-dark is invisible to users with astigmatism."}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="text-muted-foreground uppercase text-[0.68rem] flex items-center gap-1.5 pb-2 border-b border-white/10">
            <Keyboard className="h-4 w-4 text-cyan-400" /> Keyboard Tab Sequence Verification:
          </div>
          <div className="mt-2 space-y-1.5 text-[0.72rem] text-muted-foreground">
            <div>1. [Tab] → Skip to Main Booking Content</div>
            <div>2. [Tab] → Select Date Input (Aria-expanded)</div>
            <div>3. [Tab] → Time Slot Radio Group (Arrow keys navigation)</div>
            <div>4. [Tab] → Confirm Reservation Button (Focus ring visible)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
