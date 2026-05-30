import { triggerEvacuationCall } from "@/lib/vapi-call";

export async function POST() {
  await triggerEvacuationCall(
    "Stop 1: Safeway Grocery, category grocery store. Stop 2: Shell Gas Station on Main Street, category gas station. Stop 3: Riverside Campground, category campsite."
  );
  return Response.json({ ok: true });
}
