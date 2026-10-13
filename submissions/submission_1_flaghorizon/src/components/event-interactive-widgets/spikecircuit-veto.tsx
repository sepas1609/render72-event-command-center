"use client";

import { useState } from "react";
import { Swords, RotateCcw } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const MAP_POOL = [
  { id: "ascent", name: "Ascent", callout: "Mid Control & Market Arch" },
  { id: "bind", name: "Bind", callout: "Teleporters & Hookah Choke" },
  { id: "haven", name: "Haven", callout: "Three Sites (A / B / C)" },
  { id: "split", name: "Split", callout: "Ropes & Mid Vents" },
  { id: "sunset", name: "Sunset", callout: "Bobbys & Courtyard" },
  { id: "lotus", name: "Lotus", callout: "Rotating Doors & Mound" },
];

export function SpikeCircuitVetoWidget() {
  const [bannedMaps, setBannedMaps] = useState<string[]>([]);
  const [pickedMaps, setPickedMaps] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<"Team Alpha (Ban)" | "Team Omega (Ban)" | "Team Alpha (Pick)" | "Team Omega (Pick)" | "Decider Locked">("Team Alpha (Ban)");
  const [techPausesLeft, setTechPausesLeft] = useState(2);
  const play = useAudioCue();

  const handleMapAction = (mapId: string) => {
    if (bannedMaps.includes(mapId) || pickedMaps.includes(mapId)) return;

    if (bannedMaps.length === 0) {
      setBannedMaps([mapId]);
      setCurrentTurn("Team Omega (Ban)");
      play("click");
    } else if (bannedMaps.length === 1) {
      setBannedMaps([...bannedMaps, mapId]);
      setCurrentTurn("Team Alpha (Pick)");
      play("click");
    } else if (pickedMaps.length === 0) {
      setPickedMaps([mapId]);
      setCurrentTurn("Team Omega (Pick)");
      play("click");
    } else if (pickedMaps.length === 1) {
      setPickedMaps([...pickedMaps, mapId]);
      setCurrentTurn("Decider Locked");
      play("capture");
    }
  };

  const handleReset = () => {
    setBannedMaps([]);
    setPickedMaps([]);
    setCurrentTurn("Team Alpha (Ban)");
    setTechPausesLeft(2);
    play("click");
  };

  return (
    <div className="rounded-2xl border-2 border-red-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
            <Swords className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>SpikeCircuit Tactical Map Veto & LAN Referee Console</span>
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[0.65rem] text-red-300">
                LAN ARENA
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Official BO3 map veto sequence with technical pause tracker and observer feed status.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Veto
        </button>
      </div>

      {/* Phase Banner */}
      <div className="mt-4 flex flex-wrap items-center justify-between rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs">
        <div>
          <span className="text-muted-foreground">Current Phase:</span>{" "}
          <span className="font-bold text-red-400">{currentTurn}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">LAN Tech Pauses:</span>
          <span className="font-bold text-emerald-400">{techPausesLeft} Remaining (Max 5m each)</span>
          <button
            type="button"
            disabled={techPausesLeft <= 0}
            onClick={() => {
              if (techPausesLeft > 0) {
                setTechPausesLeft(techPausesLeft - 1);
                play("alert");
              }
            }}
            className="rounded bg-white/10 px-2 py-0.5 text-[0.7rem] hover:bg-white/20 disabled:opacity-40"
          >
            Call Pause
          </button>
        </div>
      </div>

      {/* Interactive Map Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 font-mono">
        {MAP_POOL.map((m) => {
          const isBanned = bannedMaps.includes(m.id);
          const isPicked = pickedMaps.includes(m.id);

          return (
            <button
              key={m.id}
              type="button"
              disabled={isBanned || isPicked || currentTurn === "Decider Locked"}
              onClick={() => handleMapAction(m.id)}
              className={`rounded-xl border p-3 text-left transition-all relative overflow-hidden ${
                isBanned
                  ? "border-red-500/40 bg-red-950/20 opacity-50 cursor-not-allowed"
                  : isPicked
                  ? "border-emerald-500/50 bg-emerald-950/25 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "border-white/10 bg-black/40 hover:border-red-400 hover:bg-red-500/10"
              }`}
            >
              {isBanned && (
                <span className="absolute top-1.5 right-1.5 text-[0.6rem] font-bold text-red-400 uppercase">
                  BANNED
                </span>
              )}
              {isPicked && (
                <span className="absolute top-1.5 right-1.5 text-[0.6rem] font-bold text-emerald-400 uppercase">
                  PICKED
                </span>
              )}
              <div className="text-sm font-bold text-foreground">{m.name}</div>
              <div className="text-[0.65rem] text-muted-foreground mt-1 line-clamp-1">
                {m.callout}
              </div>
            </button>
          );
        })}
      </div>

      {/* Veto Output Summary */}
      <div className="mt-4 rounded-xl border border-red-500/20 bg-black/70 p-4 font-mono text-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-muted-foreground">Banned:</span>{" "}
          <span className="text-red-400 font-semibold">
            {bannedMaps.length > 0 ? bannedMaps.join(", ").toUpperCase() : "None"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Picked for Match:</span>{" "}
          <span className="text-emerald-400 font-semibold">
            {pickedMaps.length > 0 ? pickedMaps.join(", ").toUpperCase() : "None"}
          </span>
        </div>
        <div className="text-[0.7rem] text-muted-foreground">
          LAN Referee Delay Feed: <span className="text-emerald-400 font-bold">ACTIVE (90s Delay)</span>
        </div>
      </div>
    </div>
  );
}
