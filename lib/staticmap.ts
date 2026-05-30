export async function getStaticMapBuffer(
  waypoints: { lat: number; lng: number }[]
): Promise<Buffer | null> {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey || waypoints.length === 0) return null;

  const markers = waypoints
    .map((w, i) => `lonlat:${w.lng},${w.lat};type:awesome;color:${i === 0 ? "green" : "red"};size:small`)
    .join("|");

  const url = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&marker=${encodeURIComponent(markers)}&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}
