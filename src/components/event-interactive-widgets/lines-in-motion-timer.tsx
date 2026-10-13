"use client";

import { useState, useEffect } from "react";
import {
  PenTool,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Timer,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAudioCue } from "@/hooks/use-audio-cue";

interface DynamicPose {
  id: string;
  title: string;
  subject: string;
  focus: string;
  motionVectors: string;
  torqueNote: string;
  svgPath: string;
  accentColor: string;
}

const POSES: DynamicPose[] = [
  {
    id: "kathak",
    title: "Pose 1: Kathak Chakkar (Spin)",
    subject: "Classical Dancer in Pivot",
    focus: "Centrifugal skirt arcs and fluid spine torque",
    motionVectors: "Spiral radius: 1.4m · Angular velocity: ~4.2 rad/s",
    torqueNote: "Emphasize centrifugal flared hemline vs. still vertical neck axis.",
    accentColor: "#f43f5e",
    svgPath: "M 150,50 Q 140,80 150,110 Q 160,140 150,170 M 150,85 Q 90,80 60,105 M 150,85 Q 210,75 235,95 M 150,170 Q 70,220 50,250 M 150,170 Q 230,220 250,250 M 50,250 C 90,270 210,270 250,250",
  },
  {
    id: "sprinter",
    title: "Pose 2: Explosive Sprint Start",
    subject: "Track Athlete Off Blocks",
    focus: "Acute 45° forward drive and muscle extension",
    motionVectors: "Horizontal propulsion: 8.5 m/s² · Ground reaction force: 2.1 kN",
    torqueNote: "Capture the sharp diagonal line from Achilles tendon straight through the skull.",
    accentColor: "#f59e0b",
    svgPath: "M 80,180 L 140,150 L 190,120 L 230,80 M 140,150 L 110,210 L 80,240 M 190,120 L 220,170 L 260,200 M 190,120 L 160,85 M 230,80 Q 245,65 255,75 Q 245,95 230,80",
  },
  {
    id: "cellist",
    title: "Pose 3: Cellist Crescendo",
    subject: "Musician in Forte Bow Strike",
    focus: "Curving arm weight and harmonic resonance",
    motionVectors: "Bow velocity: 0.8 m/s · Shoulder elevation torque: 18 N·m",
    torqueNote: "Draw continuous bowing trajectory sweeping past the instrument's wooden rib.",
    accentColor: "#a855f7",
    svgPath: "M 130,70 Q 140,90 135,130 Q 130,170 145,230 M 135,100 Q 80,120 70,160 M 135,100 Q 210,90 230,140 M 165,110 L 115,250 M 90,210 Q 140,240 180,210",
  },
];

const TIMER_MODES = [
  { label: "30s Gesture Sprint", seconds: 30 },
  { label: "5m Dynamic Flow", seconds: 300 },
  { label: "20m Sustained Master", seconds: 1200 },
];

export function LinesInMotionTimerWidget() {
  const [activePoseIdx, setActivePoseIdx] = useState(0);
  const [mediaType, setMediaType] = useState<"digital" | "traditional">("digital");
  const [timerModeIdx, setTimerModeIdx] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(TIMER_MODES[0].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [statement, setStatement] = useState(
    "Observed the dancer's descending pivot; captured centrifugal torque using continuous gestural graphite arcs across diagonal negative space to preserve fluid kinetic velocity."
  );
  const [easelReserved, setEaselReserved] = useState(false);
  const play = useAudioCue();

  const activePose = POSES[activePoseIdx];

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            play("success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, play]);

  const handleTimerToggle = () => {
    setIsRunning(!isRunning);
    play("click");
  };

  const handleTimerReset = () => {
    setIsRunning(false);
    setSecondsRemaining(TIMER_MODES[timerModeIdx].seconds);
    play("click");
  };

  const handleModeSelect = (idx: number) => {
    setTimerModeIdx(idx);
    setIsRunning(false);
    setSecondsRemaining(TIMER_MODES[idx].seconds);
    play("click");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const wordCount = statement.trim().split(/\s+/).filter(Boolean).length;
  const isStatementValid = wordCount > 0 && wordCount <= 60;

  // Kinetic keywords detector
  const KEYWORDS = ["torque", "centrifugal", "velocity", "negative space", "kinetic", "arc", "rhythm", "weight"];
  const matchedKeywords = KEYWORDS.filter((kw) =>
    statement.toLowerCase().includes(kw)
  );

  const handleReserveEasel = () => {
    setEaselReserved(true);
    play("capture");
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#f43f5e", "#f59e0b", "#a855f7", "#38bdf8"],
    });
  };

  return (
    <div className="rounded-2xl border-2 border-fuchsia-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(217,70,239,0.14)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
            <PenTool className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
            </span>
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Lines in Motion: Kinetic Charcoal & Pose Chronograph</span>
              <span className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-[0.65rem] text-fuchsia-300 border border-fuchsia-500/30">
                LIVE LIFE-DRAWING ARENA
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              90-minute live gesture sprints capturing human momentum, dynamic torque, and emotional weight.
            </p>
          </div>
        </div>

        {/* Medium Selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setMediaType("digital");
              play("click");
            }}
            className={`rounded-lg px-2.5 py-1 transition-all ${
              mediaType === "digital"
                ? "bg-fuchsia-500/25 text-fuchsia-300 font-semibold border border-fuchsia-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Offline Tablet (Procreate/Krita)
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaType("traditional");
              play("click");
            }}
            className={`rounded-lg px-2.5 py-1 transition-all ${
              mediaType === "traditional"
                ? "bg-fuchsia-500/25 text-fuchsia-300 font-semibold border border-fuchsia-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            A3 Willow Charcoal
          </button>
        </div>
      </div>

      {/* Dynamic Pose Selector */}
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
        {POSES.map((pose, idx) => (
          <button
            key={pose.id}
            type="button"
            onClick={() => {
              setActivePoseIdx(idx);
              play("click");
            }}
            className={`rounded-xl border px-3.5 py-2 transition-all flex items-center gap-2 ${
              activePoseIdx === idx
                ? "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-300 font-bold shadow-[0_0_15px_rgba(217,70,239,0.25)]"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: pose.accentColor }}
            />
            <span>{pose.title}</span>
            <span className="text-[0.65rem] text-muted-foreground">({pose.subject})</span>
          </button>
        ))}
      </div>

      {/* Main Studio Arena: Vector Pose Sandbox & Metronome */}
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Interactive Vector Charcoal Model (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/15 bg-black/80 p-4 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
          <div className="flex items-center justify-between text-[0.68rem] font-mono text-muted-foreground border-b border-white/10 pb-2">
            <span>Model: Live Pose Feed (Studio 3B)</span>
            <span className="text-fuchsia-300 font-semibold">Real-Time Anatomy Guide</span>
          </div>

          {/* Animated SVG Gesture Trace */}
          <div className="my-auto py-4 flex flex-col items-center justify-center relative">
            <svg
              className="w-full h-48 max-w-[280px] drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              viewBox="0 0 300 300"
              fill="none"
              stroke={activePose.accentColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Dynamic gestural background motion aura */}
              <circle
                cx="150"
                cy="150"
                r="100"
                stroke="white"
                strokeOpacity="0.08"
                strokeDasharray="4 8"
                className="animate-spin"
                style={{ animationDuration: "16s" }}
              />
              <path d={activePose.svgPath} className="transition-all duration-700 ease-in-out" />
            </svg>

            {/* Kinetic Vector Overlay Info */}
            <div className="mt-2 rounded-lg bg-black/70 border border-white/10 px-3 py-1.5 text-center font-mono text-[0.7rem] text-muted-foreground">
              <span className="text-foreground font-semibold">{activePose.focus}</span>
              <div className="text-[0.65rem] text-fuchsia-300 mt-0.5">{activePose.motionVectors}</div>
            </div>
          </div>

          <div className="text-[0.68rem] font-mono text-muted-foreground border-t border-white/10 pt-2 flex items-center justify-between">
            <span>Tip: {activePose.torqueNote}</span>
          </div>
        </div>

        {/* Right: Gesture Sprint Chronograph & Statement Verifier (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 font-mono text-xs">
          {/* Pose Chronograph Sprint Metronome */}
          <div className="rounded-xl border border-white/15 bg-black/60 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5 text-fuchsia-300 font-bold uppercase text-[0.7rem]">
                <Timer className="h-4 w-4" /> Live Pose Sprint Chronograph
              </div>
              <div className="text-xl font-bold font-mono tracking-wider text-foreground">
                {formatTime(secondsRemaining)}
              </div>
            </div>

            {/* Mode selection buttons */}
            <div className="flex flex-wrap gap-2">
              {TIMER_MODES.map((mode, idx) => (
                <button
                  key={mode.label}
                  type="button"
                  onClick={() => handleModeSelect(idx)}
                  className={`rounded-lg px-2.5 py-1 text-[0.7rem] transition-all ${
                    timerModeIdx === idx
                      ? "bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/40 font-bold"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Timer controls */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTimerToggle}
                className="flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3.5 py-1.5 font-bold text-white shadow-md hover:bg-fuchsia-500 active:scale-95 transition-all text-xs"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5" /> Pause Pose
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" /> Start Pose Sprint
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleTimerReset}
                className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-muted-foreground hover:bg-white/10 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <span className="text-[0.68rem] text-muted-foreground ml-auto">
                {isRunning ? "⏱ Model holding pose..." : "Ready for next sprint"}
              </span>
            </div>
          </div>

          {/* 60-Word Artist Statement Verifier */}
          <div className="rounded-xl border border-white/15 bg-black/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-[0.68rem] uppercase">
              <span className="text-muted-foreground font-bold">
                Mandatory Artist Statement (10% Jury Rubric):
              </span>
              <span className={isStatementValid ? "text-fuchsia-300 font-bold" : "text-rose-400 font-bold"}>
                {wordCount} / 60 Words
              </span>
            </div>
            <textarea
              rows={2}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/80 p-2.5 text-foreground text-[0.74rem] leading-relaxed focus:border-fuchsia-400 focus:outline-none"
              placeholder="State how you interpreted the subject's velocity, torque, or weight..."
            />
            {/* Detected kinetic keywords badge */}
            <div className="flex flex-wrap items-center gap-1.5 text-[0.65rem] text-muted-foreground pt-1">
              <span>Detected Gesture Nuances:</span>
              {matchedKeywords.length > 0 ? (
                matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded bg-fuchsia-500/20 border border-fuchsia-500/30 px-1.5 py-0.5 text-fuchsia-300 font-medium"
                  >
                    ✓ {kw}
                  </span>
                ))
              ) : (
                <span className="text-rose-400">Add kinetic terms (e.g., torque, arc, velocity)</span>
              )}
            </div>
          </div>

          {/* Easel Pass Reservation Hook */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-950/30 to-purple-950/30 p-3">
            <div className="text-[0.7rem] text-muted-foreground">
              <strong className="text-foreground">Easel Capacity:</strong> 40 Drawing Desks · Willow Charcoal & Erasers Supplied
            </div>
            <button
              type="button"
              disabled={easelReserved}
              onClick={handleReserveEasel}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                easelReserved
                  ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 cursor-default"
                  : "border border-fuchsia-400 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/25 hover:brightness-110 active:scale-95"
              }`}
            >
              {easelReserved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Easel Pass #LIM-ART-882 Confirmed
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Reserve Live Drawing Easel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
