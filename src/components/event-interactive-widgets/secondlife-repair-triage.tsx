"use client";

import { useState } from "react";
import { Wrench, Sparkles, ShieldAlert, CheckCircle2, Leaf, RotateCcw, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { useAudioCue } from "@/hooks/use-audio-cue";

const REPAIR_SPECIMENS = [
  {
    id: "walkman",
    name: "Sony Sports Walkman (1998)",
    sub: "Low-voltage 3.5mm jack fatigue & headphone crackle",
    domain: "Electronics Bench",
    co2Saved: "3.2 kg",
    cashSaved: "₹1,800",
    isPermitted: true,
    tool: "Multimeter & Solder Reflow",
    fixTime: "25 mins",
    anatomy: "3.3V audio signal trace with fractured cold joint.",
  },
  {
    id: "backpack",
    name: "Cordura 500D Trekking Pack",
    sub: "Stress blowout on left load-lifter strap seam",
    domain: "Heavy Textile Bench",
    co2Saved: "6.8 kg",
    cashSaved: "₹3,400",
    isPermitted: true,
    tool: "Waxed Denim Needle & Bar-tack",
    fixTime: "35 mins",
    anatomy: "Tensile failure along polyurethane-coated back panel.",
  },
  {
    id: "kettle",
    name: "230V High-Draw Electric Kettle",
    sub: "Burned heating coil & exposed base terminal",
    domain: "Mains Power (Prohibited)",
    co2Saved: "0 kg",
    cashSaved: "₹0",
    isPermitted: false,
    tool: "Licensed Electrician Only",
    fixTime: "N/A",
    anatomy: "Mains voltage hazard. Strictly barred from student repair tables.",
  },
];

export function SecondLifeRepairTriageWidget() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [repairState, setRepairState] = useState<"diagnosing" | "mending" | "restored">("diagnosing");
  const [repairPassClaimed, setRepairPassClaimed] = useState(false);
  const play = useAudioCue();

  const specimen = REPAIR_SPECIMENS[activeIdx];

  const handleMend = () => {
    if (!specimen.isPermitted) {
      play("alert");
      return;
    }
    setRepairState("mending");
    play("click");
    setTimeout(() => {
      setRepairState("restored");
      play("capture");
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#10b981", "#06b6d4", "#f59e0b"],
      });
    }, 700);
  };

  const handleReset = () => {
    setRepairState("diagnosing");
    setRepairPassClaimed(false);
    play("tick");
  };

  return (
    <div className="rounded-2xl border-2 border-emerald-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(16,185,129,0.15)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Second Life: The Healer&apos;s Workbench</span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[0.62rem] text-emerald-300">
                CIRCULAR REPAIR ATELIER
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Diagnose broken campus possessions, simulate precision fixes, and calculate averted landfill carbon.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Bench
        </button>
      </div>

      {/* Specimen Selector Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {REPAIR_SPECIMENS.map((sp, idx) => (
          <button
            key={sp.id}
            type="button"
            onClick={() => {
              setActiveIdx(idx);
              setRepairState("diagnosing");
              play("click");
            }}
            className={`rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold transition-all text-left ${
              activeIdx === idx
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <div>{sp.name}</div>
            <div className="text-[0.65rem] opacity-70 font-normal">{sp.domain}</div>
          </button>
        ))}
      </div>

      {/* Mesmerizing Diagnostic Workbench */}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Specimen Diagnosis:</span>
            <span className="font-bold text-foreground">{specimen.name}</span>
          </div>
          <div>
            {specimen.isPermitted ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[0.65rem] text-emerald-300 font-bold">
                <CheckCircle2 className="h-3 w-3" /> SAFE FOR CAMPUS MENDING
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/40 px-2.5 py-0.5 text-[0.65rem] text-red-300 font-bold">
                <ShieldAlert className="h-3 w-3" /> 230V MAINS PROHIBITED
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-foreground/90 font-sans">
          {specimen.sub}
        </p>

        {/* Mesmerizing Live X-Ray / Repair Wireframe */}
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-[0.7rem] text-emerald-300 mb-2">
            <span>Workbench Sensor Telemetry</span>
            <span>Tooling: {specimen.tool}</span>
          </div>

          <div className="h-16 w-full rounded-lg bg-black/60 border border-emerald-500/30 flex items-center justify-center relative overflow-hidden">
            {repairState === "diagnosing" && (
              <div className="flex items-center gap-2 text-amber-400 animate-pulse font-mono text-xs">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Scanning fracture line: {specimen.anatomy}</span>
              </div>
            )}

            {repairState === "mending" && (
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs animate-bounce">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Reflowing solder &amp; suturing structural weave...</span>
              </div>
            )}

            {repairState === "restored" && (
              <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="font-bold">OBJECT RESURRECTED — 100% Structural Integrity Restored</span>
              </div>
            )}
          </div>
        </div>

        {/* Circular Economy Impact Gauge */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <span className="text-[0.65rem] text-muted-foreground uppercase block">Landfill Diversion</span>
            <div className="mt-1 flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
              <Leaf className="h-4 w-4" />
              <span>{specimen.co2Saved} CO₂e</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <span className="text-[0.65rem] text-muted-foreground uppercase block">Replacement Cost Saved</span>
            <div className="mt-1 text-foreground font-bold text-sm">
              {specimen.cashSaved}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <span className="text-[0.65rem] text-muted-foreground uppercase block">Estimated Repair Time</span>
            <div className="mt-1 text-cyan-400 font-bold text-sm">
              {specimen.fixTime}
            </div>
          </div>
        </div>
      </div>

      {/* Action / Engagement Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        {specimen.isPermitted ? (
          <button
            type="button"
            onClick={handleMend}
            disabled={repairState === "mending" || repairState === "restored"}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-2.5 font-mono text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {repairState === "restored" ? "Item Repaired ✓" : "Perform Precision Repair Simulation"}
            </span>
          </button>
        ) : (
          <div className="text-xs text-red-400 font-mono">
            Safety protocol: Mains voltage equipment rejected from public student table.
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setRepairPassClaimed(true);
            play("capture");
          }}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 font-mono text-xs font-semibold transition-all ${
            repairPassClaimed
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
              : "border-white/15 bg-white/5 text-foreground hover:bg-white/10"
          }`}
        >
          <Award className="h-3.5 w-3.5 text-emerald-400" />
          <span>{repairPassClaimed ? "Workbench Slot Reserved ✓" : "Reserve Repair Café Workbench"}</span>
        </button>
      </div>
    </div>
  );
}
