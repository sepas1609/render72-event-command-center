"use client";

import { useState } from "react";
import { Palette, Sparkles, CheckCircle2, Users, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { useAudioCue } from "@/hooks/use-audio-cue";

const ORGANIC_PIGMENTS = [
  { name: "Marigold Saffron", hex: "#f97316", naturalSource: "Dry calendula petals" },
  { name: "Turmeric Gold", hex: "#eab308", naturalSource: "Stone-ground haldi" },
  { name: "Vermilion Sindoor", hex: "#dc2626", naturalSource: "Natural cinnabar powder" },
  { name: "Rice Flour White", hex: "#f8fafc", naturalSource: "Washed rice starch" },
  { name: "Forest Henna Green", hex: "#16a34a", naturalSource: "Dry mehendi leaf flour" },
  { name: "Indigo Petal Blue", hex: "#3b82f6", naturalSource: "Fermented neel extract" },
];

const SYMMETRY_MODES = [
  { id: "8-fold", name: "8-Fold Sacred Mandala", vibe: "Traditional courtyard radial harmony" },
  { id: "12-fold", name: "12-Fold Solar Bloom", vibe: "High-density floral kaleidoscope" },
  { id: "freeform", name: "Riparian Flow (Organic Rivers)", vibe: "Contemporary asymmetric water curves" },
];

export function ChowkRangoliDesignerWidget() {
  const [selectedPigment, setSelectedPigment] = useState(ORGANIC_PIGMENTS[0]);
  const [symmetryMode, setSymmetryMode] = useState("8-fold");
  const [duoHarmonized, setDuoHarmonized] = useState(false);
  const play = useAudioCue();

  const handleHarmonize = () => {
    setDuoHarmonized(true);
    play("capture");
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#f97316", "#eab308", "#dc2626", "#ec4899"],
    });
  };

  return (
    <div className="rounded-2xl border-2 border-rose-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(244,63,94,0.15)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.25)]">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Chowk &amp; Colour: 1.5m² Duo Rangoli Atelier</span>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[0.62rem] text-rose-300">
                FOLK ARTS DUET
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Two artists, one black-stone tile square. Synthesize natural pigments and sacred radial geometries.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-rose-300 flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          <span>2-Artist Teams · ₹200 / duo</span>
        </div>
      </div>

      {/* Pigment Selection Palette */}
      <div className="mt-4">
        <div className="text-[0.68rem] font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Natural &amp; Biodegradable Pigment Tray:
        </div>
        <div className="flex flex-wrap gap-2">
          {ORGANIC_PIGMENTS.map((pig) => (
            <button
              key={pig.name}
              type="button"
              onClick={() => {
                setSelectedPigment(pig);
                play("click");
              }}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-all flex items-center gap-2 ${
                selectedPigment.name === pig.name
                  ? "border-rose-400 bg-rose-500/20 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: pig.hex }}
              />
              <span>{pig.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mesmerizing Sacred Geometry Canvas */}
      <div className="mt-4 rounded-xl border border-white/15 bg-black/80 p-5 font-mono text-xs relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[0.7rem] text-muted-foreground">
          <span>Boundary: 150 cm × 150 cm Polished Basalt Tile</span>
          <span>Theme: &ldquo;Water, Memory, Tomorrow&rdquo; (35% Weight)</span>
        </div>

        {/* Dynamic Visual Mandala Display */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-around gap-6 py-4">
          <div className="relative h-44 w-44 rounded-full border-2 border-dashed border-rose-500/40 flex items-center justify-center p-3 animate-[spin_60s_linear_infinite]">
            <div
              className="absolute inset-2 rounded-full opacity-30 blur-sm transition-all duration-500"
              style={{ backgroundColor: selectedPigment.hex }}
            />
            {/* Geometric Ring */}
            <div className="relative h-32 w-32 rounded-full border border-white/30 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full border-2 border-amber-400/50 flex items-center justify-center">
                <div
                  className="h-10 w-10 rounded-full shadow-lg transition-transform duration-300"
                  style={{ backgroundColor: selectedPigment.hex }}
                />
              </div>
            </div>

            {/* Petal Orbiters */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <span
                key={deg}
                className="absolute h-2.5 w-2.5 rounded-full shadow-md"
                style={{
                  backgroundColor: selectedPigment.hex,
                  transform: `rotate(${deg}deg) translate(80px)`,
                }}
              />
            ))}
          </div>

          {/* Duo Artist Synchronization Metrics */}
          <div className="space-y-3 w-full md:w-64 font-sans text-xs">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between text-muted-foreground font-mono text-[0.68rem] uppercase mb-1">
                <span>Artist 1: Geometric Grid</span>
                <span className="text-emerald-400 font-bold">In Rhythm</span>
              </div>
              <p className="text-foreground/80 text-[0.72rem]">
                Drawing structural compass chalk arcs &amp; radial axes.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between text-muted-foreground font-mono text-[0.68rem] uppercase mb-1">
                <span>Artist 2: Floral Shade Duet</span>
                <span className="text-rose-400 font-bold">Synchronized</span>
              </div>
              <p className="text-foreground/80 text-[0.72rem]">
                Pinching natural {selectedPigment.naturalSource} gradient fills.
              </p>
            </div>

            <div className="text-[0.7rem] text-rose-300 font-mono flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span>Duo Walkway Harmony Index: 98% (Flawless Flow)</span>
            </div>
          </div>
        </div>

        {/* Symmetry Selector */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[0.7rem]">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Pattern Layout:</span>
            {SYMMETRY_MODES.map((sm) => (
              <button
                key={sm.id}
                type="button"
                onClick={() => {
                  setSymmetryMode(sm.id);
                  play("tick");
                }}
                className={`rounded px-2 py-0.5 font-mono ${
                  symmetryMode === sm.id
                    ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sm.name}
              </button>
            ))}
          </div>

          <span className="text-muted-foreground">Biodegradable rule: Zero synthetic acrylics</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleHarmonize}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2.5 font-mono text-xs font-bold text-white transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
        >
          <Sparkles className="h-4 w-4" />
          <span>{duoHarmonized ? "Mandala Pattern Harmonized ✓" : "Simulate Duo Rangoli Placement"}</span>
        </button>

        <div className="font-mono text-xs text-muted-foreground flex items-center gap-2">
          {duoHarmonized ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Walkway Square #07 Assigned to Your Duo!
            </span>
          ) : (
            <span>25 Duet Squares Max · Friday 10:00 AM</span>
          )}
        </div>
      </div>
    </div>
  );
}
