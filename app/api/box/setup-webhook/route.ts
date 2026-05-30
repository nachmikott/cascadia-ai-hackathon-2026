export async function POST(request: Request) {
  const token = process.env.BOX_DEVELOPER_TOKEN;
  const folderId = process.env.BOX_FOLDER_ID || "0";

  if (!token) {
    return Response.json({ error: "BOX_DEVELOPER_TOKEN not set" }, { status: 500 });
  }

  const { webhookUrl } = await request.json();
  if (!webhookUrl) {
    return Response.json({ error: "webhookUrl is required in body" }, { status: 400 });
  }

  const res = await fetch("https://api.box.com/2.0/webhooks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target: { id: folderId, type: "folder" },
      address: webhookUrl,
      triggers: ["FILE.UPLOADED"],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json({ error: "Failed to create webhook", details: data }, { status: res.status });
  }

  return Response.json({ success: true, webhook: data });
}
