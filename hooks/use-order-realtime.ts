"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

export type LiveUpdateStatus = "connecting" | "live" | "offline";

interface UseOrderRealtimeOptions {
  channelName: string;
  enabled?: boolean;
  filter?: string;
  onChange: () => void | Promise<void>;
  reconciliationIntervalMs?: number;
}

/**
 * Subscribe to order inserts/updates and reconcile the owning screen.
 *
 * Re-fetching is intentional: order cards use related vendor, customer and
 * agent rows that are not included in a raw Postgres Changes payload.
 */
export function useOrderRealtime({
  channelName,
  enabled = true,
  filter,
  onChange,
  reconciliationIntervalMs,
}: UseOrderRealtimeOptions): LiveUpdateStatus {
  const [status, setStatus] = React.useState<LiveUpdateStatus>("connecting");
  const onChangeRef = React.useRef(onChange);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (!enabled) return;

    let disposed = false;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const supabase = createClient();
    const changeFilter = {
      schema: "public" as const,
      table: "orders",
      ...(filter ? { filter } : {}),
    };

    const refresh = () => {
      if (disposed) return;
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        void onChangeRef.current();
      }, 150);
    };

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", ...changeFilter },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", ...changeFilter },
        refresh,
      )
      .subscribe((nextStatus) => {
        if (disposed) return;
        if (nextStatus === "SUBSCRIBED") {
          setStatus("live");
          refresh();
        } else if (
          nextStatus === "CHANNEL_ERROR" ||
          nextStatus === "TIMED_OUT" ||
          nextStatus === "CLOSED"
        ) {
          setStatus("offline");
        }
      });

    const reconcile = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", reconcile);
    document.addEventListener("visibilitychange", reconcile);

    const interval = reconciliationIntervalMs
      ? window.setInterval(reconcile, reconciliationIntervalMs)
      : null;

    return () => {
      disposed = true;
      if (refreshTimer) clearTimeout(refreshTimer);
      if (interval !== null) window.clearInterval(interval);
      window.removeEventListener("focus", reconcile);
      document.removeEventListener("visibilitychange", reconcile);
      void supabase.removeChannel(channel);
    };
  }, [channelName, enabled, filter, reconciliationIntervalMs]);

  return status;
}
