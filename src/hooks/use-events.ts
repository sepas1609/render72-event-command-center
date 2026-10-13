"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvent, getEvents } from "@/lib/api";

/** Query key factory */
export const eventKeys = {
  all: ["events"] as const,
  list: () => [...eventKeys.all, "list"] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
};

/** Hook: list of all events */
export function useEvents() {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn: getEvents,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });
}

/** Hook: single event detail */
export function useEvent(id: string | null) {
  return useQuery({
    queryKey: id ? eventKeys.detail(id) : ["events", "detail", "idle"],
    queryFn: () => {
      if (!id) throw new Error("No event id provided");
      return getEvent(id);
    },
    enabled: Boolean(id),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });
}
