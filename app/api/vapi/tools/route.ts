import { searchNearby } from "@/lib/apify";
import { eventBus } from "@/lib/events";
import { pins, addPins, clearPins, getUserLocation, getLastRoute, setLastRoute } from "@/lib/state";
import { generateRoutePDF } from "@/lib/pdf";
import { uploadToBox, uploadTextToBox } from "@/lib/box";
import { getRouteGeometry } from "@/lib/routing";

function dist(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  return Math.sqrt((a.lat - b.lat) ** 2 + (a.lng - b.lng) ** 2);
}

async function sayToCall(callId: string, message: string) {
  const apiKey = process.env.VAPI_PRIVATE_KEY;
  if (!apiKey || !callId) return;
  await fetch(`https://api.vapi.ai/call/${callId}/control`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ type: "say", content: message, endCallAfterSpoken: false }),
  }).catch((err) => console.error("Vapi say failed:", err));
}

export async function POST(request: Request) {
  const body = await request.json();
  const toolCalls = body.message?.toolCalls || [];
  const callId = body.message?.call?.id || "";
  const coords = getUserLocation();

  const results = await Promise.all(
    toolCalls.map(async (toolCall: { id: string; function: { name: string; arguments: Record<string, unknown> } }) => {
      const { name, arguments: args } = toolCall.function;

      if (name === "searchNearby") {
        const query = (args.query as string) || "places";

        console.log("[tools] searchNearby called, query:", query, "coords:", coords);

        if (!coords) {
          return { toolCallId: toolCall.id, result: "I don't have your location. Please allow location access and try again." };
        }

        searchNearby(query, coords.lat, coords.lng).then(async (result) => {
          if (result.places.length > 0) {
            addPins(result.places);
            eventBus.emit("pins-add", result.places);
            await sayToCall(callId, `The ${query} near you are now pinned on the map.`);
          }
        }).catch((err) => console.error("Apify search failed:", err));

        return { toolCallId: toolCall.id, result: `Searching for ${query} near your location. I'll update the map shortly. What else can I help with?` };
      }

      if (name === "suggestRoute") {
        if (pins.length === 0) {
          return { toolCallId: toolCall.id, result: "There are no pins on the map yet. Search for some places first." };
        }

        const allCategories = [...new Set(pins.map((p) => p.category.toLowerCase()))];
        const waypoints: { lat: number; lng: number; title: string; category: string }[] = [];
        let current: { lat: number; lng: number } | null = null;

        for (const cat of allCategories) {
          const catPins = pins.filter((p) => p.category.toLowerCase() === cat);
          let best = catPins[0];
          if (current) {
            let bestDist = Infinity;
            for (const p of catPins) {
              const d = dist(current, p);
              if (d < bestDist) { bestDist = d; best = p; }
            }
          }
          waypoints.push({ lat: best.lat, lng: best.lng, title: best.title, category: cat });
          current = best;
        }

        if (waypoints.length < 2) {
          return { toolCallId: toolCall.id, result: `Only one category on the map (${allCategories[0]}). Search for another type of place to build a route.` };
        }

        setLastRoute(waypoints);
        const geometry = await getRouteGeometry(waypoints);
        eventBus.emit("route-update", { waypoints, geometry });
        const stops = waypoints.map((w) => `${w.title} (${w.category})`).join(" → ");
        return { toolCallId: toolCall.id, result: `FASTEST route plotted on the map with ${waypoints.length} stops: ${stops}. This is the shortest-distance path hitting one of each place type.` };
      }

      if (name === "getMapStatus") {
        if (pins.length === 0) {
          return { toolCallId: toolCall.id, result: "The map is empty. No pins have been placed yet." };
        }
        const categories = [...new Set(pins.map((p) => p.category))];
        const summary = categories.map((cat) => {
          const catPins = pins.filter((p) => p.category === cat);
          return `${cat}: ${catPins.map((p) => p.title).join(", ")}`;
        }).join("; ");
        return { toolCallId: toolCall.id, result: `Currently pinned (${pins.length} places across ${categories.length} categories): ${summary}` };
      }

      if (name === "clearMap") {
        clearPins();
        eventBus.emit("map-clear");
        return { toolCallId: toolCall.id, result: "Map cleared. All pins and routes have been removed." };
      }

      if (name === "shareToBox") {
        const route = getLastRoute();
        if (!route || route.length === 0) {
          return { toolCallId: toolCall.id, result: "No route to share yet. Please suggest a route first." };
        }

        try {
          const pdfBuffer = await generateRoutePDF(route, pins);
          const ts = Date.now();
          const result = await uploadToBox(pdfBuffer, `route-plan-${ts}.pdf`);

          // Upload companion text file for the webhook to read
          const routeText = route.map((wp, i) => {
            const pin = pins.find((p) => p.title === wp.title);
            return `Stop ${i + 1}: ${wp.title}, category ${wp.category}${pin?.address ? `, address ${pin.address}` : ""}`;
          }).join(". ");
          await uploadTextToBox(routeText, `route-plan-${ts}.txt`);

          return { toolCallId: toolCall.id, result: result.message };
        } catch (e) {
          console.error("[shareToBox] error:", e);
          return { toolCallId: toolCall.id, result: "Sorry, I couldn't generate the PDF right now." };
        }
      }

      return { toolCallId: toolCall.id, result: "Unknown tool." };
    })
  );

  return Response.json({ results });
}
