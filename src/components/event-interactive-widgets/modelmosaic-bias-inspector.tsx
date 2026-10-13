"use client";

import { useState } from "react";
import { Scale, CheckCircle2 } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function ModelMosaicBiasInspectorWidget() {
  const [activeLang, setActiveLang] = useState<"mr" | "hi" | "en">("mr");
  const play = useAudioCue();

  const metrics = {
    mr: { name: "Marathi Inquiries", accuracy: "91.4%", disparity: "1.2% (Fair)", passes: true },
    hi: { name: "Hindi Inquiries", accuracy: "93.1%", disparity: "0.8% (Fair)", passes: true },
    en: { name: "English Inquiries", accuracy: "94.8%", disparity: "0.4% (Fair)", passes: true },
  };

  const curr = metrics[activeLang];

  return (
    <div className="rounded-2xl border-2 border-emerald-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(16,185,129,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>ModelMosaic Responsible AI Disparity Inspector</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] text-emerald-300">
                FAIRNESS BENCH
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Multilingual helpdesk fairness evaluation across regional language partitions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {(["mr", "hi", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setActiveLang(l);
                play("click");
              }}
              className={`rounded-lg border px-3 py-1 uppercase transition-all ${
                activeLang === l
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {l === "mr" ? "Marathi" : l === "hi" ? "Hindi" : "English"}
            </button>
          ))}
        </div>
      </div>

      {/* Fairness Metrics */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Dataset Partition:</span>
          <div className="mt-1 font-bold text-foreground text-sm">{curr.name}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">F1-Score / Accuracy:</span>
          <div className="mt-1 font-bold text-emerald-400 text-sm">{curr.accuracy}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Equalized Odds Disparity:</span>
          <div className="mt-1 font-bold text-foreground text-sm flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{curr.disparity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
