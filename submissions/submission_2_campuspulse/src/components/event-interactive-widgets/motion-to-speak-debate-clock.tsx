"use client";

import { useState } from "react";
import { MessageSquare, Bell } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function MotionToSpeakDebateClockWidget() {
  const [speakerType, setSpeakerType] = useState<"substantive" | "reply">("substantive");
  const play = useAudioCue();

  return (
    <div className="rounded-2xl border-2 border-indigo-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(99,102,241,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Motion to Speak: Asian Parliamentary Timekeeper & POI Bell</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[0.65rem] text-indigo-300">
                PARLIAMENTARY DESK
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Simplified 2-person Asian Parliamentary clock with POI open/close bell markers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {(["substantive", "reply"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSpeakerType(s);
                play("click");
              }}
              className={`rounded-lg border px-3 py-1 uppercase transition-all ${
                speakerType === s
                  ? "border-indigo-400 bg-indigo-500/20 text-indigo-300 font-bold"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {s === "substantive" ? "Substantive Speech (5m)" : "Reply Speech (3m)"}
            </button>
          ))}
        </div>
      </div>

      {/* Speech Rule Protocol */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Official Speech Duration:</span>
          <div className="mt-1 font-bold text-indigo-400 text-sm">
            {speakerType === "substantive" ? "5:00 Minutes per Speaker" : "3:00 Minutes Reply (Opposition First)"}
          </div>
          <p className="mt-2 text-muted-foreground text-[0.72rem] leading-relaxed">
            Preparation lasts 20 minutes with paper notes only. Internet, outside coaching, and messaging prohibited.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="text-muted-foreground uppercase text-[0.68rem] flex items-center gap-1.5 pb-2 border-b border-white/10">
            <Bell className="h-4 w-4 text-amber-400" /> Point of Information (POI) Window:
          </div>
          <div className="mt-2 space-y-1 text-[0.72rem] text-muted-foreground">
            <div>- Minute 0:00 - 1:00: Protected Time (Single bell at 1:00)</div>
            <div>- Minute 1:00 - 4:00: <strong className="text-emerald-400">POIs Permitted</strong> (Must not exceed 15s)</div>
            <div>- Minute 4:00 - 5:00: Protected Time (Single bell at 4:00, double at 5:00)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
