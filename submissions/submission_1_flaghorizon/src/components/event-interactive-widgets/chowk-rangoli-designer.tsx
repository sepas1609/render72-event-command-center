"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const COLOR_PALETTE = [
  { name: "Turquoise River", hex: "#06b6d4" },
  { name: "Earthen Ochre", hex: "#f59e0b" },
  { name: "Deep Sindoor", hex: "#ef4444" },
  { name: "Forest Moss", hex: "#10b981" },
  { name: "Lotus Rose", hex: "#ec4899" },
  { name: "Base White Powder", hex: "#f8fafc" },
];

export function ChowkRangoliDesignerWidget() {
  const [activeThemeConcept, setActiveThemeConcept] = useState("Riparian Memory: Flowing Sacred Riverbeds");
  const [selectedColors, setSelectedColors] = useState<string[]>(["#06b6d4", "#f59e0b", "#10b981"]);
  const [naturalAdditions, setNaturalAdditions] = useState({
    marigoldPetals: true,
    riceGrains: true,
    mangoLeaves: false,
  });
  const play = useAudioCue();

  return (
    <div className="rounded-2xl border-2 border-rose-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(244,63,94,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Chowk & Colour 1.5m² Rangoli Duet Studio</span>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[0.65rem] text-rose-300">
                FOLK ARTS ATELIER
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Boundary constraint checker (1.5 m × 1.5 m) and biodegradable natural materials calculator.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Boundary: <span className="text-foreground font-bold">1.5m × 1.5m</span> · Fee: <span className="text-rose-400 font-bold">₹200/duo</span>
        </div>
      </div>

      {/* Theme Concept */}
      <div className="mt-4 font-mono text-xs">
        <label className="text-muted-foreground uppercase text-[0.68rem]">
          Theme Statement (Theme: &ldquo;Water, Memory, Tomorrow&rdquo; - 35% Weight):
        </label>
        <input
          type="text"
          value={activeThemeConcept}
          onChange={(e) => setActiveThemeConcept(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-foreground font-semibold focus:border-rose-400 focus:outline-none"
        />
      </div>

      {/* Palette & Natural Additions */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="text-muted-foreground uppercase text-[0.68rem] pb-2 border-b border-white/10">
            Standard Six-Color Dry Palette:
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {COLOR_PALETTE.map((c) => {
              const active = selectedColors.includes(c.hex);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    if (active) setSelectedColors(selectedColors.filter((x) => x !== c.hex));
                    else setSelectedColors([...selectedColors, c.hex]);
                    play("click");
                  }}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-all ${
                    active ? "border-rose-400 bg-white/10 font-bold text-foreground" : "border-white/10 text-muted-foreground"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="text-muted-foreground uppercase text-[0.68rem] pb-2 border-b border-white/10">
            Pre-Approved Biodegradable Additions (10% Material Responsibility):
          </div>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={naturalAdditions.marigoldPetals}
                onChange={(e) => setNaturalAdditions({ ...naturalAdditions, marigoldPetals: e.target.checked })}
                className="accent-rose-400"
              />
              <span className="text-foreground">Fresh Marigold Petals (Genda Phool)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={naturalAdditions.riceGrains}
                onChange={(e) => setNaturalAdditions({ ...naturalAdditions, riceGrains: e.target.checked })}
                className="accent-rose-400"
              />
              <span className="text-foreground">Dyed Raw Rice Grains (Akshata)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={naturalAdditions.mangoLeaves}
                onChange={(e) => setNaturalAdditions({ ...naturalAdditions, mangoLeaves: e.target.checked })}
                className="accent-rose-400"
              />
              <span className="text-foreground">Mango & Ashoka Green Leaves</span>
            </label>
          </div>
          <div className="mt-3 text-[0.68rem] text-red-400 font-semibold">
            [!] Strictly Prohibited: Chemical spray fixatives, plastic glitter, and adhesive bases.
          </div>
        </div>
      </div>
    </div>
  );
}
