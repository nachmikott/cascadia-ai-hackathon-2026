"use client";

import dynamic from "next/dynamic";
import VapiButton from "@/components/VapiButton";
import { useSSE } from "@/hooks/useSSE";

const MapPanel = dynamic(() => import("@/components/MapPanel"), { ssr: false });

export default function Home() {
  const { markers, route } = useSSE();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ background: "#16213e", padding: "14px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 600 }}>Friendly Neighbor</h1>
        <p style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: 6 }}>
          Keeping you and your family safe
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 10, flexWrap: "wrap" }}>
          {[
            { emoji: "🌊", text: "Discuss your situation" },
            { emoji: "🌋", text: "Make a plan" },
            { emoji: "🌀", text: "Inform your loved ones" },
            { emoji: "🔥", text: "Stay safe" },
          ].map((item) => (
            <span key={item.emoji} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#2a2a4a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                {item.emoji}
              </span>
              {item.text}
            </span>
          ))}
        </div>
      </header>
      <div style={{ flex: 1, padding: 36, minHeight: 0 }}>
        <div style={{ height: "100%", borderRadius: 12, overflow: "hidden" }}>
          <MapPanel markers={markers} route={route} />
        </div>
      </div>
      <VapiButton />
    </div>
  );
}
