"use client";

import { useState } from "react";
import { LayoutDashboard, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const TEARDOWN_STEPS = [
  {
    step: "1. Cart Summary",
    flaw: "Itemized subtotal hides surging delivery fee until the final payment tap.",
    friction: "Severe trust shock at checkout; users feel deceived.",
    redesign: "Upfront dynamic delivery estimate displayed directly in the sticky cart drawer.",
    metric: "Drop cart-view abandonment by 18%.",
  },
  {
    step: "2. Promo Code Input",
    flaw: "Ambiguous error: 'Coupon could not be applied' with no reason given.",
    friction: "Users repeatedly try outdated coupons or switch tabs to search Reddit.",
    redesign: "Specific error guidance: 'Requires ₹400 minimum order. Add ₹35 more to apply.'",
    metric: "Reduce checkout pause time from 3.2m to 45s.",
  },
  {
    step: "3. Address Confirmation",
    flaw: "Mouse-only map drag pin with missing keyboard navigation and aria-labels.",
    friction: "Screen-reader and motor-impaired users completely blocked from ordering.",
    redesign: "Searchable textual landmark selector with keyboard-accessible radio cards.",
    metric: "100% WCAG 2.1 AA keyboard compliance across Pune address selector.",
  },
];

export function ProductTeardownAuditWidget() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const play = useAudioCue();

  const current = TEARDOWN_STEPS[activeStepIdx];

  return (
    <div className="rounded-2xl border-2 border-indigo-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(99,102,241,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Under the Interface: Product Teardown Workbench</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[0.65rem] text-indigo-300">
                UX LAB BENCH
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Food delivery checkout teardown connecting screen decisions to measurable business metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Step Selector Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
        {TEARDOWN_STEPS.map((s, idx) => (
          <button
            key={s.step}
            type="button"
            onClick={() => {
              setActiveStepIdx(idx);
              play("click");
            }}
            className={`rounded-lg border px-3 py-1.5 transition-all ${
              activeStepIdx === idx
                ? "border-indigo-400 bg-indigo-500/20 text-indigo-300 font-bold"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5"
            }`}
          >
            {s.step}
          </button>
        ))}
      </div>

      {/* Audit Matrix */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-red-500/20 bg-red-950/15 p-4">
          <div className="text-red-400 font-bold text-[0.7rem] uppercase flex items-center gap-1.5 pb-2 border-b border-red-500/20">
            <AlertCircle className="h-4 w-4" /> Observed Checkout Friction Point:
          </div>
          <div className="mt-2 text-foreground/90 font-semibold">{current.flaw}</div>
          <p className="mt-2 text-muted-foreground text-[0.75rem] leading-relaxed">
            {current.friction}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-4">
          <div className="text-emerald-400 font-bold text-[0.7rem] uppercase flex items-center gap-1.5 pb-2 border-b border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" /> Proposed Redesign & Metric:
          </div>
          <div className="mt-2 text-foreground font-semibold">{current.redesign}</div>
          <div className="mt-2 text-emerald-400 text-[0.75rem] font-bold">
            Target Outcome: {current.metric}
          </div>
        </div>
      </div>
    </div>
  );
}
