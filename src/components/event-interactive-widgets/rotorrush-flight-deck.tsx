"use client";

import { useState } from "react";
import { Plane, AlertTriangle, CheckCircle2 } from "lucide-react";

export function RotorRushFlightDeckWidget() {
  const [droneWeight, setDroneWeight] = useState(238);
  const [hasPropGuards, setHasPropGuards] = useState(true);
  const [hasDisarmTest, setHasDisarmTest] = useState(true);
  const [missedGates, setMissedGates] = useState(1);
  const [obstacleHits, setObstacleHits] = useState(2);
  const attempt1Sec = 62.4;
  const attempt2Sec = 58.1;

  // Rules:
  // 1. Ready-to-fly weight <= 250 g
  // 2. Full propeller guards compulsory
  // 3. Demonstrated emergency disarm
  // 4. +15s missed gate, +5s obstacle contact
  const isSafetyPassed = droneWeight <= 250 && hasPropGuards && hasDisarmTest;
  const penaltySec = missedGates * 15 + obstacleHits * 5;
  const finalAttempt1 = attempt1Sec + penaltySec;
  const finalAttempt2 = attempt2Sec + penaltySec;
  const bestAttempt = isSafetyPassed ? Math.min(finalAttempt1, finalAttempt2).toFixed(1) : null;

  return (
    <div className="rounded-2xl border-2 border-cyan-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(6,182,212,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>RotorRush Flight Safety Computer & Penalty Flight Deck</span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[0.65rem] text-cyan-300">
                INDOOR NETTED ARENA
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Pre-flight weight verification, emergency disarm check, and course penalty computation.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          {isSafetyPassed ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Safety Check: CLEARED FOR FLIGHT
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" /> GROUNDED: Safety Defect
            </span>
          )}
        </div>
      </div>

      {/* Pre-Flight Inspection Bar */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <label className="text-muted-foreground uppercase text-[0.68rem] block">
            Ready-to-Fly Weight (Max 250 g)
          </label>
          <div className="mt-2 flex items-center justify-between">
            <span
              className={`font-bold text-base ${
                droneWeight > 250 ? "text-red-400" : "text-foreground"
              }`}
            >
              {droneWeight} grams
            </span>
            <input
              type="range"
              min={180}
              max={300}
              value={droneWeight}
              onChange={(e) => setDroneWeight(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
          </div>
          {droneWeight > 250 && (
            <div className="mt-2 text-red-400 text-[0.7rem]">
              Exceeds 250g weight limit (DGCA micro-drone rule)!
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <label className="text-muted-foreground uppercase text-[0.68rem] block">
            Propeller Guards & Failsafe
          </label>
          <div className="mt-2 space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPropGuards}
                onChange={(e) => setHasPropGuards(e.target.checked)}
                className="accent-cyan-400"
              />
              <span className="text-foreground">Full Prop Guards Attached</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDisarmTest}
                onChange={(e) => setHasDisarmTest(e.target.checked)}
                className="accent-cyan-400"
              />
              <span className="text-foreground">Emergency Disarm Verified</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <label className="text-muted-foreground uppercase text-[0.68rem] block">
            Flight Penalties
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span>Missed Gates (+15s):</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMissedGates(Math.max(0, missedGates - 1))}
                  className="h-5 w-5 rounded bg-white/10 text-center"
                >
                  -
                </button>
                <span className="w-4 text-center font-bold text-amber-400">{missedGates}</span>
                <button
                  type="button"
                  onClick={() => setMissedGates(missedGates + 1)}
                  className="h-5 w-5 rounded bg-white/10 text-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Net Contacts (+5s):</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setObstacleHits(Math.max(0, obstacleHits - 1))}
                  className="h-5 w-5 rounded bg-white/10 text-center"
                >
                  -
                </button>
                <span className="w-4 text-center font-bold text-amber-400">{obstacleHits}</span>
                <button
                  type="button"
                  onClick={() => setObstacleHits(obstacleHits + 1)}
                  className="h-5 w-5 rounded bg-white/10 text-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Timing Summary */}
      <div className="mt-4 rounded-xl border border-cyan-500/20 bg-black/60 p-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-muted-foreground">Attempt 1 Adjusted:</span>{" "}
            <span className="text-foreground font-semibold">{finalAttempt1.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-muted-foreground">Attempt 2 Adjusted:</span>{" "}
            <span className="text-cyan-400 font-semibold">{finalAttempt2.toFixed(1)}s</span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Marshal Official Rank Score:</span>{" "}
            <span className="text-base font-extrabold text-[var(--neon)]">
              {bestAttempt ? `${bestAttempt}s` : "GROUNDED / DISQUALIFIED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
