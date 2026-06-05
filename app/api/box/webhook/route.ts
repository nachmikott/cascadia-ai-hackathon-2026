import { downloadFromBox } from "@/lib/box";
import { triggerEvacuationCall } from "@/lib/vapi-call";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[box-webhook] Received:", JSON.stringify(body));
  const trigger = body.trigger;
  const fileId = body.source?.id;
  const fileName: string = body.source?.name || "";

  if (trigger !== "FILE.UPLOADED" || !fileId) {
    return Response.json({ ok: true });
  }

  // Only process .txt companion files (not the PDF)
  if (!fileName.endsWith(".txt")) {
    return Response.json({ ok: true });
  }

  try {
    // Small delay to ensure Box has finished processing the file
    await new Promise((r) => setTimeout(r, 2000));
    const buffer = await downloadFromBox(fileId);
    const text = buffer.toString("utf-8");

    if (!text.trim()) {
      console.warn("[box-webhook] Text file was empty");
      return Response.json({ ok: true });
    }

    await triggerEvacuationCall(text);
  } catch (e) {
    console.error("[box-webhook] Error processing webhook:", e);
  }

  return Response.json({ ok: true });
}
