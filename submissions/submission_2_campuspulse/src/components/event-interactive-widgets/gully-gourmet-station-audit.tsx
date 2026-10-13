"use client";

import { useState } from "react";
import { Utensils, CheckCircle2 } from "lucide-react";

export function GullyGourmetStationAuditWidget() {
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [hasAllergenLabels, setHasAllergenLabels] = useState(true);
  const portionCount = 8;

  // Rules:
  // 1. Strictly vegetarian (no eggs/meat/fish)
  // 2. Exactly 8 tasting portions
  // 3. Clear allergen labels (nuts, dairy, gluten, sesame)
  const isCompliant = isVegetarian && hasAllergenLabels && portionCount === 8;

  return (
    <div className="rounded-2xl border-2 border-amber-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Gully Gourmet Induction Station & Allergen Audit</span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.65rem] text-amber-300">
                TRAINING KITCHEN
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              8-portion tasting quota, mandatory allergen declaration, and induction hob safety check.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs">
          {isCompliant ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Hygiene & Portion Cleared
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-red-400">
              Allergen or Portion Defect
            </span>
          )}
        </div>
      </div>

      {/* Safety Matrix */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Tasting Portions Quota:</span>
          <div className="mt-1 font-bold text-amber-400 text-base">{portionCount} Portions for Jury</div>
          <div className="mt-1 text-[0.7rem] text-muted-foreground">Supervised judged tasting only (no public sale).</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Dietary Strictness:</span>
          <label className="mt-2 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
              className="accent-amber-400"
            />
            <span className="text-foreground">100% Vegetarian Certified</span>
          </label>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/50 p-4">
          <span className="text-muted-foreground uppercase text-[0.68rem]">Allergen Disclosure:</span>
          <label className="mt-2 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasAllergenLabels}
              onChange={(e) => setHasAllergenLabels(e.target.checked)}
              className="accent-amber-400"
            />
            <span className="text-foreground">Declared Nuts/Dairy/Gluten/Sesame</span>
          </label>
        </div>
      </div>
    </div>
  );
}
