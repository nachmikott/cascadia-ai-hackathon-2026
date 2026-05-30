import { setUserLocation } from "@/lib/state";

export async function POST(request: Request) {
  const { lat, lng } = await request.json();
  console.log("[location] received:", { lat, lng });
  if (typeof lat === "number" && typeof lng === "number") {
    setUserLocation({ lat, lng });
  }
  return Response.json({ ok: true });
}
