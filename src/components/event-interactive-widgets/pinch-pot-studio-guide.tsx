"use client";

import { useState } from "react";
import {
  CircleDot,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  Heart,
  RotateCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAudioCue } from "@/hooks/use-audio-cue";

interface GlazeChoice {
  id: string;
  name: string;
  finish: string;
  hex: string;
  description: string;
}

const GLAZES: GlazeChoice[] = [
  {
    id: "terracotta",
    name: "Raw River Terracotta",
    finish: "Earthy Matte Bisque",
    hex: "#c2410c",
    description: "Unglazed natural iron-rich stoneware with warm tactile grip.",
  },
  {
    id: "celadon",
    name: "Celadon Jade Mist",
    finish: "Semi-Translucent Crackle",
    hex: "#059669",
    description: "Ancient wood-ash reduction glaze with faint crystalline hair-fractures.",
  },
  {
    id: "tenmoku",
    name: "Tenmoku Obsidian",
    finish: "Metallic Iron Rust",
    hex: "#312e81",
    description: "High-fire black glaze that breaks into warm rust brown over vessel rims.",
  },
  {
    id: "chalk",
    name: "Chalk White Satin",
    finish: "Smooth Scandinavian",
    hex: "#f1f5f9",
    description: "Silky matte white glaze highlighting hand-pinched thumb impressions.",
  },
];

const VESSEL_TYPES = [
  { id: "chawan", name: "Tea Chawan (Bowl)", baseDiameter: 10.5, defaultThickness: 7.5 },
  { id: "planter", name: "Succulent Planter", baseDiameter: 11.2, defaultThickness: 8.0 },
  { id: "espresso", name: "Espresso Tumbler", baseDiameter: 8.5, defaultThickness: 6.5 },
];

export function PinchPotStudioGuideWidget() {
  const [selectedVesselIdx, setSelectedVesselIdx] = useState(0);
  const [selectedGlazeIdx, setSelectedGlazeIdx] = useState(1);
  const [bowlWidthCm, setBowlWidthCm] = useState(VESSEL_TYPES[0].baseDiameter);
  const [wallThicknessMm, setWallThicknessMm] = useState(VESSEL_TYPES[0].defaultThickness);
  const [isWheelSpinning, setIsWheelSpinning] = useState(true);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [kilnPassClaimed, setKilnPassClaimed] = useState(false);
  const play = useAudioCue();

  const currentVessel = VESSEL_TYPES[selectedVesselIdx];
  const currentGlaze = GLAZES[selectedGlazeIdx];

  // Firing safety checks:
  // 1. Max 12cm wide (kiln shelf limit)
  // 2. Wall thickness optimal between 6mm and 9mm (too thin = warping; too thick = explosion from moisture)
  const isWidthCompliant = bowlWidthCm <= 12.0;
  const isThicknessOptimal = wallThicknessMm >= 6.0 && wallThicknessMm <= 9.0;
  const isKilnSafe = isWidthCompliant && isThicknessOptimal;

  const handleVesselChange = (idx: number) => {
    setSelectedVesselIdx(idx);
    setBowlWidthCm(VESSEL_TYPES[idx].baseDiameter);
    setWallThicknessMm(VESSEL_TYPES[idx].defaultThickness);
    play("click");
  };

  const handleClaimPass = () => {
    setKilnPassClaimed(true);
    play("capture");
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.65 },
      colors: ["#ea580c", "#f97316", "#059669", "#f59e0b"],
    });
  };

  return (
    <div className="rounded-2xl border-2 border-orange-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(249,115,22,0.14)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <CircleDot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Earth in Your Hands: Zen Clay Atelier & Spinning Wheel</span>
              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[0.65rem] text-orange-300 border border-orange-500/30">
                CERAMICS STUDIO & KILN
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Mindful pinch-pot vessel forming, artisanal glaze selection, and 3-week kiln firing scheduler.
            </p>
          </div>
        </div>

        {/* Kiln Safety Status Badge */}
        <div className="font-mono text-xs">
          {isKilnSafe ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(34,197,94,0.2)]">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Kiln Verified (Safe)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-rose-300 font-semibold">
              <AlertCircle className="h-3.5 w-3.5 text-rose-400" /> Firing Fracture Warning
            </span>
          )}
        </div>
      </div>

      {/* Vessel Profile Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
        {VESSEL_TYPES.map((v, idx) => (
          <button
            key={v.id}
            type="button"
            onClick={() => handleVesselChange(idx)}
            className={`rounded-xl border px-3.5 py-2 transition-all ${
              selectedVesselIdx === idx
                ? "border-orange-400 bg-orange-500/20 text-orange-300 font-bold shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      {/* Main Studio Workbench Grid */}
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Spinning Pottery Wheel & Visual Vessel Preview (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/15 bg-black/80 p-4 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          <div className="flex items-center justify-between text-[0.68rem] font-mono text-muted-foreground border-b border-white/10 pb-2">
            <span>{currentVessel.name} · Potter&apos;s Wheel #04</span>
            <button
              type="button"
              onClick={() => {
                setIsWheelSpinning(!isWheelSpinning);
                play("click");
              }}
              className="flex items-center gap-1 text-orange-300 hover:text-orange-200"
            >
              <RotateCw className={`h-3 w-3 ${isWheelSpinning ? "animate-spin" : ""}`} />
              <span>{isWheelSpinning ? "Spinning" : "Stationary"}</span>
            </button>
          </div>

          {/* Pottery Wheel Lathe Visualization */}
          <div className="my-auto py-6 flex flex-col items-center justify-center relative">
            {/* Ambient clay aura glow */}
            <div
              className="absolute w-44 h-44 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-700"
              style={{ backgroundColor: currentGlaze.hex }}
            />

            {/* Stylized Ceramic Vessel Silhouette */}
            <div className="relative flex flex-col items-center">
              {/* Rim opening */}
              <div
                className="rounded-full border-2 transition-all duration-500 shadow-inner"
                style={{
                  width: `${Math.min(220, bowlWidthCm * 17)}px`,
                  height: "36px",
                  borderColor: currentGlaze.hex,
                  backgroundColor: `${currentGlaze.hex}33`,
                }}
              />

              {/* Vessel Belly Body */}
              <div
                className="mt-[-14px] rounded-b-[40px] border-b-2 border-x-2 transition-all duration-500 flex items-center justify-center shadow-lg"
                style={{
                  width: `${Math.min(200, bowlWidthCm * 15.5)}px`,
                  height: `${Math.max(70, 110 - wallThicknessMm * 3)}px`,
                  backgroundColor: currentGlaze.hex,
                  borderColor: `${currentGlaze.hex}99`,
                }}
              >
                {/* Finger pinch impression textures */}
                <div className="flex gap-2 opacity-30">
                  <span className="w-2.5 h-6 rounded-full bg-black/40"></span>
                  <span className="w-2.5 h-7 rounded-full bg-black/40"></span>
                  <span className="w-2.5 h-6 rounded-full bg-black/40"></span>
                </div>
              </div>

              {/* Wooden Potter's Wheel Plate below */}
              <div
                className={`mt-3 w-56 h-6 rounded-full bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border border-amber-700/40 shadow-md ${
                  isWheelSpinning ? "animate-pulse" : ""
                }`}
              />
            </div>

            <div className="mt-3 text-center font-mono text-[0.7rem] text-muted-foreground">
              <span className="font-semibold text-foreground">{currentGlaze.name}</span> · {currentGlaze.finish}
            </div>
          </div>

          {/* Calming Mindfulness Sensory Metronome */}
          <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[0.68rem] font-mono">
            <button
              type="button"
              onClick={() => {
                setIsBreathingActive(!isBreathingActive);
                play("click");
              }}
              className="flex items-center gap-1.5 text-orange-300 hover:text-orange-200"
            >
              <Heart className={`h-3.5 w-3.5 ${isBreathingActive ? "text-rose-400 animate-ping" : "text-orange-400"}`} />
              <span>{isBreathingActive ? "Centering Breath: Active (Inhale... Exhale...)" : "Start Mindfulness Breath"}</span>
            </button>
            <span className="text-muted-foreground">Zen Index: 98%</span>
          </div>
        </div>

        {/* Right: Technical Calibrations, Glaze Swatches & Kiln Pipeline (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 font-mono text-xs">
          {/* Dimension Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/15 bg-black/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] uppercase text-muted-foreground font-bold">
                  Vessel Diameter (Max 12 cm):
                </span>
                <span className={`text-sm font-bold ${bowlWidthCm > 12 ? "text-rose-400" : "text-foreground"}`}>
                  {bowlWidthCm} cm
                </span>
              </div>
              <input
                type="range"
                min={6.0}
                max={15.0}
                step={0.5}
                value={bowlWidthCm}
                onChange={(e) => setBowlWidthCm(Number(e.target.value))}
                className="mt-2.5 w-full accent-orange-400"
              />
              {bowlWidthCm > 12 && (
                <div className="mt-1 text-rose-400 text-[0.65rem]">
                  Exceeds studio kiln shelf dimension (max 12 cm).
                </div>
              )}
            </div>

            <div className="rounded-xl border border-white/15 bg-black/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] uppercase text-muted-foreground font-bold">
                  Wall Thickness (6 - 9 mm):
                </span>
                <span className={`text-sm font-bold ${isThicknessOptimal ? "text-emerald-400" : "text-amber-400"}`}>
                  {wallThicknessMm} mm
                </span>
              </div>
              <input
                type="range"
                min={3.0}
                max={14.0}
                step={0.5}
                value={wallThicknessMm}
                onChange={(e) => setWallThicknessMm(Number(e.target.value))}
                className="mt-2.5 w-full accent-orange-400"
              />
              {!isThicknessOptimal && (
                <div className="mt-1 text-amber-400 text-[0.65rem]">
                  {wallThicknessMm < 6
                    ? "Too thin: Rim will warp during damp-box drying."
                    : "Too thick: Moisture pocket risk during 950°C bisque fire."}
                </div>
              )}
            </div>
          </div>

          {/* Artisanal Glaze Swatches */}
          <div className="rounded-xl border border-white/15 bg-black/60 p-3.5 space-y-2">
            <div className="text-[0.68rem] uppercase text-muted-foreground font-bold">
              Select Studio Glaze Formulation:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GLAZES.map((g, idx) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGlazeIdx(idx);
                    play("click");
                  }}
                  className={`rounded-lg border p-2 text-left transition-all ${
                    selectedGlazeIdx === idx
                      ? "border-orange-400 bg-orange-500/20 text-orange-200 font-bold"
                      : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-3 w-3 rounded-full border border-white/20"
                      style={{ backgroundColor: g.hex }}
                    />
                    <span className="text-[0.68rem] truncate">{g.name}</span>
                  </div>
                  <div className="text-[0.6rem] text-muted-foreground mt-1 truncate">{g.finish}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3-Week Firing Pipeline */}
          <div className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-950/20 to-black p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[0.68rem] font-bold uppercase text-orange-400 pb-1.5 border-b border-orange-500/20">
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-orange-500" /> 3-Week Firing & Vitrification Pipeline
              </span>
              <span className="text-muted-foreground">Studio Pickup: Dec 5, 2026</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[0.68rem]">
              <div className="rounded-lg bg-black/40 p-2 border border-white/10">
                <div className="font-semibold text-foreground">Week 1 (Nov 14-20)</div>
                <div className="text-muted-foreground text-[0.62rem] mt-0.5">Damp-box moisture equalizing</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2 border border-white/10">
                <div className="font-semibold text-foreground">Week 2 (Nov 21-27)</div>
                <div className="text-muted-foreground text-[0.62rem] mt-0.5">950°C Bisque & Glaze Dip</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2 border border-white/10">
                <div className="font-semibold text-foreground">Week 3 (Dec 05)</div>
                <div className="text-emerald-400 text-[0.62rem] mt-0.5 font-bold">Ready for Collection</div>
              </div>
            </div>
          </div>

          {/* Reservation / Registration Pass */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-950/30 to-amber-950/30 p-3">
            <div className="text-[0.7rem] text-muted-foreground">
              <strong className="text-foreground">Workshop Materials:</strong> 1.2 kg Stoneware River Clay + Custom Bisque Firing Included
            </div>
            <button
              type="button"
              disabled={kilnPassClaimed}
              onClick={handleClaimPass}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                kilnPassClaimed
                  ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 cursor-default"
                  : "border border-orange-400 bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95"
              }`}
            >
              {kilnPassClaimed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Kiln Pass #KILN-TAG-709 Confirmed
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Reserve Clay Ball & Kiln Shelf</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
