"use client";

import { useState } from "react";
import { CircleDot, CheckCircle2 } from "lucide-react";

export function PinchPotStudioGuideWidget() {
  const [bowlWidthCm, setBowlWidthCm] = useState(10.5);
  const [wallThicknessMm, setWallThicknessMm] = useState(7);

  // Rules:
  // 1. Each piece up to 12 cm wide
  // 2. Wall thickness optimal between 6mm and 9mm to prevent cracking
  // 3. Firing & collection planned for 5 December (3 weeks drying/bisque/glaze)
  const isWidthCompliant = bowlWidthCm <= 12.0;
  const isThicknessOptimal = wallThicknessMm >= 6 && wallThicknessMm <= 9;

  return (
    <div className="rounded-2xl border-2 border-orange-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(249,115,22,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
            <CircleDot className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Earth in Your Hands: Ceramic Studio Kiln Scheduler</span>
              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[0.65rem] text-orange-300">
                CERAMICS STUDIO
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Wall thickness consistency validator and 3-week kiln firing timeline scheduler.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          {isWidthCompliant && isThicknessOptimal ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Kiln Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-orange-400">
              Risk of Firing Cracks
            </span>
          )}
        </div>
      </div>

      {/* Dimensions & Thickness Calibration */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Piece Diameter (Max 12 cm):</span>
            <span className={`font-bold text-sm ${bowlWidthCm > 12 ? "text-red-400" : "text-foreground"}`}>
              {bowlWidthCm} cm
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={15}
            step={0.5}
            value={bowlWidthCm}
            onChange={(e) => setBowlWidthCm(Number(e.target.value))}
            className="mt-3 w-full accent-orange-400"
          />
          {bowlWidthCm > 12 && (
            <div className="mt-2 text-red-400 text-[0.7rem]">
              Exceeds 12 cm studio shelf limit for included kiln firing.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase text-[0.68rem]">Wall Thickness (Optimal 6-9 mm):</span>
            <span className={`font-bold text-sm ${isThicknessOptimal ? "text-emerald-400" : "text-orange-400"}`}>
              {wallThicknessMm} mm
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={14}
            value={wallThicknessMm}
            onChange={(e) => setWallThicknessMm(Number(e.target.value))}
            className="mt-3 w-full accent-orange-400"
          />
          {!isThicknessOptimal && (
            <div className="mt-2 text-orange-400 text-[0.7rem]">
              {wallThicknessMm < 6
                ? "Too thin: Rim may warp or collapse during drying."
                : "Too thick: Internal moisture pocket may cause kiln fractures."}
            </div>
          )}
        </div>
      </div>

      {/* 3-Week Firing Pipeline */}
      <div className="mt-4 rounded-xl border border-orange-500/20 bg-black/60 p-4 font-mono text-xs">
        <div className="text-[0.68rem] text-orange-400 font-bold uppercase pb-2 border-b border-orange-500/20">
          Official 3-Week Drying & Kiln Cycle:
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 text-[0.72rem] text-muted-foreground">
          <div>
            <strong className="text-foreground">Week 1 (Nov 14-20):</strong> Controlled moisture damp-box drying.
          </div>
          <div>
            <strong className="text-foreground">Week 2 (Nov 21-27):</strong> 950°C Bisque firing & transparent glaze dip.
          </div>
          <div>
            <strong className="text-foreground">Week 3 (Dec 05):</strong> Studio collection window opens for dry pottery.
          </div>
        </div>
      </div>
    </div>
  );
}
