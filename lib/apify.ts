export interface PlaceResult {
  lat: number;
  lng: number;
  title: string;
  address: string;
  rating: number | null;
  category: string;
}

export interface SearchResult {
  text: string;
  places: PlaceResult[];
}

export async function searchNearby(query: string, lat: number, lng: number): Promise<SearchResult> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    return { text: "Apify is not configured. Missing API token.", places: [] };
  }

  const res = await fetch(
    `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${token}&timeout=60`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: [query],
        maxCrawledPlacesPerSearch: 5,
        language: "en",
        deeperCityScrape: false,
        customGeolocation: {
          type: "Point",
          coordinates: [lng, lat],
        },
      }),
    }
  );

  if (!res.ok) {
    return { text: "Sorry, I couldn't search for nearby places right now.", places: [] };
  }

  const results = await res.json();

  if (!results.length) {
    return { text: `No results found for "${query}" near your location.`, places: [] };
  }

  const places: PlaceResult[] = results.slice(0, 5).map(
    (place: { title?: string; address?: string; totalScore?: number; location?: { lat: number; lng: number } }) => ({
      lat: place.location?.lat ?? 0,
      lng: place.location?.lng ?? 0,
      title: place.title || "Unknown",
      address: place.address || "No address",
      rating: place.totalScore ?? null,
      category: query,
    })
  );

  return {
    text: `I found ${places.length} results for ${query} near your location and placed them on the map for you.`,
    places,
  };
}
