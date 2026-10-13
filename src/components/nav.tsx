"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  Headphones,
  HeadphoneOff,
  Menu,
  ShieldCheck,
  X,
  LayoutGrid,
} from "lucide-react";
import { useCtfStore } from "@/lib/ctf-store";
import { useAudioCue } from "@/hooks/use-audio-cue";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const audioEnabled = useCtfStore((s) => s.audioEnabled);
  const toggleAudio = useCtfStore((s) => s.toggleAudio);
  const activeEdition = useCtfStore((s) => s.activeEdition);
  const setActiveEdition = useCtfStore((s) => s.setActiveEdition);
  const play = useAudioCue();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onToggleAudio = () => {
    toggleAudio();
    if (!audioEnabled) {
      setTimeout(() => play("success"), 60);
    }
  };

  const navLinks = [
    { label: "Arena Deck", href: "/#command-center" },
    { label: "Scoreboard", href: "/#scoreboard" },
    { label: "All Events", href: "/events", isRoute: true },
    { label: "Squad Builder", href: "/#squad-builder" },
    { label: "Flag Sandbox", href: "/#sandbox" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-[#080b15]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)] py-2.5"
            : "bg-[#080b15]/80 backdrop-blur-xl border-b border-white/5 py-3.5",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon)] rounded-lg min-h-[44px]"
            aria-label="FlagHorizon OS — Cyber Arena & Events Deck"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--neon)]/20 via-[var(--neon-cyan)]/15 to-transparent text-[var(--neon)] border border-[var(--neon)]/40 shadow-[0_0_15px_oklch(0.86_0.24_152/20%)] transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-mono text-base font-bold tracking-tight text-foreground group-hover:text-[var(--neon)] transition-colors">
                FlagHorizon<span className="text-[var(--neon-cyan)] font-sans ml-1 text-xs px-1.5 py-0.2 rounded bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 font-bold">OS</span>
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-slate-300">
                Cyber Arena & Events Deck
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = link.isRoute && pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-wider transition-all min-h-[40px] inline-flex items-center",
                    isActive
                      ? "text-[var(--neon)] bg-[var(--neon)]/15 border border-[var(--neon)]/30 shadow-[0_0_12px_oklch(0.86_0.24_152/20%)] font-semibold"
                      : "text-slate-300 hover:text-foreground hover:bg-white/5",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools & Status */}
          <div className="flex items-center gap-2.5">
            {/* Submission Showcase Edition Switcher */}
            <div className="hidden lg:flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 p-0.5 font-mono text-[0.65rem]">
              <span className="text-slate-300 px-1 text-[0.6rem]">Submissions:</span>
              {[
                { id: "1", label: "1: Cyber" },
                { id: "2", label: "2: Festival" },
                { id: "3", label: "3: Clash" },
                { id: "4", label: "4: Maker" },
                { id: "5", label: "5: Polymath" },
              ].map((ed) => (
                <button
                  key={ed.id}
                  type="button"
                  aria-label={`Switch to Edition ${ed.label}`}
                  onClick={() => {
                    setActiveEdition(ed.id);
                    play("tick");
                  }}
                  className={cn(
                    "rounded px-2 py-1 transition-all min-h-[28px]",
                    activeEdition === ed.id
                      ? "bg-[var(--neon)] text-black font-bold shadow-[0_0_8px_rgba(0,255,159,0.4)]"
                      : "text-slate-300 hover:text-foreground",
                  )}
                >
                  {ed.label}
                </button>
              ))}
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={onToggleAudio}
              aria-pressed={audioEnabled}
              aria-label={audioEnabled ? "Mute interactive audio cues" : "Enable interactive audio cues"}
              title={audioEnabled ? "Sound FX: Enabled" : "Sound FX: Muted"}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-all",
                audioEnabled
                  ? "border-[var(--neon)]/40 bg-[var(--neon)]/15 text-[var(--neon)] shadow-[0_0_12px_oklch(0.86_0.24_152/25%)]"
                  : "border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              {audioEnabled ? (
                <Headphones className="h-4 w-4" aria-hidden="true" />
              ) : (
                <HeadphoneOff className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            {/* Quick Link to Events Matrix */}
            <Link
              href="/events"
              className="hidden md:inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--neon)] px-3.5 font-mono text-xs font-semibold text-[var(--primary-foreground)] shadow-[0_0_20px_oklch(0.86_0.24_152/30%)] transition-all hover:bg-[var(--neon)]/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Events Matrix</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 lg:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sticky top-[57px] z-40 w-full overflow-hidden border-b border-white/10 bg-[#080b15]/98 px-4 py-4 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-2.5 font-mono text-sm uppercase tracking-wider transition-colors",
                    pathname === link.href
                      ? "bg-[var(--neon)]/15 text-[var(--neon)] font-semibold"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10 flex gap-2">
                <Link
                  href="/events"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--neon)] py-2.5 font-mono text-xs font-semibold text-[var(--primary-foreground)]"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Explore All 30 Events
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to top scroll button */}
      <a
        href="#top"
        aria-label="Back to top"
        className={cn(
          "fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#080b15]/80 text-[var(--neon)] backdrop-blur-xl shadow-lg transition-all hover:bg-[var(--neon)]/20 hover:scale-105 active:scale-95",
          scrolled ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ChevronUp className="h-5 w-5" aria-hidden="true" />
      </a>
    </>
  );
}
