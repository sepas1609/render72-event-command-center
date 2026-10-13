"use client";

import { useState } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function PhotoWalkEssayBuilderWidget() {
  const [essayTitle, setEssayTitle] = useState("Quiet Morning in the Mechanical Courtyard");
  const [captions, setCaptions] = useState([
    "08:15 IST - Head gardener arranging earthen saplings before student rush.",
    "08:42 IST - Sunbeam slicing through the wooden workshop rafters as lathe oils warm up.",
    "09:10 IST - First bicycle resting against the stone colonnade under dew-dappled foliage.",
  ]);
  const [hasPortraitConsent, setHasPortraitConsent] = useState(true);
  const [hasNoGenerativeEdits, setHasNoGenerativeEdits] = useState(true);
  const play = useAudioCue();

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const isAllUnder40Words = captions.every((c) => getWordCount(c) <= 40);

  return (
    <div className="rounded-2xl border-2 border-amber-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Between Lectures 3-Image Photo Essay Workbench</span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.65rem] text-amber-300">
                MEDIA LAB DESK
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Rubric validation: Story coherence (40%), composition (30%), ethics (20%), caption clarity (10%).
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          {isAllUnder40Words && hasPortraitConsent && hasNoGenerativeEdits ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Rubric Compliant
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-amber-400">
              Needs Review
            </span>
          )}
        </div>
      </div>

      {/* Essay Title */}
      <div className="mt-4 font-mono text-xs">
        <label className="text-muted-foreground text-[0.68rem] uppercase">Essay Title (Prompt: &ldquo;Work before the crowd arrives&rdquo;):</label>
        <input
          type="text"
          value={essayTitle}
          onChange={(e) => setEssayTitle(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-foreground font-semibold focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* 3 Image Captions */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 font-mono text-xs">
        {captions.map((cap, i) => {
          const wc = getWordCount(cap);
          const isOver = wc > 40;

          return (
            <div key={i} className="rounded-xl border border-white/10 bg-black/50 p-3">
              <div className="flex items-center justify-between text-muted-foreground pb-1.5 border-b border-white/10 text-[0.68rem]">
                <span>Frame #{i + 1} Caption</span>
                <span className={isOver ? "text-red-400 font-bold" : "text-amber-400"}>
                  {wc} / 40 Words
                </span>
              </div>
              <textarea
                rows={3}
                value={cap}
                onChange={(e) => {
                  const updated = [...captions];
                  updated[i] = e.target.value;
                  setCaptions(updated);
                }}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/60 p-2 text-foreground/90 text-[0.72rem] focus:border-amber-400 focus:outline-none"
              />
            </div>
          );
        })}
      </div>

      {/* Ethical Rules Verification */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-black/60 p-4 font-mono text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasPortraitConsent}
            onChange={(e) => {
              setHasPortraitConsent(e.target.checked);
              play("click");
            }}
            className="accent-amber-400"
          />
          <span className="text-foreground/90">Signed subject consent for recognizable portraits (20% rubric)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasNoGenerativeEdits}
            onChange={(e) => {
              setHasNoGenerativeEdits(e.target.checked);
              play("click");
            }}
            className="accent-amber-400"
          />
          <span className="text-foreground/90">No generative AI fills or object removals (Only exposure/crop)</span>
        </label>
      </div>
    </div>
  );
}
