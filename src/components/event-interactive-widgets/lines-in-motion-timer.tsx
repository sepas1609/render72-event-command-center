"use client";

import { useState } from "react";
import { PenTool } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function LinesInMotionTimerWidget() {
  const [mediaType, setMediaType] = useState<"traditional" | "digital">("digital");
  const [statement, setStatement] = useState(
    "Observed the dancer's descending pivot in the second sequence; captured rotational torque using continuous gestural graphite arcs across diagonal negative space."
  );
  const play = useAudioCue();

  const wordCount = statement.trim().split(/\s+/).filter(Boolean).length;
  const isStatementValid = wordCount > 0 && wordCount <= 60;

  return (
    <div className="rounded-2xl border-2 border-fuchsia-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(217,70,239,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Lines in Motion: Live Gesture & Statement Desk</span>
              <span className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-[0.65rem] text-fuchsia-300">
                ILLUSTRATION GUILD
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              90-minute observation timer and mandatory 60-word artist statement verifier.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(["digital", "traditional"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMediaType(m);
                play("click");
              }}
              className={`rounded-lg border px-3 py-1 font-mono text-xs uppercase transition-all ${
                mediaType === m
                  ? "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-300 font-bold"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {m === "digital" ? "Offline Tablet" : "Traditional A3"}
            </button>
          ))}
        </div>
      </div>

      {/* 60-word Artist Statement Verifier */}
      <div className="mt-4 font-mono text-xs">
        <div className="flex items-center justify-between text-muted-foreground text-[0.68rem] uppercase">
          <span>Mandatory Artist Statement (Max 60 Words - 10% Rubric):</span>
          <span className={isStatementValid ? "text-fuchsia-300 font-bold" : "text-red-400 font-bold"}>
            {wordCount} / 60 Words
          </span>
        </div>
        <textarea
          rows={3}
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-3 text-foreground text-[0.75rem] leading-relaxed focus:border-fuchsia-400 focus:outline-none"
        />
        {!isStatementValid && (
          <div className="mt-1 text-red-400 text-[0.7rem]">
            Statement exceeds the 60-word limit! Concise identification of observed motion required.
          </div>
        )}
      </div>

      {/* Fair Competition Policy */}
      <div className="mt-4 rounded-xl border border-fuchsia-500/20 bg-black/60 p-4 font-mono text-xs text-muted-foreground space-y-1">
        <div className="text-foreground/90 font-semibold text-[0.72rem]">
          Fair Play & Medium Integrity:
        </div>
        <div>
          - Digital: Must work offline. Generative AI, traced stock photography, and prebuilt brush stamps are strictly prohibited.
        </div>
        <div>
          - Traditional: One official A3 sheet issued; solvent sprays and aerosol fixatives prohibited in shared room.
        </div>
      </div>
    </div>
  );
}
