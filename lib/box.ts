export async function downloadFromBox(fileId: string): Promise<Buffer> {
  const token = process.env.BOX_DEVELOPER_TOKEN;
  if (!token) throw new Error("Box token not configured.");

  const res = await fetch(`https://api.box.com/2.0/files/${fileId}/content`, {
    headers: { Authorization: `Bearer ${token}` },
    redirect: "follow",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[box] download failed:", res.status, text.slice(0, 200));
    throw new Error(`Box download failed: ${res.status}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  console.log("[box] downloaded file, size:", buf.length, "starts with:", buf.slice(0, 5).toString());
  return buf;
}

export async function uploadToBox(
  pdfBuffer: Buffer,
  filename: string
): Promise<{ success: boolean; message: string; fileId?: string }> {
  const token = process.env.BOX_DEVELOPER_TOKEN;
  const folderId = process.env.BOX_FOLDER_ID || "0";

  if (!token) return { success: false, message: "Box token not configured." };

  const attributes = JSON.stringify({ name: filename, parent: { id: folderId } });

  const boundary = "----BoxUpload" + Date.now();
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="attributes"\r\n\r\n${attributes}\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/pdf\r\n\r\n`
    ),
    pdfBuffer,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  try {
    const res = await fetch("https://upload.box.com/api/2.0/files/content", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[box] upload failed:", err);
      return { success: false, message: "Failed to upload to Box." };
    }

    const data = await res.json();
    const fileId = data.entries?.[0]?.id;
    return { success: true, message: "Route plan uploaded to Box successfully!", fileId };
  } catch (e) {
    console.error("[box] upload error:", e);
    return { success: false, message: "Error connecting to Box." };
  }
}

export async function uploadTextToBox(text: string, filename: string): Promise<void> {
  const token = process.env.BOX_DEVELOPER_TOKEN;
  const folderId = process.env.BOX_FOLDER_ID || "0";
  if (!token) return;

  const attributes = JSON.stringify({ name: filename, parent: { id: folderId } });
  const boundary = "----BoxUpload" + Date.now();
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="attributes"\r\n\r\n${attributes}\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: text/plain\r\n\r\n`
    ),
    Buffer.from(text),
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  await fetch("https://upload.box.com/api/2.0/files/content", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body,
  }).catch((e) => console.error("[box] text upload error:", e));
}
