"use client";

import dynamic from "next/dynamic";
import VapiButton from "@/components/VapiButton";
import { useSSE } from "@/hooks/useSSE";

const MapPanel = dynamic(() => import("@/components/MapPanel"), { ssr: false });

export default function Home() {
  const { markers, route } = useSSE();

  return (
    <>
      <div style={{ height: "100vh" }}>
        <MapPanel markers={markers} route={route} />
      </div>
      <VapiButton />
    </>
  );
}
