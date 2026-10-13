"use client";

import { useState } from "react";
import { Cpu, Zap } from "lucide-react";

export function LightwearCircuitStudioWidget() {
  const [ledCount, setLedCount] = useState(8);
  const [brightness, setBrightness] = useState(70);
  const [motionIntensity, setMotionIntensity] = useState(65);

  // Full brightness white draws ~60mA per pixel; dynamic color average ~25mA * brightness factor
  const currentDrawMa = Math.round(ledCount * 25 * (brightness / 100));
  const estimatedBatteryLifeHours = (500 / currentDrawMa).toFixed(1);

  return (
    <div className="rounded-2xl border-2 border-amber-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Lightwear Arduino Wearable Power & LED Studio</span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.65rem] text-amber-300">
                MAKER LAB
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Accelerometer motion response, WS2812B current limits, and battery isolation verifier.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs flex items-center gap-1.5 text-amber-300 font-semibold">
          <Zap className="h-4 w-4 text-amber-400" />
          <span>{currentDrawMa} mA Draw (~{estimatedBatteryLifeHours}h Battery Life)</span>
        </div>
      </div>

      {/* Calibration Controls */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Addressable LEDs:</span>
            <span className="font-bold text-foreground text-sm">{ledCount} Pixels</span>
          </div>
          <input
            type="range"
            min={4}
            max={16}
            value={ledCount}
            onChange={(e) => setLedCount(Number(e.target.value))}
            className="mt-3 w-full accent-amber-400"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Brightness Ceiling:</span>
            <span className="font-bold text-foreground text-sm">{brightness}%</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="mt-3 w-full accent-amber-400"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Motion G-Force Threshold:</span>
            <span className="font-bold text-amber-400 text-sm">{motionIntensity}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={motionIntensity}
            onChange={(e) => setMotionIntensity(Number(e.target.value))}
            className="mt-3 w-full accent-amber-400"
          />
        </div>
      </div>
    </div>
  );
}
