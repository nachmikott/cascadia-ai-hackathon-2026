export async function getRouteGeometry(
  waypoints: { lat: number; lng: number }[]
): Promise<[number, number][]> {
  if (waypoints.length < 2) return waypoints.map((w) => [w.lat, w.lng]);

  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = await res.json();
    const coordinates: [number, number][] = data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    );
    return coordinates;
  } catch (e) {
    console.error("[routing] OSRM failed, falling back to straight lines:", e);
    return waypoints.map((w) => [w.lat, w.lng]);
  }
}
