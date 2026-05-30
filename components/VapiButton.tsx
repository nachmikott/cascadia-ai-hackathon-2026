"use client";

import { useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

type Status = "idle" | "connecting" | "active" | "error";

function getLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 10000 }
    );
  });
}

export default function VapiButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showHint, setShowHint] = useState(true);
  const vapiRef = useRef<Vapi | null>(null);

  async function handleClick() {
    setShowHint(false);
    if (status === "active" || status === "connecting") {
      vapiRef.current?.stop();
      return;
    }

    setStatus("connecting");
    setErrorMsg("");

    try {
      const location = await getLocation();
      if (location) {
        await fetch("/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(location),
        });
      }

      const res = await fetch("/api/vapi/token", { method: "POST" });
      if (!res.ok) throw new Error("Failed to get token");

      const { token, assistantId } = await res.json();
      const vapi = new Vapi(token);
      vapiRef.current = vapi;

      vapi.on("call-start", () => setStatus("active"));
      vapi.on("call-end", () => {
        setStatus("idle");
        vapiRef.current = null;
      });
      vapi.on("error", (e) => {
        if (e?.message?.includes("unsupported input processor")) return;
        setErrorMsg(e?.message || "Call failed");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      });

      await vapi.start(assistantId, location ? {
        variableValues: {
          userLat: location.lat.toString(),
          userLng: location.lng.toString(),
        },
      } : undefined);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Connection failed");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div style={{ position: "fixed", top: 20, right: 20, display: "flex", alignItems: "center", zIndex: 10000 }}>
      {showHint && status === "idle" && (
        <p style={{ marginRight: 12, fontSize: 18, color: "#ccc", whiteSpace: "nowrap" }}>Click here to get started →</p>
      )}
      <button
        onClick={handleClick}
        aria-label={status === "active" || status === "connecting" ? "Stop call" : "Start call"}
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "none",
          background: status === "active" ? "#ef4444" : status === "connecting" ? "#f59e0b" : "#3b82f6",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {status === "connecting" ? "⏳" : status === "active" ? "⏹" : "▶"}
      </button>

      {status === "error" && <p style={{ marginTop: 8, fontSize: 14, color: "#ef4444" }}>{errorMsg}</p>}
    </div>
  );
}
