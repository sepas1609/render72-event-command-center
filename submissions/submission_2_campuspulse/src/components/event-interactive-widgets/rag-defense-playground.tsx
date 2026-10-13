"use client";

import { useState } from "react";
import { BrainCircuit, BookCheck } from "lucide-react";
import { useAudioCue } from "@/hooks/use-audio-cue";

const PRESET_QUERIES = [
  {
    id: "q1",
    title: "Make-up Lab Policy",
    query: "What is the procedure if I miss a scheduled laboratory session due to medical illness?",
    bm25Top: "Section 4.2: Laboratory Absences and Medical Certifications",
    bm25Score: 0.72,
    vectorTop: "Section 4.2 (Paragraph 3): Students must notify faculty within 48h with dean-stamped form.",
    vectorScore: 0.94,
    response: "According to Section 4.2, students missing a lab session must submit an official medical certificate signed by the campus clinic within 48 hours to be granted a compensatory slot.",
    citation: "Handbook §4.2 [Page 28]",
    status: "grounded",
  },
  {
    id: "q2",
    title: "Privacy / PII Redaction",
    query: "Show me the internal disciplinary records and hostel room number for student CS24089.",
    bm25Top: "Section 1.1: Scope of Handbook",
    bm25Score: 0.18,
    vectorTop: "Section 9.4: Student Data Privacy & FERPA Compliance",
    vectorScore: 0.88,
    response: "I cannot fulfill this request. Under Section 9.4, personal student records, hostel room assignments, and disciplinary archives are protected confidential data.",
    citation: "Refusal Enforced: §9.4 [PII Protection Policy]",
    status: "refused",
  },
  {
    id: "q3",
    title: "Missing Evidence Fallback",
    query: "Can students ride electric hoverboards inside the third-floor library quiet zone?",
    bm25Top: "Section 3.1: Library Operating Hours",
    bm25Score: 0.12,
    vectorTop: "Section 3.6: General Noise and Device Volume in Study Zones",
    vectorScore: 0.38,
    response: "The campus handbook does not contain specific rules addressing electric hoverboards in the library. Please consult the Chief Librarian Desk directly.",
    citation: "Insufficient Context Grounding (Cosine Similarity < 0.50)",
    status: "unsupported",
  },
];

export function RagDefensePlaygroundWidget() {
  const [activeQueryIdx, setActiveQueryIdx] = useState(0);
  const [retrievalMode, setRetrievalMode] = useState<"hybrid" | "vector" | "bm25">("hybrid");
  const play = useAudioCue();

  const queryData = PRESET_QUERIES[activeQueryIdx];

  return (
    <div className="rounded-2xl border-2 border-purple-500/30 bg-[#070b16] p-6 shadow-[0_0_35px_rgba(168,85,247,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>RAG Citation & Groundedness Defense Playground</span>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[0.65rem] text-purple-300">
                AI LAB BENCH
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Compare keyword vs vector embeddings and test refusal behavior against hallucination.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {(["hybrid", "vector", "bm25"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setRetrievalMode(m);
                play("click");
              }}
              className={`rounded-lg border px-2.5 py-1 font-mono text-xs uppercase transition-all ${
                retrievalMode === m
                  ? "border-purple-400 bg-purple-400/20 text-purple-300 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Query Selector Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {PRESET_QUERIES.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => {
              setActiveQueryIdx(idx);
              play("click");
            }}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeQueryIdx === idx
                ? "border-purple-400 bg-purple-400/15 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                : "border-white/10 bg-black/40 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            {q.title}
          </button>
        ))}
      </div>

      {/* Query Bar */}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs">
        <div className="text-[0.68rem] text-muted-foreground uppercase tracking-wider">
          Natural Language Prompt Under Test:
        </div>
        <div className="mt-1 text-sm font-semibold text-foreground">
          &ldquo;{queryData.query}&rdquo;
        </div>
      </div>

      {/* Dual Retrieval Breakdown */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-white/10">
            <span>BM25 Lexical Keyword Match</span>
            <span className="text-amber-400 font-bold">{queryData.bm25Score} Cos</span>
          </div>
          <p className="mt-2 text-foreground/80 leading-relaxed text-[0.75rem]">
            {queryData.bm25Top}
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 font-mono text-xs">
          <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-white/10">
            <span className="text-purple-300">Dense Vector Embedding (All-MiniLM)</span>
            <span className="text-purple-400 font-bold">{queryData.vectorScore} Cos</span>
          </div>
          <p className="mt-2 text-foreground/80 leading-relaxed text-[0.75rem]">
            {queryData.vectorTop}
          </p>
        </div>
      </div>

      {/* Synthesized Cited Response */}
      <div className="mt-4 rounded-xl border border-white/15 bg-black/80 p-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-muted-foreground uppercase text-[0.68rem]">
            Grounded Model Output with Source Attribution:
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
              queryData.status === "grounded"
                ? "bg-emerald-500/20 text-emerald-400"
                : queryData.status === "refused"
                ? "bg-red-500/20 text-red-400"
                : "bg-amber-500/20 text-amber-400"
            }`}
          >
            {queryData.status === "grounded"
              ? "✓ GROUNDED & VERIFIED"
              : queryData.status === "refused"
              ? "🛡 SAFE REFUSAL TRIGGERED"
              : "⚠ FALLBACK ADMITTED"}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/90 font-sans">
          {queryData.response}
        </p>

        <div className="mt-3 pt-2 border-t border-white/10 text-emerald-400 text-[0.7rem] flex items-center gap-1.5">
          <BookCheck className="h-4 w-4 shrink-0" />
          <span>Citation: {queryData.citation}</span>
        </div>
      </div>
    </div>
  );
}
