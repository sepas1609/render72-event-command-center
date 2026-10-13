"use client";

import { useState } from "react";
import { Code } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function AccessByDesignFormRepairWidget() {
  const [isRepaired, setIsRepaired] = useState(false);
  const play = useAudioCue();

  return (
    <div className="rounded-2xl border-2 border-cyan-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(6,182,212,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Access by Design: Semantic HTML Form Repair Sandbox</span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[0.65rem] text-cyan-300">
                LIVE REPAIR LAB
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Repair inaccessible div-soup into semantic HTML with proper accessible names and live regions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsRepaired(!isRepaired);
            play("click");
          }}
          className={`rounded-xl border px-4 py-1.5 font-mono text-xs font-bold transition-all ${
            isRepaired
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
              : "border-cyan-400 bg-cyan-500/20 text-cyan-300"
          }`}
        >
          {isRepaired ? "Revert to Inaccessible Code" : "Apply Semantic HTML Fix"}
        </button>
      </div>

      {/* Code Viewer & Screen Reader Simulator */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/80 p-4">
          <div className="text-muted-foreground text-[0.68rem] uppercase pb-2 border-b border-white/10">
            {isRepaired ? "Repaired Accessible Code:" : "Original Inaccessible Markup:"}
          </div>
          <pre className="mt-3 text-[0.72rem] leading-relaxed overflow-x-auto text-cyan-300">
            {isRepaired
              ? `<form aria-labelledby="form-title">
  <label for="gpa-input">CGPA Score</label>
  <input 
    id="gpa-input" 
    type="number" 
    step="0.01" 
    required 
    aria-describedby="gpa-hint" 
  />
  <span id="gpa-hint">Scale from 0.00 to 10.00</span>
  <button type="submit">Submit</button>
</form>`
              : `<!-- Inaccessible Div-Soup -->
<div class="form-wrapper">
  <span>CGPA Score</span>
  <div class="custom-input" onclick="focusInput()">
    <input class="invisible-input" />
  </div>
  <div class="btn" onclick="submitForm()">Submit</div>
</div>`}
          </pre>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="text-muted-foreground text-[0.68rem] uppercase pb-2 border-b border-white/10">
            Screen Reader Spoken Output:
          </div>
          <div className="mt-3 p-3 rounded bg-white/5 border border-white/10 text-[0.75rem] leading-relaxed text-foreground/90">
            {isRepaired
              ? '🔊 "CGPA Score, edit text, required, Scale from 0.00 to 10.00, Submit, button."'
              : '🔇 "Text: CGPA Score, unlabelled text field, unlabelled clickable area. [User trapped, cannot submit via keyboard]."'}
          </div>
        </div>
      </div>
    </div>
  );
}
