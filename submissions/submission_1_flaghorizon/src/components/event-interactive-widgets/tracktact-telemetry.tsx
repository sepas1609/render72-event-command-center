"use client";

import { useState } from "react";
import { Cpu, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function TrackTactTelemetryWidget() {
  const [chassisWidth, setChassisWidth] = useState(22);
  const [chassisLength, setChassisLength] = useState(24);
  const [nominalVoltage, setNominalVoltage] = useState(11.1);
  const [interventions, setInterventions] = useState(1);
  const run1Time = 34.2;
  const run2Time = 31.8;
  const play = useAudioCue();

  // Rules:
  // 1. Robot footprint must not exceed 25 cm × 25 cm
  // 2. Battery up to 12 V nominal
  // 3. Touch adds 10 seconds; run ends after 3 interventions
  const isDimensionValid = chassisWidth <= 25 && chassisLength <= 25;
  const isVoltageValid = nominalVoltage <= 12.0;
  const isDisqualified = interventions >= 3;

  // Best valid time calculation with interventions penalty
  const run1PenaltyTime = run1Time + interventions * 10;
  const run2PenaltyTime = run2Time + interventions * 10;
  const bestTime = isDisqualified ? null : Math.min(run1PenaltyTime, run2PenaltyTime).toFixed(1);

  return (
    <div className="rounded-2xl border-2 border-amber-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>TrackTact Technical Pit Inspection & Course Flight Computer</span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.65rem] text-amber-300">
                MARSHAL DESK
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Verify dimension constraints, nominal battery limits, and penalty calculations.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          {isDimensionValid && isVoltageValid ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Technical Inspection: PASSED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" /> Inspection: FAILED
            </span>
          )}
        </div>
      </div>

      {/* Robot Spec Calibration */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <label className="text-muted-foreground uppercase text-[0.68rem] block">
            Chassis Dimensions (Max: 25 × 25 cm)
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span>Width: {chassisWidth} cm</span>
              <input
                type="range"
                min={15}
                max={30}
                value={chassisWidth}
                onChange={(e) => setChassisWidth(Number(e.target.value))}
                className="w-24 accent-amber-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Length: {chassisLength} cm</span>
              <input
                type="range"
                min={15}
                max={30}
                value={chassisLength}
                onChange={(e) => setChassisLength(Number(e.target.value))}
                className="w-24 accent-amber-400"
              />
            </div>
          </div>
          {!isDimensionValid && (
            <div className="mt-2 text-red-400 text-[0.7rem]">
              Exceeds 25×25 cm footprint rule!
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <label className="text-muted-foreground uppercase text-[0.68rem] block">
            Nominal Battery Voltage (Max 12.0 V)
          </label>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-base text-foreground">{nominalVoltage} V</span>
            <div className="flex gap-1.5">
              {[7.4, 11.1, 14.8].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setNominalVoltage(v);
                    play("click");
                  }}
                  className={`rounded px-2 py-1 text-[0.7rem] border ${
                    nominalVoltage === v
                      ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                      : "border-white/10 text-muted-foreground"
                  }`}
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>
          {!isVoltageValid && (
            <div className="mt-2 text-red-400 text-[0.7rem]">
              Exceeds safe 12V maximum limit!
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <label className="text-muted-foreground uppercase text-[0.68rem] block">
            Marshal Touch Interventions
          </label>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setInterventions(Math.max(0, interventions - 1));
                play("click");
              }}
              className="h-7 w-7 rounded bg-white/10 text-foreground font-bold"
            >
              -
            </button>
            <span
              className={`font-bold text-sm ${
                interventions >= 3 ? "text-red-400" : "text-amber-400"
              }`}
            >
              {interventions} Touch{interventions !== 1 ? "es" : ""} (+{interventions * 10}s)
            </span>
            <button
              type="button"
              onClick={() => {
                setInterventions(Math.min(3, interventions + 1));
                play("click");
              }}
              className="h-7 w-7 rounded bg-white/10 text-foreground font-bold"
            >
              +
            </button>
          </div>
          {interventions >= 3 && (
            <div className="mt-2 text-red-400 text-[0.7rem] font-bold">
              [!] 3rd Touch Reached: Run Terminated!
            </div>
          )}
        </div>
      </div>

      {/* Qualification Run Scoring Box */}
      <div className="mt-4 rounded-xl border border-amber-500/20 bg-black/60 p-4 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Run 1 Raw:</span>{" "}
            <span className="text-foreground font-semibold">{run1Time}s</span> ·{" "}
            <span className="text-amber-400 font-semibold">Adjusted: {run1PenaltyTime.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-muted-foreground">Run 2 Raw:</span>{" "}
            <span className="text-foreground font-semibold">{run2Time}s</span> ·{" "}
            <span className="text-amber-400 font-semibold">Adjusted: {run2PenaltyTime.toFixed(1)}s</span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Official Seeding Time:</span>{" "}
            <span className="text-base font-extrabold text-[var(--neon)]">
              {bestTime ? `${bestTime}s (Qualifying)` : "DISQUALIFIED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
