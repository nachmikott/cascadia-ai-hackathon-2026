import PDFDocument from "pdfkit";
import type { PlaceResult } from "./apify";

export async function generateRoutePDF(
  waypoints: { lat: number; lng: number; title: string; category: string }[],
  pins: PlaceResult[]
): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  doc.fontSize(20).text("Your Evacuation Route Plan", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  waypoints.forEach((wp, i) => {
    const pin = pins.find((p) => p.title === wp.title);
    doc.font("Helvetica-Bold").text(`${i + 1}. ${wp.title}`);
    doc.font("Helvetica").text(`   Category: ${wp.category}`);
    if (pin?.address) doc.text(`   Address: ${pin.address}`);
    if (pin?.rating) doc.text(`   Rating: ${pin.rating} ⭐`);
    doc.moveDown(0.5);
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
