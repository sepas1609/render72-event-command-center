"use client";

import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Lightbulb,
  Send,
  TerminalSquare,
  TriangleAlert,
  Wand2,
} from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "web", label: "Web Exploit", color: "var(--neon)" },
  { id: "forensics", label: "Forensics", color: "var(--neon-cyan)" },
  { id: "crypto", label: "Cryptography", color: "var(--neon-violet)" },
  { id: "re", label: "Reverse Eng", color: "var(--neon-amber)" },
] as const;

type Cat = (typeof CATEGORIES)[number];

const CHALLENGES: Array<{
  cat: Cat["id"];
  title: string;
  prompt: string;
  hint: string;
  solutionHint: string;
  flag: string;
  points: number;
}> = [
  {
    cat: "web",
    title: "Cookie Inspector",
    prompt:
      "Inspect the cookie jar. The session cookie contains a base64-encoded payload. Decode it and identify the embedded token.",
    hint: "Look at the segment 'eyJ1c2VyIjoiY3RmX29wZXJhdG9yIn0=' — Base64 decoding reveals {\"user\":\"ctf_operator\"}.",
    solutionHint: "Decode token to extract operator credential",
    flag: "flag{cookie_inspector_verified}",
    points: 250,
  },
  {
    cat: "forensics",
    title: "Stego Whisper",
    prompt:
      "An image was shipped through campus mail. A trailing marker is appended after the PNG IEND chunk. Recover it.",
    hint: "The bytes appended after '49 45 4E 44' (IEND) contain the plain UTF-8 secret flag.",
    solutionHint: "Dump hex trailing bytes",
    flag: "flag{stego_whisper_extracted}",
    points: 350,
  },
  {
    cat: "crypto",
    title: "ROT-N Caesars",
    prompt:
      "A ROT cipher hides the campus cipher key. The shift is 7 (the founding day number).",
    hint: "Apply ROT-7 on ciphertext 'synt{pn71cn_pn7yxn_frronfrq}'. Each letter shifts forward by 7 positions.",
    solutionHint: "Rotate alphabet by 7 chars",
    flag: "flag{ca77er_ca7chan_seeded}",
    points: 200,
  },
  {
    cat: "re",
    title: "Tiny Loader",
    prompt:
      "A 64-byte toy binary contains a hand-rolled string compare. The expected input is the flag.",
    hint: "Disassemble at call site: CMP [rbx], 0x66, 0x6c, 0x61, 0x67...",
    solutionHint: "Trace machine opcode comparison",
    flag: "flag{tiny_loader_disarmed}",
    points: 450,
  },
];

export function SandboxWidget() {
  const [active, setActive] = useState(CHALLENGES[0].cat);
  const challenge = useMemo(
    () => CHALLENGES.find((c) => c.cat === active) ?? CHALLENGES[0],
    [active],
  );
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<
    Array<{ id: number; ok: boolean; ts: number; value: string; chal: string }>
  >([]);
  const [solvedFlags, setSolvedFlags] = useState<string[]>([]);
  const [nextId, setNextId] = useState(1);
  const play = useAudioCue();

  const isSolved = solvedFlags.includes(challenge.flag);

  const onSubmit = (value: string) => {
    if (!value.trim()) return;
    const ok = value.trim() === challenge.flag;
    setHistory((h) => [
      { id: nextId, ok, ts: Date.now(), value: value.trim(), chal: challenge.title },
      ...h.slice(0, 5),
    ]);
    setNextId((n) => n + 1);

    if (ok) {
      play("success");
      if (!solvedFlags.includes(challenge.flag)) {
        setSolvedFlags([...solvedFlags, challenge.flag]);
      }
      // Trigger confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00ff9f", "#00f0ff", "#ff007f", "#ffb700"],
      });
      setInputVal("");
    } else {
      play("error");
    }
  };

  const autofillFlag = () => {
    setInputVal(challenge.flag);
    play("blip");
  };

  return (
    <section
      id="sandbox"
      aria-labelledby="sb-title"
      className="relative scroll-mt-24 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--neon)]">
          <TerminalSquare className="h-4 w-4" aria-hidden="true" />
          <span>Interactive Flag Sandbox</span>
        </div>
        <h2
          id="sb-title"
          className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
        >
          Capture The Flag Submission Arena
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Test your exploit skills directly in this browser terminal. Pick a challenge category, inspect the prompt, and submit the flag. Correct flags trigger live audio verification and visual particle celebration.
        </p>

        {/* Category Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isCatSolved = solvedFlags.includes(
              CHALLENGES.find((c) => c.cat === cat.id)?.flag ?? "",
            );
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActive(cat.id);
                  play("tick");
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all",
                  active === cat.id
                    ? "bg-[var(--neon)] text-[var(--primary-foreground)] font-bold shadow-[0_0_20px_oklch(0.86_0.24_152/30%)]"
                    : "border border-white/10 bg-[#0c1122]/80 text-muted-foreground hover:bg-white/10 hover:text-foreground",
                )}
              >
                <span>{cat.label}</span>
                {isCatSolved && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-950 font-bold" />
                )}
              </button>
            );
          })}
        </div>

        {/* Challenge Terminal Box */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#090d18]/95 shadow-2xl">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-black/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                ctf_sandbox@{challenge.cat}:~
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[var(--neon-amber)] font-bold">+{challenge.points} PTS</span>
              {isSolved && (
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400 text-[0.65rem] font-bold border border-emerald-500/30">
                  FLAG_CAPTURED
                </span>
              )}
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Target Challenge:
              </div>
              <h3 className="mt-1 font-mono text-xl font-bold text-foreground">
                {challenge.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground/90 font-mono">
                {challenge.prompt}
              </p>
            </div>

            {/* Hint Box with Auto-Decrypt Assistant */}
            <div className="rounded-2xl border border-[var(--neon-cyan)]/25 bg-[var(--neon-cyan)]/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--neon-cyan)]">
                  <Lightbulb className="h-4 w-4" />
                  <span>Declassified Intel Hint:</span>
                </div>
                <button
                  type="button"
                  onClick={autofillFlag}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/15 px-2.5 py-1 font-mono text-[0.68rem] font-semibold text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/25 transition-colors"
                  title="Auto-fill the correct flag for judging demonstration"
                >
                  <Wand2 className="h-3 w-3" />
                  <span>Auto-Solve Flag</span>
                </button>
              </div>
              <p className="mt-2 text-xs font-mono text-muted-foreground leading-relaxed">
                {challenge.hint}
              </p>
            </div>

            {/* Submission Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(inputVal);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--neon)]">
                  ❯
                </span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="flag{your_flag_here}"
                  className="w-full rounded-xl border border-white/10 bg-black/60 pl-8 pr-4 py-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--neon)] focus:outline-none focus:ring-1 focus:ring-[var(--neon)]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--neon)] px-6 py-3 font-mono text-xs font-bold text-[var(--primary-foreground)] shadow-[0_0_20px_oklch(0.86_0.24_152/30%)] hover:brightness-110 active:scale-95 transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Flag</span>
              </button>
            </form>

            {/* Terminal History */}
            {history.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <div className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  Session Log Output:
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 border",
                        h.ok
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-rose-500/40 bg-rose-500/10 text-rose-400",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {h.ok ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ) : (
                          <TriangleAlert className="h-4 w-4 shrink-0" />
                        )}
                        <span>
                          [{h.chal}] {h.value}
                        </span>
                      </div>
                      <span className="font-bold">
                        {h.ok ? "+SUCCESSFUL_CAPTURE" : "ACCESS_DENIED"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
