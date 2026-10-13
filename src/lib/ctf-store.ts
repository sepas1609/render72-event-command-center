"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "grid" | "table";
export type SortKey = "date" | "seats" | "price" | "team";
export type CategoryFilter = "all" | "technical" | "cultural";
export type StatusFilter = "all" | "ACTIVE" | "COMPLETED" | "CLOSED";
export type ModeFilter = "all" | "offline" | "online";

interface CtfState {
  /* view prefs */
  view: ViewMode;
  sort: SortKey;
  search: string;
  categoryFilter: CategoryFilter;
  statusFilter: StatusFilter;
  modeFilter: ModeFilter;
  /* UX toggles */
  audioEnabled: boolean;
  motionReduced: boolean;
  /* briefing modal */
  briefingEventId: string | null;
  /* bookmarked "watch" events */
  bookmarks: string[];
  /* actions */
  setView: (v: ViewMode) => void;
  setSort: (s: SortKey) => void;
  setSearch: (s: string) => void;
  setCategoryFilter: (c: CategoryFilter) => void;
  setStatusFilter: (s: StatusFilter) => void;
  setModeFilter: (m: ModeFilter) => void;
  toggleAudio: () => void;
  toggleMotion: () => void;
  openBriefing: (id: string | null) => void;
  toggleBookmark: (id: string) => void;
}

export const useCtfStore = create<CtfState>()(
  persist(
    (set) => ({
      view: "grid",
      sort: "date",
      search: "",
      categoryFilter: "all",
      statusFilter: "all",
      modeFilter: "all",
      audioEnabled: false,
      motionReduced: false,
      briefingEventId: null,
      bookmarks: [],
      setView: (v) => set({ view: v }),
      setSort: (s) => set({ sort: s }),
      setSearch: (s) => set({ search: s }),
      setCategoryFilter: (c) => set({ categoryFilter: c }),
      setStatusFilter: (s) => set({ statusFilter: s }),
      setModeFilter: (m) => set({ modeFilter: m }),
      toggleAudio: () => set((st) => ({ audioEnabled: !st.audioEnabled })),
      toggleMotion: () => set((st) => ({ motionReduced: !st.motionReduced })),
      openBriefing: (id) => set({ briefingEventId: id }),
      toggleBookmark: (id) =>
        set((st) => ({
          bookmarks: st.bookmarks.includes(id)
            ? st.bookmarks.filter((b) => b !== id)
            : [...st.bookmarks, id],
        })),
    }),
    {
      name: "flaghorizon.state.v1",
      partialize: (s) => ({
        view: s.view,
        sort: s.sort,
        audioEnabled: s.audioEnabled,
        motionReduced: s.motionReduced,
        bookmarks: s.bookmarks,
      }),
    },
  ),
);
