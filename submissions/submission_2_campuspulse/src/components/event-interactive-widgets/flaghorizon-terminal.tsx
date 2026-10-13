"use client";

import { useState } from "react";
import { Terminal, CheckCircle2, AlertTriangle, Key } from "lucide-react";
import confetti from "canvas-confetti";
import { useAudioCue } from "@/hooks/use-audio-cue";

const CHALLENGES = [
  {
    id: "web-01",
    title: "SQLi Bypass in Campus Portal",
    points: 150,
    category: "Web Exploitation",
    hint: "Notice the query: SELECT * FROM users WHERE pass = MD5(?) OR '1'='1'--",
    expectedFlag: "flag{union_select_admin_bypass}",
    prompt: "POST /auth/verify HTTP/1.1\nHost: portal.campus.internal\nPayload: ' OR 1=1 --",
  },
  {
    id: "crypto-01",
    title: "Substitution Matrix Decryption",
    points: 200,
    category: "Cryptography",
    hint: "Caesar shift with offset +13 (ROT13) on ciphertext: synt{ebg13_punyyratr_fbyirq}",
    expectedFlag: "flag{rot13_challenge_solved}",
    prompt: "Ciphertext: synt{ebg13_punyyratr_fbyirq}\nAlgorithm: Affine / Substitution",
  },
  {
    id: "forensics-01",
    title: "PCAP Packet Stream Extraction",
    points: 250,
    category: "Digital Forensics",
    hint: "Check TCP stream #4 looking for base64 encoded payload: ZmxhZ3twY2FwX3N0cmVhbV80X2ZvcmVuc2ljc30=",
    expectedFlag: "flag{pcap_stream_4_forensics}",
    prompt: "Frame 1042: TCP Stream 4 / Port 8080\nHTTP/1.1 200 OK\nX-Auth-Token: ZmxhZ3twY2FwX3N0cmVhbV80X2ZvcmVuc2ljc30=",
  },
];

export function FlagHorizonTerminalWidget() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [inputFlag, setInputFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "fail">("idle");
  const [showHint, setShowHint] = useState(false);
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});
  const play = useAudioCue();

  const challenge = CHALLENGES[selectedIdx];
  const isSolved = Boolean(solvedMap[challenge.id]);

  const handleTestFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputFlag.trim() === challenge.expectedFlag) {
      setStatus("success");
      setSolvedMap((prev) => ({ ...prev, [challenge.id]: true }));
      play("capture");
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00ff9f", "#00f0ff", "#ff007f"],
      });
    } else {
      setStatus("fail");
      play("alert");
    }
  };

  const handleAutoFill = () => {
    setInputFlag(challenge.expectedFlag);
    setStatus("idle");
    play("click");
  };

  return (
    <div className="rounded-2xl border-2 border-[var(--neon)]/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(0,255,159,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--neon)]/20 text-[var(--neon)]">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Sentinel Interactive CTF War-Room</span>
              <span className="rounded-full bg-[var(--neon)]/20 px-2 py-0.5 text-[0.65rem] text-[var(--neon)]">
                LIVE SANDBOX
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Simulate exploit payloads against the FlagHorizon sandbox in real-time.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Score:{" "}
          <span className="font-bold text-[var(--neon)]">
            {Object.keys(solvedMap).length * 200} PTS
          </span>
        </div>
      </div>

      {/* Challenge Selector Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CHALLENGES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setSelectedIdx(i);
              setInputFlag("");
              setStatus("idle");
              setShowHint(false);
              play("click");
            }}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              selectedIdx === i
                ? "border-[var(--neon)] bg-[var(--neon)]/15 text-[var(--neon)] shadow-[0_0_12px_rgba(0,255,159,0.25)]"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            {c.title}{" "}
            {solvedMap[c.id] && (
              <span className="ml-1 text-[var(--neon)]">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Terminal Viewport */}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[0.7rem] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
            <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
            <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
            <span className="text-foreground/80 font-bold ml-1">{challenge.category}</span>
          </div>
          <span className="text-[var(--neon-cyan)]">{challenge.points} Points</span>
        </div>

        <pre className="mt-3 overflow-x-auto text-emerald-400 leading-relaxed whitespace-pre-wrap">
          {challenge.prompt}
        </pre>

        {showHint && (
          <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-300 text-[0.75rem]">
            <strong>Tactical Intelligence Hint:</strong> {challenge.hint}
          </div>
        )}
      </div>

      {/* Flag Submission Bar */}
      <form onSubmit={handleTestFlag} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={inputFlag}
            onChange={(e) => setInputFlag(e.target.value)}
            placeholder="flag{...}"
            className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-[var(--neon)] focus:outline-none focus:ring-1 focus:ring-[var(--neon)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isSolved}
            className="rounded-xl bg-[var(--neon)] px-4 py-2 font-mono text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {isSolved ? "Solved ✓" : "Submit Flag"}
          </button>

          <button
            type="button"
            onClick={handleAutoFill}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground"
          >
            Auto-Fill
          </button>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-mono text-xs font-medium text-amber-300 hover:bg-amber-500/20"
          >
            {showHint ? "Hide Hint" : "Hint"}
          </button>
        </div>
      </form>

      {/* Status Alert */}
      {status === "success" && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs font-mono text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>[+] FLAG VALIDATED. +{challenge.points} Points added to live command session!</span>
        </div>
      )}

      {status === "fail" && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs font-mono text-red-400 animate-in fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>[-] ACCESS DENIED: Invalid flag checksum. Review hint and retry.</span>
        </div>
      )}
    </div>
  );
}
