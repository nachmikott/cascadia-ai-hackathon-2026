export async function triggerEvacuationCall(routeText: string) {
  const apiKey = process.env.VAPI_PRIVATE_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  const neighborNumber = process.env.NEIGHBOR_PHONE_NUMBER;

  if (!apiKey || !phoneNumberId || !neighborNumber) {
    console.error("[vapi-call] Missing env vars for outbound call");
    return;
  }

  const firstMessage =
    "Dear Neighbor, it is important that you know your friend has set on an Evacuation Plan and wants you to be aware of it. I will now describe the route. " +
    routeText;

  const res = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumberId,
      customer: { number: neighborNumber },
      assistant: {
        firstMessage,
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM",
        },
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are reading an evacuation plan to a neighbor. After reading the plan, ask if they have any questions, then say goodbye and end the call.",
            },
          ],
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[vapi-call] Outbound call failed:", err);
  } else {
    const data = await res.json();
    console.log("[vapi-call] Outbound call triggered successfully:", JSON.stringify(data).slice(0, 500));
  }
}
