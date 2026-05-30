"use client";

import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  address: string;
  rating: number | null;
  category: string;
}

export interface RouteData {
  waypoints: { lat: number; lng: number; title: string }[];
}

function LocateUser() {
  const map = useMap();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 12),
      () => {}
    );
  }, [map]);
  return null;
}

function FitBounds({ markers }: { markers: MarkerData[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

export default function MapPanel({ markers, route }: { markers: MarkerData[]; route: RouteData | null }) {
  return (
    <MapContainer center={[47.5, -120.5]} zoom={7} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds markers={markers} />
      <LocateUser />
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Tooltip permanent direction="top" offset={[0, -30]}>
            <strong>{m.title}</strong>
            {m.rating !== null && <span> ⭐ {m.rating}</span>}
            <br />
            <span style={{ fontSize: 11, color: "#666" }}>{m.address}</span>
          </Tooltip>
        </Marker>
      ))}
      {route && (
        <Polyline
          positions={route.waypoints.map((w) => [w.lat, w.lng] as [number, number])}
          pathOptions={{ color: "#2563eb", weight: 4, dashArray: "10 6" }}
        />
      )}
    </MapContainer>
  );
}
