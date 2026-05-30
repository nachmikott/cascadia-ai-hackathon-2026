import type { PlaceResult } from "./apify";

interface RouteWaypoint { lat: number; lng: number; title: string; category: string }

const globalForState = globalThis as unknown as {
  pins?: PlaceResult[];
  userLocation?: { lat: number; lng: number } | null;
  lastRoute?: RouteWaypoint[] | null;
};

export const pins: PlaceResult[] = globalForState.pins ?? [];
globalForState.pins = pins;

export function getUserLocation(): { lat: number; lng: number } | null {
  return globalForState.userLocation ?? null;
}

export function setUserLocation(loc: { lat: number; lng: number }) {
  globalForState.userLocation = loc;
}

export function addPins(newPins: PlaceResult[]) {
  pins.push(...newPins);
}

export function clearPins() {
  pins.length = 0;
}

export function getLastRoute(): RouteWaypoint[] | null {
  return globalForState.lastRoute ?? null;
}

export function setLastRoute(route: RouteWaypoint[]) {
  globalForState.lastRoute = route;
}
