"use client";

import { useState } from "react";
import { Wrench, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const REPAIR_ITEMS = [
  {
    id: "backpack",
    name: "Torn Backpack Seam / Zip Pull",
    category: "Fabric Mending",
    isPermitted: true,
    riskLevel: "Low (Supervised Hand-sew)",
    steps: "Inspect seam tension -> Pin reinforced nylon patch -> Hand stitch backstitch seam.",
    consumables: "Thread, heavy denim needles, zip pull cord.",
  },
  {
    id: "gadget",
    name: "Low-Voltage Bluetooth Speaker (Tired USB Port)",
    category: "Low-Voltage Electronics",
    isPermitted: true,
    riskLevel: "Moderate (Cold Inspection First)",
    steps: "Multimeter continuity check -> Solder joint reflow under supervisor -> Strain relief glue.",
    consumables: "Flux, heat shrink tubing, micro-USB breakout.",
  },
  {
    id: "mains-kettle",
    name: "230V Electric Kettle / High-Power Appliance",
    category: "Mains Power (Prohibited)",
    isPermitted: false,
    riskLevel: "CRITICAL HAZARD (Mains 230V)",
    steps: "OUT OF SCOPE. Must refer to licensed electrical technician. No walk-in live testing allowed.",
    consumables: "None. Registration rejected for beginner workshop safety.",
  },
];

export function SecondLifeRepairTriageWidget() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [hasBackupData, setHasBackupData] = useState(true);
  const [hasRemovedBattery, setHasRemovedBattery] = useState(true);
  const play = useAudioCue();

  const item = REPAIR_ITEMS[selectedItemIdx];

  return (
    <div className="rounded-2xl border-2 border-emerald-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(16,185,129,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Second Life Repair Intake & Scope Triage</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] text-emerald-300">
                SUSTAINABILITY STUDIO
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Pre-workshop safety evaluation: separates beginner safe repairs from high-voltage hazards.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          {item.isPermitted ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Scope Approved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-red-400">
              <ShieldAlert className="h-3.5 w-3.5" /> Excluded from Scope
            </span>
          )}
        </div>
      </div>

      {/* Item Picker */}
      <div className="mt-4 flex flex-wrap gap-2">
        {REPAIR_ITEMS.map((it, idx) => (
          <button
            key={it.id}
            type="button"
            onClick={() => {
              setSelectedItemIdx(idx);
              play("click");
            }}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              selectedItemIdx === idx
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            {it.name}
          </button>
        ))}
      </div>

      {/* Safety Matrix */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs">
          <div className="text-muted-foreground text-[0.68rem] uppercase">Diagnostic Risk Assessment:</div>
          <div className="mt-1 font-bold text-foreground text-sm">{item.riskLevel}</div>
          <div className="mt-3 text-muted-foreground leading-relaxed text-[0.75rem]">
            <strong>Recommended Workflow:</strong> {item.steps}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs">
          <div className="text-muted-foreground text-[0.68rem] uppercase">Required Pre-Arrival Protocol:</div>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasRemovedBattery}
                onChange={(e) => setHasRemovedBattery(e.target.checked)}
                className="accent-emerald-500"
              />
              <span className="text-foreground/90">Removable batteries safely detached</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasBackupData}
                onChange={(e) => setHasBackupData(e.target.checked)}
                className="accent-emerald-500"
              />
              <span className="text-foreground/90">Private storage backed up and wiped</span>
            </label>
          </div>
          <div className="mt-3 text-[0.7rem] text-muted-foreground">
            Provided Consumables: <span className="text-foreground">{item.consumables}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
