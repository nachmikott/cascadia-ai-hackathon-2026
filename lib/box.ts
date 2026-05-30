export async function uploadToBox(
  pdfBuffer: Buffer,
  filename: string
): Promise<{ success: boolean; message: string }> {
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

    return { success: true, message: "Route plan uploaded to Box successfully!" };
  } catch (e) {
    console.error("[box] upload error:", e);
    return { success: false, message: "Error connecting to Box." };
  }
}
