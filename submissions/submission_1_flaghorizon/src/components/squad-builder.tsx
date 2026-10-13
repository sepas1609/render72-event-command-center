"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Binary,
  CheckCircle2,
  Fingerprint,
  KeyRound,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users2,
  Zap,
} from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

interface Teammate {
  id: string;
  callsign: string;
  role: "Web Exploit" | "Cryptanalysis" | "Reverse Eng" | "Digital Forensics";
}

const ROLES = [
  { label: "Web Exploit", color: "var(--neon)", icon: Zap },
  { label: "Cryptanalysis", color: "var(--neon-violet)", icon: KeyRound },
  { label: "Reverse Eng", color: "var(--neon-amber)", icon: Binary },
  { label: "Digital Forensics", color: "var(--neon-cyan)", icon: Fingerprint },
] as const;

export function SquadBuilder() {
  const [squadName, setSquadName] = useState("CYBER_VIPERS");
  const [squadMembers, setSquadMembers] = useState<Teammate[]>([
    { id: "1", callsign: "n0ct1s", role: "Web Exploit" },
    { id: "2", callsign: "0xR4ven", role: "Cryptanalysis" },
    { id: "3", callsign: "byt3m3", role: "Reverse Eng" },
  ]);
  const [newCallsign, setNewCallsign] = useState("");
  const [selectedRole, setSelectedRole] = useState<Teammate["role"]>("Digital Forensics");
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const play = useAudioCue();

  const addMember = () => {
    if (!newCallsign.trim() || squadMembers.length >= 4) return;
    const newMember: Teammate = {
      id: String(Date.now()),
      callsign: newCallsign.trim(),
      role: selectedRole,
    };
    setSquadMembers([...squadMembers, newMember]);
    setNewCallsign("");
    play("success");
  };

  const removeMember = (id: string) => {
    if (squadMembers.length <= 1) return;
    setSquadMembers(squadMembers.filter((m) => m.id !== id));
    play("tick");
  };

  // Compute synergy score: 25 pts per unique role + 10 pts per member
  const uniqueRoles = new Set(squadMembers.map((m) => m.role)).size;
  const synergyScore = Math.min(100, uniqueRoles * 22 + squadMembers.length * 6);

  return (
    <section
      id="squad-builder"
      aria-labelledby="squad-title"
      className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c1224]/95 via-[#0d162c]/90 to-[#080d1a]/95 p-6 backdrop-blur-2xl shadow-2xl sm:p-10 lg:p-12">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-widest text-[var(--neon-cyan)]">
              <Users2 className="h-3 w-3" />
              <span>FlagHorizon Roster Simulator</span>
            </div>
            <h2
              id="squad-title"
              className="mt-3 font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
            >
              Interactive Squad Builder & Operator ID
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Form your 2 to 4 operator team for FlagHorizon CTF ($15,000 Prize Pool).
              Balance your technical specializations to maximize squad combat synergy and generate
              your declassified Operator ID card.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[var(--neon)]/30 bg-[var(--neon)]/10 p-3 text-right">
              <div className="text-[0.62rem] font-mono uppercase tracking-widest text-muted-foreground">
                Squad Synergy
              </div>
              <div className="font-mono text-2xl font-black text-[var(--neon)]">
                {synergyScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Builder Interactive Grid */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Controls & Teammates List */}
          <div className="space-y-6 lg:col-span-7">
            {/* Squad Name Input */}
            <div>
              <label
                htmlFor="squad-name"
                className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                Squad Designation / Team Name
              </label>
              <div className="mt-2 flex gap-3">
                <input
                  id="squad-name"
                  type="text"
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value.toUpperCase())}
                  placeholder="TEAM_CALLSIGN"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-sm font-bold text-[var(--neon)] focus:border-[var(--neon)] focus:outline-none focus:ring-1 focus:ring-[var(--neon)]"
                />
              </div>
            </div>

            {/* Current Operators Roster */}
            <div>
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                <span>Active Operators ({squadMembers.length} / 4)</span>
                <span className="text-[var(--neon-cyan)]">Max 4 Members</span>
              </div>
              <div className="space-y-2.5">
                <AnimatePresence>
                  {squadMembers.map((member, idx) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 font-mono text-xs font-bold text-muted-foreground">
                          0{idx + 1}
                        </div>
                        <div>
                          <div className="font-mono text-sm font-bold text-foreground">
                            {member.callsign}
                          </div>
                          <div className="text-[0.68rem] font-mono text-[var(--neon-cyan)]">
                            {member.role}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        disabled={squadMembers.length <= 1}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-rose-500/20 hover:text-rose-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        aria-label={`Remove ${member.callsign}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Add Teammate Form */}
            {squadMembers.length < 4 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-mono text-xs uppercase tracking-wider text-foreground font-semibold mb-3">
                  Recruit Operator
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={newCallsign}
                    onChange={(e) => setNewCallsign(e.target.value)}
                    placeholder="Operator Callsign (e.g. CipherFox)"
                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 font-mono text-xs text-foreground focus:border-[var(--neon-cyan)] focus:outline-none"
                  />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Teammate["role"])}
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-foreground focus:border-[var(--neon-cyan)] focus:outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r.label} value={r.label}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addMember}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--neon)] px-4 py-2 font-mono text-xs font-semibold text-[var(--primary-foreground)] hover:brightness-110 active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Recruit</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Holographic Operator ID Card Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm rounded-3xl border border-[var(--neon)]/40 bg-gradient-to-br from-[#0e1628] via-[#09101d] to-[#040810] p-6 shadow-[0_0_35px_rgba(0,255,159,0.18)]">
              {/* Card Hologram Ribbon */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[var(--neon)]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--neon)]">
                    FlagHorizon Operator ID
                  </span>
                </div>
                <QrCode className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Card Squad Identity */}
              <div className="mt-5 text-center">
                <div className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-foreground">
                  Registered Battle Unit
                </div>
                <div className="mt-1 font-mono text-xl font-black text-foreground">
                  {squadName || "UNTITLED_SQUAD"}
                </div>
                <div className="mt-1 text-[0.68rem] font-mono text-[var(--neon-amber)]">
                  Class: High-Assurance Defense Squad
                </div>
              </div>

              {/* Operator Pills */}
              <div className="mt-6 space-y-2">
                {squadMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-black/40 px-3 py-1.5 text-xs font-mono"
                  >
                    <span className="text-foreground/90 font-medium">{m.callsign}</span>
                    <span className="text-[var(--neon-cyan)] text-[0.7rem]">{m.role}</span>
                  </div>
                ))}
              </div>

              {/* Card Security Barcode & Footer */}
              <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-[0.62rem] font-mono text-muted-foreground">
                <div>HASH: {Math.abs(squadName.split("").reduce((a, b) => a + b.charCodeAt(0), 1012)).toString(16)}...</div>
                <div className="text-emerald-400 font-bold">VERIFIED SQUAD</div>
              </div>

              <div className="mt-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setBadgeUnlocked(true);
                    play("success");
                  }}
                  className="w-full rounded-xl bg-white/10 hover:bg-white/15 py-2 font-mono text-xs text-foreground font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[var(--neon-amber)]" />
                  <span>Lock & Authorize Badge</span>
                </button>
              </div>
            </div>

            {badgeUnlocked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center font-mono text-xs text-emerald-400 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Squad Authorized for FlagHorizon (Nov 15, 2026)!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
