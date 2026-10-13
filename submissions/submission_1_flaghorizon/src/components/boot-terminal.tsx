"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  "$ initializing flaghorizon-sandbox v3.1.0…",
  "→ mounting /dev/ctfboard                [OK]",
  "→ handshake render72.api/events         [200 OK]",
  "→ negotiating tls1.3 / x25519 / aes-gcm [OK]",
  "→ loading challenge index (30 ops)      [OK]",
  "→ spawning scoreboard daemon            [PID 0x1F4]",
  "→ arming neon-shell glassmorphism       [OK]",
  "→ verifying scope / authorized targets   [VERIFIED]",
  "» FlagHorizon ready. welcome, operator.",
];

/**
 * Terminal boot sequence with a typewriter effect. Used inside the hero.
 * - Accessible: respects prefers-reduced-motion (skips typing, shows all lines)
 * - Visible: viewport-aware, starts when scrolled into view
 */
export function BootTerminal() {
  const [printed, setPrinted] = useState<string[]>([]);
  const [typing, setTyping] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const start = () => {
      if (started.current) return;
      started.current = true;
      if (reduced) {
        setPrinted(LINES);
        setTyping("");
        return;
      }
      let li = 0;
      let ci = 0;
      const tick = () => {
        if (li >= LINES.length) {
          setTyping("");
          return;
        }
        const line = LINES[li];
        if (ci < line.length) {
          ci += 1;
          setTyping(line.slice(0, ci));
          window.setTimeout(tick, 18 + Math.random() * 22);
        } else {
          setPrinted((p) => [...p, line]);
          setTyping("");
          li += 1;
          ci = 0;
          window.setTimeout(tick, 160 + Math.random() * 220);
        }
      };
      tick();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="glass-strong scanline relative overflow-hidden rounded-xl border border-[var(--neon)]/25 p-4 font-mono text-xs leading-relaxed text-[var(--neon)]/85 shadow-[0_0_40px_oklch(0.82_0.2_152/12%)] sm:text-sm"
      aria-label="Terminal boot sequence"
      role="log"
      aria-live="polite"
    >
      <div className="mb-3 flex items-center gap-2 border-b border-white/5 pb-2 text-[0.65rem] uppercase tracking-widest text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-[var(--neon-rose)]/70" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-[var(--neon-amber)]/70" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-[var(--neon)]/70" aria-hidden />
        <span className="ml-2">operator@flaghorizon:~</span>
      </div>
      <div className="space-y-1">
        {printed.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">
            <span className="text-[var(--neon-cyan)]">{l.startsWith("$") ? "$" : l.startsWith("→") ? "→" : l.startsWith("»") ? "»" : ""}</span>
            <span className="ml-1">{l.replace(/^[$→»]\s*/, "")}</span>
          </div>
        ))}
        {typing && (
          <div className="whitespace-pre-wrap">
            <span className="text-[var(--neon-cyan)]">
              {typing.startsWith("$") ? "$" : typing.startsWith("→") ? "→" : typing.startsWith("»") ? "»" : ""}
            </span>
            <span className="ml-1">{typing.replace(/^[$→»]\s*/, "")}</span>
            <span className="blink-cursor" aria-hidden />
          </div>
        )}
        {!typing && printed.length === LINES.length && (
          <div className="text-[var(--neon)]">
            <span className="blink-cursor" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}
