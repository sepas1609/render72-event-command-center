"use client";

import { useState } from "react";
import { MessageSquare, RotateCcw } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const SUGGESTIONS = [
  { location: "Inside a museum storage vault after midnight", relationship: "Two competitive librarians hiding from security", obstacle: "Every floor tile makes an accordion squeak" },
  { location: "Onboard a hot air balloon over Pune", relationship: "A pilot and a superstitious passenger who brought a parrot", obstacle: "The navigation map blew away into a cloud" },
  { location: "Behind the counter of an artisanal chai stall", relationship: "Estranged siblings who both inherited half the recipe", obstacle: "A demanding food critic is waiting outside" },
];

export function YesAndImprovGeneratorWidget() {
  const [activeIdx, setActiveIdx] = useState(0);
  const play = useAudioCue();

  const cur = SUGGESTIONS[activeIdx];

  return (
    <div className="rounded-2xl border-2 border-yellow-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(234,179,8,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Yes, And: Campus Improv Prompt & Scene Desk</span>
              <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[0.65rem] text-yellow-300">
                BLACK BOX THEATRE
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Live audience prompt generator and 3-game short-form tournament format.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveIdx((activeIdx + 1) % SUGGESTIONS.length);
            play("click");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-500/40 bg-yellow-500/20 px-3 py-1 font-mono text-xs text-yellow-300 hover:bg-yellow-500/30"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Next Live Prompt
        </button>
      </div>

      {/* Generated Improv Offer */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Unlikely Location:</span>
          <div className="mt-1 font-bold text-yellow-400 text-sm">{cur.location}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Relationship Under Pressure:</span>
          <div className="mt-1 font-semibold text-foreground text-[0.75rem]">{cur.relationship}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Surprise Physical Obstacle:</span>
          <div className="mt-1 font-bold text-emerald-400 text-[0.75rem]">{cur.obstacle}</div>
        </div>
      </div>
    </div>
  );
}
