"use client";

import { useState } from "react";
import { Clapperboard, Sparkles } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const PROMPT_COMBOS = [
  { genre: "Psychological Noir", line: "“You can’t rewind what the rain washed away.”", prop: "A rusted brass padlock" },
  { genre: "Campus Satire", line: "“Nobody questions the third printer on the second floor.”", prop: "A cold blue umbrella" },
  { genre: "Magical Realism", line: "“If the tea gets cold, the conversation never happened.”", prop: "An antique pocket watch" },
];

export function Frame48PromptSandboxWidget() {
  const [comboIdx, setComboIdx] = useState(0);
  const play = useAudioCue();

  const prompt = PROMPT_COMBOS[comboIdx];

  return (
    <div className="rounded-2xl border-2 border-red-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
            <Clapperboard className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Frame / Forty-Eight Creative Prompt Sandbox</span>
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[0.65rem] text-red-300">
                48H FILM SPRINT
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Surprise prompt generator, 3-5 min runtime compliance, and Sunday 10:00 upload deadline.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setComboIdx((comboIdx + 1) % PROMPT_COMBOS.length);
            play("click");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-1 font-mono text-xs text-red-300 hover:bg-red-500/30"
        >
          <Sparkles className="h-3.5 w-3.5" /> Next Surprise Prompt
        </button>
      </div>

      {/* Generated 48H Prompt Elements */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Assigned Genre:</span>
          <div className="mt-1 font-bold text-red-400 text-sm">{prompt.genre}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Mandatory Dialogue Line:</span>
          <div className="mt-1 font-semibold text-foreground text-[0.75rem] italic">{prompt.line}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Everyday Prop:</span>
          <div className="mt-1 font-bold text-amber-400 text-sm">{prompt.prop}</div>
        </div>
      </div>
    </div>
  );
}
