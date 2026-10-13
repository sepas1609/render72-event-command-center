"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
  Eye,
  Flame,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAudioCue } from "@/hooks/use-audio-cue";

interface TeardownCase {
  id: string;
  screenName: string;
  category: string;
  frictionTitle: string;
  darkPattern: string;
  heatMapHotspot: { x: number; y: number; label: string; rageClicks: number };
  heuristicViolation: string;
  proposedFix: string;
  metricDelta: {
    label: string;
    before: string;
    after: string;
    impact: string;
  };
}

const TEARDOWN_CASES: TeardownCase[] = [
  {
    id: "cart-surge",
    screenName: "Sticky Cart & Surcharge Drawer",
    category: "Price Transparency",
    frictionTitle: "Hidden Surge Fee Bait & Switch",
    darkPattern:
      "Dynamic weather surge of ₹65 injected only on the final CVV input screen, causing high checkout abandonment.",
    heatMapHotspot: { x: 74, y: 82, label: "Hidden Fee Row", rageClicks: 94 },
    heuristicViolation: "Nielsen #1: Visibility of System Status & Honest Pricing",
    proposedFix:
      "Real-time surcharge ticker visible from the restaurant menu screen with a dynamic 'Surge ends in 8m' timer.",
    metricDelta: {
      label: "Cart-to-Payment Conversion",
      before: "38.2%",
      after: "61.8%",
      impact: "+23.6% completed orders",
    },
  },
  {
    id: "promo-deadlock",
    screenName: "Voucher & Promo Code Terminal",
    category: "Error Prevention",
    frictionTitle: "Cryptic 'Coupon Invalid' Deadlock",
    darkPattern:
      "Vague error string with zero explanation pushes users into Reddit tabs to hunt for working coupons.",
    heatMapHotspot: { x: 50, y: 44, label: "Dead-End Error Banner", rageClicks: 142 },
    heuristicViolation: "Nielsen #9: Help Users Recognize, Diagnose, and Recover from Errors",
    proposedFix:
      "Contextual inline nudge: 'Add ₹45 more biryani to qualify for FLAT100' with a 1-tap cart suggestion.",
    metricDelta: {
      label: "Checkout Pause Latency",
      before: "3m 42s",
      after: "38s",
      impact: "-82% friction time",
    },
  },
  {
    id: "map-pin",
    screenName: "Pune Address Geolocation Pin",
    category: "Accessibility (WCAG)",
    frictionTitle: "Mouse-Only Map Drag Trap",
    darkPattern:
      "Delivery map forces fine-motor dragging with zero keyboard tabindex or screen-reader coordinate narration.",
    heatMapHotspot: { x: 60, y: 62, label: "Inaccessible Map Canvas", rageClicks: 78 },
    heuristicViolation: "WCAG 2.1 AA 2.1.1 (Keyboard Accessible) & 1.3.1 (Info and Relationships)",
    proposedFix:
      "Semantic landmark selector with postal auto-fill, verified building gates, and keyboard radio cards.",
    metricDelta: {
      label: "WCAG Compliance Index",
      before: "44 / 100",
      after: "98 / 100",
      impact: "100% accessible to disabled patrons",
    },
  },
];

export function ProductTeardownAuditWidget() {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"standard" | "heatmap" | "redesign">("heatmap");
  const [seatReserved, setSeatReserved] = useState(false);
  const play = useAudioCue();

  const activeCase = TEARDOWN_CASES[activeCaseIdx];

  const handleModeChange = (mode: "standard" | "heatmap" | "redesign") => {
    setViewMode(mode);
    play(mode === "redesign" ? "success" : "click");
  };

  const handleReserveSeat = () => {
    setSeatReserved(true);
    play("capture");
    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#6366f1", "#a855f7", "#ec4899", "#22c55e"],
    });
  };

  return (
    <div className="rounded-2xl border-2 border-indigo-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(99,102,241,0.14)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30">
            <LayoutDashboard className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Under the Interface: UX Autopsy & Friction Heatmap Lab</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[0.65rem] text-indigo-300 border border-indigo-500/30">
                PUNE FOOD-TECH DISSECTION
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Dissecting high-converting Pune checkout flows to replace dark patterns with empathetic engineering.
            </p>
          </div>
        </div>

        {/* View Lens Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleModeChange("standard")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              viewMode === "standard"
                ? "bg-white/15 text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Normal
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("heatmap")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              viewMode === "heatmap"
                ? "bg-rose-500/25 text-rose-300 font-semibold border border-rose-500/30"
                : "text-muted-foreground hover:text-rose-300"
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-rose-400 animate-pulse" /> Heatmap
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("redesign")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              viewMode === "redesign"
                ? "bg-emerald-500/25 text-emerald-300 font-semibold border border-emerald-500/30"
                : "text-muted-foreground hover:text-emerald-300"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Redesign V2
          </button>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
        {TEARDOWN_CASES.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActiveCaseIdx(idx);
              play("click");
            }}
            className={`rounded-xl border px-3.5 py-2 transition-all flex items-center gap-2 ${
              activeCaseIdx === idx
                ? "border-indigo-400 bg-indigo-500/20 text-indigo-300 font-bold shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[0.65rem]">
              {idx + 1}
            </span>
            <span>{c.screenName}</span>
            <span className="rounded bg-black/40 px-1.5 py-0.5 text-[0.6rem] text-muted-foreground">
              {c.category}
            </span>
          </button>
        ))}
      </div>

      {/* Main Lab Canvas: Mobile Viewport & Diagnostic Metrics */}
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Interactive Simulated Viewport (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/15 bg-black/80 p-4 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          {/* Mobile Status Bar */}
          <div className="flex items-center justify-between text-[0.68rem] font-mono text-muted-foreground border-b border-white/10 pb-2">
            <span>BhookhExpress Pune · 4G LTE</span>
            <span className="text-emerald-400 font-bold">100% · 12:42 PM</span>
          </div>

          {/* Screen Content Simulator */}
          <div className="my-auto py-3 space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-foreground">FC Road Dum Biryani Meal</div>
              <span className="font-mono text-xs text-indigo-300">₹320</span>
            </div>

            {/* Simulated Form Elements */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2 text-xs">
              <div className="flex justify-between text-[0.72rem] text-muted-foreground">
                <span>Subtotal (1 Item)</span>
                <span>₹320</span>
              </div>
              <div className="flex justify-between text-[0.72rem] text-muted-foreground">
                <span>Restaurant Packaging</span>
                <span>₹25</span>
              </div>

              {/* Dynamic Surcharge or Redesign Field */}
              {viewMode === "redesign" ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2.5 text-[0.72rem] text-emerald-300 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Upfront Delivery & Rain Guard</span>
                    <span>₹40</span>
                  </div>
                  <div className="text-[0.65rem] text-emerald-400/90 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> No hidden surge fees applied at CVV step.
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg border border-rose-500/30 bg-rose-950/30 p-2 text-[0.72rem] text-rose-300 flex justify-between items-center">
                  <span>Late Night Rain Surge (CVV step)</span>
                  <span className="font-bold text-rose-400">+₹65</span>
                  {viewMode === "heatmap" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-orange-500/40 to-yellow-400/30 rounded-lg animate-pulse pointer-events-none flex items-center justify-center">
                      <span className="rounded bg-black/80 px-2 py-0.5 text-[0.62rem] text-amber-300 font-mono font-bold border border-amber-400/50">
                        🔥 RAGE CLICK HOTSPOT ({activeCase.heatMapHotspot.rageClicks} clicks/min)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Coupon field simulated */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Coupon: MONSOON50</span>
              {viewMode === "redesign" ? (
                <span className="font-mono text-emerald-400 font-bold text-[0.7rem] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ₹50 Applied!
                </span>
              ) : (
                <span className="font-mono text-red-400 font-bold text-[0.7rem] flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Coupon Failed (Code: E-404)
                </span>
              )}
            </div>
          </div>

          {/* Interactive Button CTA inside Mobile Viewport */}
          <div className="border-t border-white/10 pt-3">
            {viewMode === "redesign" ? (
              <div className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-2.5 text-center font-mono text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Place Order · ₹385 Total (All-Inclusive)
              </div>
            ) : (
              <div className="w-full rounded-xl bg-indigo-600/80 p-2.5 text-center font-mono text-xs font-semibold text-white/90 flex items-center justify-center gap-1.5 opacity-90">
                <MousePointerClick className="h-3.5 w-3.5 text-indigo-200" /> Proceed to CVV Step
              </div>
            )}
          </div>
        </div>

        {/* Right: Heuristic Autopsy, Metric Delta & Hypothesis (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 font-mono text-xs">
          {/* Autopsy Diagnosis Card */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/15 p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
              <span className="text-rose-400 font-bold uppercase tracking-wider text-[0.7rem] flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" /> Autopsy Finding: {activeCase.frictionTitle}
              </span>
              <span className="text-[0.65rem] text-rose-300/80 bg-rose-500/20 px-2 py-0.5 rounded-full">
                {activeCase.heuristicViolation}
              </span>
            </div>
            <p className="text-muted-foreground text-[0.76rem] leading-relaxed">
              {activeCase.darkPattern}
            </p>
          </div>

          {/* Proposed Redesign Hypothesis */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[0.7rem] flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Empathetic Solution Hypothesis:
              </span>
              <span className="text-[0.65rem] text-emerald-300/80 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                Jury Evaluation Spec
              </span>
            </div>
            <p className="text-foreground/95 text-[0.76rem] leading-relaxed font-sans font-medium">
              {activeCase.proposedFix}
            </p>
          </div>

          {/* Measurable Conversion Delta Impact */}
          <div className="rounded-xl border border-indigo-500/30 bg-black/60 p-4">
            <div className="flex items-center justify-between text-[0.68rem] text-indigo-300 font-bold uppercase pb-2 border-b border-white/10">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Measurable Business Impact (A/B Test):
              </span>
              <span className="text-foreground">{activeCase.metricDelta.label}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-red-950/30 border border-red-500/20 p-2">
                <div className="text-[0.62rem] text-muted-foreground uppercase">Baseline Flaw</div>
                <div className="text-sm font-bold text-red-400 mt-0.5">{activeCase.metricDelta.before}</div>
              </div>
              <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/20 p-2">
                <div className="text-[0.62rem] text-muted-foreground uppercase">Post-Redesign</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{activeCase.metricDelta.after}</div>
              </div>
              <div className="rounded-lg bg-indigo-950/40 border border-indigo-500/30 p-2">
                <div className="text-[0.62rem] text-muted-foreground uppercase">Net Gain</div>
                <div className="text-xs font-bold text-indigo-300 mt-1">{activeCase.metricDelta.impact}</div>
              </div>
            </div>
          </div>

          {/* Registration & Lab Seat Reservation */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-purple-950/30 p-3">
            <div className="text-[0.7rem] text-muted-foreground">
              <strong className="text-foreground">Lab Capacity:</strong> 35 UX Bench Seats · Figma + Miro Live Access Provided
            </div>
            <button
              type="button"
              disabled={seatReserved}
              onClick={handleReserveSeat}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                seatReserved
                  ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 cursor-default"
                  : "border border-indigo-400 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:brightness-110 active:scale-95"
              }`}
            >
              {seatReserved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Lab Seat #UX-84 Confirmed
                </>
              ) : (
                <>
                  <span>Claim Teardown Bench Pass</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
