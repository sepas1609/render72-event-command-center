"use client";

import { useCallback, useRef } from "react";
import { useCtfStore } from "@/lib/ctf-store";

/**
 * Lightweight audio cue hook using Web Audio API. No assets, no autoplay.
 * Honors the user's audio toggle in the CTF store; safe to call SSR-side
 * (it no-ops on the server).
 */
export type Cue = "tick" | "success" | "error" | "blip" | "open" | "click" | "alert" | "capture";

export function useAudioCue() {
  const enabled = useCtfStore((s) => s.audioEnabled);
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(
    (cue: Cue) => {
      if (!enabled) return;
      if (typeof window === "undefined") return;
      try {
        const AudioCtx =
          window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new AudioCtx();
        const ctx = ctxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const t = ctx.currentTime;
        switch (cue) {
          case "tick":
          case "click":
            osc.type = "square";
            osc.frequency.setValueAtTime(880, t);
            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
            osc.start(t);
            osc.stop(t + 0.06);
            break;
          case "alert":
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, t);
            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
            osc.start(t);
            osc.stop(t + 0.22);
            break;
          case "capture":
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, t);
            osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.18);
            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
            osc.start(t);
            osc.stop(t + 0.24);
            break;
          case "blip":
            osc.type = "sine";
            osc.frequency.setValueAtTime(660, t);
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
            osc.start(t);
            osc.stop(t + 0.09);
            break;
          case "success":
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, t);
            osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.18);
            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
            osc.start(t);
            osc.stop(t + 0.24);
            break;
          case "error":
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, t);
            osc.frequency.exponentialRampToValueAtTime(110, t + 0.2);
            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
            osc.start(t);
            osc.stop(t + 0.26);
            break;
          case "open":
            osc.type = "triangle";
            osc.frequency.setValueAtTime(440, t);
            osc.frequency.exponentialRampToValueAtTime(660, t + 0.12);
            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
            osc.start(t);
            osc.stop(t + 0.16);
            break;
        }
      } catch {
        /* never throw on audio failure */
      }
    },
    [enabled],
  );

  return play;
}
