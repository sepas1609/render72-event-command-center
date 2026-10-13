"use client";

import { useState } from "react";
import { Camera, Sun, Sparkles, CheckCircle2, Film, Image as ImageIcon } from "lucide-react";
import confetti from "canvas-confetti";
import { useAudioCue } from "@/hooks/use-audio-cue";

const LIGHTING_PRESETS = [
  {
    id: "blue-hour",
    name: "07:00 AM Blue Mist",
    kelvin: "4800K",
    vibe: "Cool architectural geometry before students wake",
    tint: "from-blue-900/40 to-slate-900/80",
    accent: "text-cyan-300",
  },
  {
    id: "golden-chai",
    name: "07:45 AM Golden Chai Steam",
    kelvin: "3200K",
    vibe: "Warm golden sunlight filtering through canteen steam & banyans",
    tint: "from-amber-800/40 to-amber-950/80",
    accent: "text-amber-300",
  },
  {
    id: "high-contrast",
    name: "08:30 AM Sharp Colonnade Shadows",
    kelvin: "5600K",
    vibe: "Crisp black & white architectural diagonal silhouettes",
    tint: "from-zinc-700/40 to-black/90",
    accent: "text-zinc-200",
  },
];

const STORY_FRAMES = [
  {
    act: "Act I · Dawn Setup",
    title: "The Solitary Bicycle at Physics Portico",
    caption: "Dewdrops clinging to the black handlebars before the first bell.",
  },
  {
    act: "Act II · The Decisive Moment",
    title: "Chai Glasses Clinking at Tapri Corner",
    caption: "Hot cardamom steam catching angled sunbeams through morning banyans.",
  },
  {
    act: "Act III · Quiet Aftermath",
    title: "Open Notebook on Concrete Steps",
    caption: "Graph paper fluttering in the pre-lecture November breeze.",
  },
];

export function PhotoWalkEssayBuilderWidget() {
  const [selectedLightIdx, setSelectedLightIdx] = useState(1);
  const [filmStock, setFilmStock] = useState<"portra" | "fuji" | "ilford">("portra");
  const [developed, setDeveloped] = useState(false);
  const play = useAudioCue();

  const light = LIGHTING_PRESETS[selectedLightIdx];

  const handleDevelop = () => {
    setDeveloped(true);
    play("capture");
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#f59e0b", "#ec4899", "#8b5cf6"],
    });
  };

  return (
    <div className="rounded-2xl border-2 border-amber-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(245,158,11,0.15)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Between Lectures: 35mm Morning Essay Curator</span>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[0.62rem] text-amber-300">
                VISUAL STORYTELLING
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Simulate morning light physics, curate a 3-act campus photo narrative, and develop your exhibition contact sheet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          {(["portra", "fuji", "ilford"] as const).map((stock) => (
            <button
              key={stock}
              type="button"
              onClick={() => {
                setFilmStock(stock);
                play("click");
              }}
              className={`rounded-lg border px-2.5 py-1 uppercase text-[0.68rem] transition-all ${
                filmStock === stock
                  ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {stock === "portra" ? "Portra 400" : stock === "fuji" ? "Fujifilm 400" : "Ilford HP5"}
            </button>
          ))}
        </div>
      </div>

      {/* Daylight Simulator Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {LIGHTING_PRESETS.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setSelectedLightIdx(idx);
              play("click");
            }}
            className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-all flex items-center gap-1.5 ${
              selectedLightIdx === idx
                ? "border-amber-500 bg-amber-500/20 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
            }`}
          >
            <Sun className="h-3 w-3" />
            <span>{p.name} ({p.kelvin})</span>
          </button>
        ))}
      </div>

      {/* Mesmerizing Viewfinder Canvas */}
      <div className={`mt-4 rounded-xl border border-white/15 bg-gradient-to-br ${light.tint} p-4 font-mono text-xs relative overflow-hidden transition-all duration-700`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[0.7rem]">
          <span className="flex items-center gap-1.5 text-foreground/80">
            <Film className="h-3.5 w-3.5 text-amber-400" />
            <span>35mm Format Viewfinder · ISO 400 · f/2.8 · 1/250s</span>
          </span>
          <span className={light.accent}>{light.kelvin} Natural Ambient</span>
        </div>

        {/* 3-Act Narrative Filmstrip */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {STORY_FRAMES.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/15 bg-black/70 p-3.5 relative overflow-hidden group hover:border-amber-400/50 transition-all"
            >
              <div className="flex items-center justify-between text-[0.65rem] text-amber-400 font-bold uppercase tracking-wider mb-2">
                <span>{f.act}</span>
                <span className="text-white/40">#0{i + 1}</span>
              </div>
              <div className="aspect-[4/3] rounded-lg bg-zinc-900 border border-white/10 flex flex-col items-center justify-center p-3 text-center mb-2.5">
                <ImageIcon className="h-6 w-6 text-white/30 mb-1" />
                <span className="text-[0.72rem] font-bold text-foreground line-clamp-1">{f.title}</span>
              </div>
              <p className="text-[0.7rem] text-muted-foreground leading-relaxed font-sans">
                &ldquo;{f.caption}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 text-[0.72rem] text-foreground/80 font-sans flex items-center justify-between">
          <span>Atmosphere: {light.vibe}</span>
          <span className="font-mono text-amber-300">Prompt: &ldquo;Work before the crowd arrives&rdquo;</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleDevelop}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-5 py-2.5 font-mono text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          <Sparkles className="h-4 w-4" />
          <span>{developed ? "Photo-Essay Contact Sheet Developed ✓" : "Develop 3-Image Contact Sheet"}</span>
        </button>

        <div className="font-mono text-xs text-muted-foreground flex items-center gap-2">
          {developed ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Walk Slot Reserved: 08:00 AM Sunday
            </span>
          ) : (
            <span>Solo Entry · Limited to 40 Photographers</span>
          )}
        </div>
      </div>
    </div>
  );
}
