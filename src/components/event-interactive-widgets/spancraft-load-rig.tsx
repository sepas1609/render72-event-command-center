"use client";

import { useState } from "react";
import { Gauge } from "lucide-react";

export function SpanCraftLoadRigWidget() {
  const [bridgeMassGrams, setBridgeMassGrams] = useState(145);
  const [loadCarriedKg, setLoadCarriedKg] = useState(24.5);
  const deckWidthCm = 12;
  const heightCm = 21;

  // Rules:
  // 1. Span 40 cm, deck width <= 15 cm, overall height <= 25 cm
  // 2. Score = maximum verified load (kg) / bridge mass (kg)
  const strengthToWeightRatio = (loadCarriedKg / (bridgeMassGrams / 1000)).toFixed(1);

  return (
    <div className="rounded-2xl border-2 border-cyan-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(6,182,212,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>SpanCraft Structures Rig: Strength-to-Weight Flight Computer</span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[0.65rem] text-cyan-300">
                STRUCTURES LAB
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Calculates structural efficiency ratio: Max verified load divided by bridge mass.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          <span className="text-muted-foreground">Efficiency Score:</span>{" "}
          <span className="text-base font-extrabold text-cyan-300">{strengthToWeightRatio}x</span>
        </div>
      </div>

      {/* Inputs Matrix */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Bridge Finished Mass:</span>
            <span className="font-bold text-foreground text-sm">{bridgeMassGrams} g</span>
          </div>
          <input
            type="range"
            min={80}
            max={250}
            value={bridgeMassGrams}
            onChange={(e) => setBridgeMassGrams(Number(e.target.value))}
            className="mt-3 w-full accent-cyan-400"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Failure Load Rig:</span>
            <span className="font-bold text-cyan-400 text-sm">{loadCarriedKg} kg</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={0.5}
            value={loadCarriedKg}
            onChange={(e) => setLoadCarriedKg(Number(e.target.value))}
            className="mt-3 w-full accent-cyan-400"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4 flex flex-col justify-between">
          <div className="text-muted-foreground uppercase text-[0.68rem]">Envelope Check (40 cm Clear Span):</div>
          <div className="mt-2 space-y-1 text-[0.72rem]">
            <div className="flex items-center justify-between">
              <span>Deck Width: {deckWidthCm} cm (Max 15 cm)</span>
              <span className="text-emerald-400 font-bold">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Overall Height: {heightCm} cm (Max 25 cm)</span>
              <span className="text-emerald-400 font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
