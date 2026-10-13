"use client";

import { useState } from "react";
import { Briefcase, CheckCircle2 } from "lucide-react";

export function SeedStagePitchTimerWidget() {
  const [slideCount, setSlideCount] = useState(7);
  const [interviewCount, setInterviewCount] = useState(6);

  const isSlideCompliant = slideCount <= 8;
  const isInterviewCompliant = interviewCount >= 5;

  return (
    <div className="rounded-2xl border-2 border-emerald-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(16,185,129,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Seed Stage: Venture Pitch & Due Diligence Desk</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] text-emerald-300">
                INNOVATION STUDIO
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              6-minute pitch clock, 5+ customer discovery interviews, and 8-slide PDF deck validator.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          {isSlideCompliant && isInterviewCompliant ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Due Diligence Cleared
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-amber-400">
              Incomplete Verification
            </span>
          )}
        </div>
      </div>

      {/* Pitch & Diligence Inputs */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Customer Discovery Interviews:</span>
            <span className={`font-bold text-sm ${isInterviewCompliant ? "text-emerald-400" : "text-red-400"}`}>
              {interviewCount} / 5 Minimum
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={12}
            value={interviewCount}
            onChange={(e) => setInterviewCount(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-400"
          />
          {!isInterviewCompliant && (
            <div className="mt-1 text-red-400 text-[0.7rem]">
              Must interview at least 5 target campus customers to qualify.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">PDF Pitch Deck Slides:</span>
            <span className={`font-bold text-sm ${isSlideCompliant ? "text-foreground" : "text-red-400"}`}>
              {slideCount} / 8 Slides Max
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={14}
            value={slideCount}
            onChange={(e) => setSlideCount(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-400"
          />
          {!isSlideCompliant && (
            <div className="mt-1 text-red-400 text-[0.7rem]">
              Exceeds the 8-slide pitch deck limit!
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4 flex flex-col justify-between">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Official Stage Clock:</span>
          <div className="mt-1 font-bold text-foreground text-sm">
            6m Pitch + 4m Jury Q&A
          </div>
          <div className="mt-2 text-[0.7rem] text-emerald-400">
            Equity-free cash awards: ₹20k Winner · ₹10k Runner-up.
          </div>
        </div>
      </div>
    </div>
  );
}
