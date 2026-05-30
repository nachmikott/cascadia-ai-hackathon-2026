"use client";

import { useEffect, useState, useCallback } from "react";
import type { MarkerData, RouteData } from "@/components/MapPanel";

export function useSSE() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [route, setRoute] = useState<RouteData | null>(null);

  const connect = useCallback(() => {
    const es = new EventSource("/api/events");

    es.addEventListener("pins-add", (e) => {
      const newPins: MarkerData[] = JSON.parse(e.data);
      setMarkers((prev) => [...prev, ...newPins]);
    });

    es.addEventListener("route-update", (e) => {
      const data: RouteData = JSON.parse(e.data);
      setRoute(data);
      const routeTitles = new Set(data.waypoints.map((w) => w.title));
      setMarkers((prev) => prev.filter((m) => routeTitles.has(m.title)));
    });

    es.addEventListener("map-clear", () => {
      setMarkers([]);
      setRoute(null);
    });

    es.onerror = () => {
      es.close();
      setTimeout(connect, 3000);
    };

    return es;
  }, []);

  useEffect(() => {
    const es = connect();
    return () => es.close();
  }, [connect]);

  return { markers, route };
}
