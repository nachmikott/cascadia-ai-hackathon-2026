import jwt from "jsonwebtoken";

export async function POST() {
  const privateKey = process.env.VAPI_PRIVATE_KEY;
  const orgId = process.env.VAPI_ORG_ID;
  const assistantId = process.env.VAPI_ASSISTANT_ID;

  if (!privateKey || !orgId || !assistantId) {
    return Response.json(
      { error: "Missing Vapi environment variables" },
      { status: 500 }
    );
  }

  const token = jwt.sign(
    {
      orgId,
      token: {
        tag: "public",
        restrictions: {
          enabled: true,
          allowedAssistantIds: [assistantId],
        },
      },
    },
    privateKey,
    { expiresIn: "5m" }
  );

  return Response.json({ token, assistantId });
}
