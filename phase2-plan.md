# Phase 2: Vapi + Apify Integration (Google Maps Scraper)

## Overview
When a user asks Vapi about nearby places (campsites, grocery stores, gas stations, etc.), the assistant triggers an Apify Google Maps Scraper actor, retrieves real results, and speaks them back to the user.

## Flow
```
User speaks: "Find campsites near Portland"
  → Vapi LLM decides to call tool "searchNearby"
  → Vapi POSTs to /api/vapi/tools with { query: "campsites", location: "Portland" }
  → Our route calls Apify: POST /v2/acts/compass~crawler-google-places/run-sync-get-dataset-items
  → Apify scrapes Google Maps, returns top 5 results
  → Our route formats results and responds to Vapi
  → Vapi speaks the results to the user
```

## Architecture
```
lib/apify.ts                ← searchNearby(query, location) helper
app/api/vapi/tools/route.ts ← Webhook Vapi calls when tool is triggered
```

## Environment Variables
- `APIFY_API_TOKEN` — Apify API token (from https://console.apify.com/account/integrations)

## Apify Actor
- **Actor:** `compass/crawler-google-places`
- **Endpoint:** `POST https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=<TOKEN>&timeout=60`
- **Input:** `{ searchStringsArray: ["<query> near <location>"], maxCrawledPlacesPerSearch: 5 }`
- **Output:** Array of place objects with `title`, `address`, `totalScore`, etc.

## Vapi Assistant Tool Config
```json
{
  "type": "function",
  "function": {
    "name": "searchNearby",
    "description": "Search for nearby places using Google Maps.",
    "parameters": {
      "type": "object",
      "properties": {
        "query": { "type": "string", "description": "What to search for" },
        "location": { "type": "string", "description": "The location to search near" }
      },
      "required": ["query", "location"]
    }
  },
  "server": {
    "url": "https://<YOUR_URL>/api/vapi/tools"
  }
}
```

## System Prompt
```
You are an Evacuation Planner voice assistant. When users ask about nearby places like campsites, grocery stores, gas stations, or any location-based query, use the searchNearby tool. Extract what they are looking for as the query and where they are as the location. If they do not specify a location, ask them where they are.
```

## Acceptance Criteria
1. User asks about nearby places → Vapi calls searchNearby tool
2. Tool triggers Apify Google Maps Scraper with query + location
3. Top 5 results returned (name, address, rating)
4. Vapi speaks results back to user
5. Works for any place type (campsites, stores, restaurants, etc.)
6. Handles errors gracefully (timeout, no results)
7. `npm run build` succeeds
