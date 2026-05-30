import { eventBus } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  let closed = false;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data?: unknown) => {
        if (closed) return;
        try {
          const payload = data !== undefined ? `event: ${event}\ndata: ${JSON.stringify(data)}\n\n` : `event: ${event}\ndata: \n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch { closed = true; cleanup(); }
      };

      const onPinsAdd = (data: unknown) => send("pins-add", data);
      const onRouteUpdate = (data: unknown) => send("route-update", data);
      const onMapClear = () => send("map-clear");

      eventBus.on("pins-add", onPinsAdd);
      eventBus.on("route-update", onRouteUpdate);
      eventBus.on("map-clear", onMapClear);

      const keepalive = setInterval(() => {
        if (closed) { clearInterval(keepalive); return; }
        try { controller.enqueue(encoder.encode(": keepalive\n\n")); }
        catch { closed = true; cleanup(); }
      }, 30000);

      const cleanup = () => {
        closed = true;
        eventBus.off("pins-add", onPinsAdd);
        eventBus.off("route-update", onRouteUpdate);
        eventBus.off("map-clear", onMapClear);
        clearInterval(keepalive);
      };

      controller.enqueue(encoder.encode(": connected\n\n"));
    },
    cancel() { closed = true; },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
