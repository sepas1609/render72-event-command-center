"use client";

import { useState } from "react";
import { Code2, BookOpen } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

export function CodeCurrentSimulatorWidget() {
  const [language, setLanguage] = useState<"cpp" | "python" | "java">("cpp");
  const [rejectedCount, setRejectedCount] = useState(2);
  const [solveMinutes, setSolveMinutes] = useState(48);
  const [showCounterexample, setShowCounterexample] = useState(false);
  const play = useAudioCue();

  // Official contest rule: Each rejected submission before AC adds 20 minutes penalty
  const totalPenalty = solveMinutes + rejectedCount * 20;

  const codeSnippets = {
    cpp: `// CodeCurrent Problem D: Dynamic Programming Finale
#include <bits/stdc++.h>
using namespace std;

long long solve(vector<pair<int, int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    int n = intervals.size();
    vector<long long> dp(n + 1, 0);
    // DP transition with binary search on non-overlapping intervals
    for (int i = 0; i < n; i++) {
        int idx = upper_bound(intervals.begin(), intervals.begin() + i, 
                              make_pair(intervals[i].first, INT_MAX)) - intervals.begin() - 1;
        dp[i + 1] = max(dp[i], (idx >= 0 ? dp[idx + 1] : 0) + 1);
    }
    return dp[n];
}`,
    python: `# CodeCurrent Problem D: Dynamic Programming Finale
import bisect

def solve(intervals):
    intervals.sort()
    n = len(intervals)
    dp = [0] * (n + 1)
    starts = [x[0] for x in intervals]
    for i in range(n):
        idx = bisect.bisect_right(starts[:i], intervals[i][0]) - 1
        prev_val = dp[idx + 1] if idx >= 0 else 0
        dp[i + 1] = max(dp[i], prev_val + 1)
    return dp[n]`,
    java: `// CodeCurrent Problem D: Dynamic Programming Finale
import java.util.*;

public class Solution {
    public static int solve(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        int n = intervals.length;
        int[] dp = new int[n + 1];
        for (int i = 0; i < n; i++) {
            int low = 0, high = i - 1, best = -1;
            while (low <= high) {
                int mid = (low + high) / 2;
                if (intervals[mid][1] <= intervals[i][0]) {
                    best = mid;
                    low = mid + 1;
                } else high = mid - 1;
            }
            dp[i + 1] = Math.max(dp[i], (best >= 0 ? dp[best + 1] : 0) + 1);
        }
        return dp[n];
    }
}`,
  };

  return (
    <div className="rounded-2xl border-2 border-[var(--neon-cyan)]/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(0,240,255,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>CodeCurrent Online Judge & Penalty Simulator</span>
              <span className="rounded-full bg-[var(--neon-cyan)]/20 px-2 py-0.5 text-[0.65rem] text-[var(--neon-cyan)]">
                SIMULATION DESK
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Official ICPC-style penalty calculation and greedy vs DP counterexample debugger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(["cpp", "python", "java"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setLanguage(lang);
                play("click");
              }}
              className={`rounded-lg border px-2.5 py-1 font-mono text-xs uppercase transition-all ${
                language === lang
                  ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {lang === "cpp" ? "C++20" : lang === "python" ? "Python 3" : "Java 17"}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 text-[0.7rem] text-muted-foreground border-b border-white/10">
          <span>Problem D: Interval Reasoning & Dynamic Programming Finale</span>
          <span className="text-emerald-400">Accepted Solution Verified (0.04s)</span>
        </div>
        <pre className="mt-3 overflow-x-auto text-[var(--neon-cyan)] leading-relaxed whitespace-pre font-mono text-[0.75rem]">
          {codeSnippets[language]}
        </pre>
      </div>

      {/* Interactive Penalty & Scoreboard Simulator */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono">
          <label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground block">
            Time of Acceptance (Minutes)
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={10}
              max={180}
              value={solveMinutes}
              onChange={(e) => setSolveMinutes(Number(e.target.value))}
              className="flex-1 accent-[var(--neon-cyan)]"
            />
            <span className="font-bold text-foreground text-sm">{solveMinutes}m</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono">
          <label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground block">
            Rejected Attempts Before AC
          </label>
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setRejectedCount(Math.max(0, rejectedCount - 1));
                play("click");
              }}
              className="h-7 w-7 rounded bg-white/10 text-foreground font-bold hover:bg-white/20"
            >
              -
            </button>
            <span className="font-bold text-amber-400 text-sm">
              {rejectedCount} ({rejectedCount * 20}m penalty)
            </span>
            <button
              type="button"
              onClick={() => {
                setRejectedCount(rejectedCount + 1);
                play("click");
              }}
              className="h-7 w-7 rounded bg-white/10 text-foreground font-bold hover:bg-white/20"
            >
              +
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 p-4 font-mono flex flex-col justify-center">
          <div className="text-[0.7rem] uppercase tracking-wider text-[var(--neon-cyan)] font-semibold">
            Official Ranked Penalty
          </div>
          <div className="mt-1 text-xl font-extrabold text-foreground">
            {totalPenalty} <span className="text-xs font-normal text-muted-foreground">penalty minutes</span>
          </div>
        </div>
      </div>

      {/* Counterexample Insight Drawer */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setShowCounterexample(!showCounterexample);
            play("click");
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
        >
          <BookOpen className="h-4 w-4" />
          <span>{showCounterexample ? "Hide Editorial Counterexample" : "Inspect Why Greedy Approach Failed (Editorial)"}</span>
        </button>

        {showCounterexample && (
          <div className="mt-3 rounded-xl border border-amber-500/20 bg-black/60 p-4 text-xs font-mono text-muted-foreground space-y-2 animate-in fade-in">
            <div className="text-amber-300 font-bold">
              [!] Editorial Counterexample for Problem D:
            </div>
            <p>
              A common pitfall was greedily picking the interval with the earliest start time or shortest duration. 
              Consider the input set: <code className="text-foreground">[ [1, 10, value: 5], [2, 4, value: 3], [5, 9, value: 4] ]</code>.
            </p>
            <p className="text-foreground/90">
              - Greedy (earliest start): selects <code className="text-[var(--neon-rose)]">[1, 10]</code> → Total value = 5.
              <br />
              - Optimal DP: selects <code className="text-[var(--neon)]">[2, 4]</code> and <code className="text-[var(--neon)]">[5, 9]</code> → Total value = 7!
            </p>
            <div className="text-[0.7rem] text-emerald-400">
              Verified: Dynamic programming with coordinate compression yields strictly optimal O(N log N) runtime.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
