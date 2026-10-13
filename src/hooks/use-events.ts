"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvent, getEvents } from "@/lib/api";
import type { EventDetail, EventSummary } from "@/lib/types";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes aggressive caching for 10k concurrent users

function readClientCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`r72_cache_${key}`);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL_MS) {
      return data as T;
    }
  } catch {
    // Gracefully ignore local storage errors
  }
  return null;
}

function writeClientCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `r72_cache_${key}`,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {
    // Storage quota or privacy mode
  }
}

/** Query key factory */
export const eventKeys = {
  all: ["events"] as const,
  list: () => [...eventKeys.all, "list"] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
};

/** Hook: list of all events with 10-minute client & memory cache and instant SSR initialData */
export function useEvents(options?: { initialData?: EventSummary[] }) {
  return useQuery<EventSummary[]>({
    queryKey: eventKeys.list(),
    queryFn: async () => {
      const cached = readClientCache<EventSummary[]>("events_list");
      if (cached && cached.length > 0) {
        return cached;
      }
      const fresh = await getEvents();
      if (fresh && fresh.length > 0) {
        writeClientCache("events_list", fresh);
      }
      return fresh;
    },
    initialData: options?.initialData,
    staleTime: CACHE_TTL_MS,
    gcTime: 15 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/** Hook: single event detail with 10-minute client & memory cache */
export function useEvent(id: string | null) {
  return useQuery<EventDetail>({
    queryKey: id ? eventKeys.detail(id) : ["events", "detail", "idle"],
    queryFn: async () => {
      if (!id) throw new Error("No event id provided");
      const cached = readClientCache<EventDetail>(`event_${id}`);
      if (cached) {
        return cached;
      }
      const fresh = await getEvent(id);
      if (fresh) {
        writeClientCache(`event_${id}`, fresh);
      }
      return fresh;
    },
    enabled: Boolean(id),
    staleTime: CACHE_TTL_MS,
    gcTime: 15 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
