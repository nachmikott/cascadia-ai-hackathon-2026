# Vapi Assistant Configuration

## System Prompt

```
You are an Evacuation Planner voice assistant.

When users ask about nearby places like campsites, grocery stores, gas stations, or any location-based query, use the searchNearby tool. Extract what they are looking for as the `query` parameter. The search will use their current location. Never read out or list the names, addresses, or details of places — the user can see them on the map. Just confirm the search is happening and move on.

When the user asks you to create, update, or modify a plan, use the updatePlan tool. Write the full plan text and use mode "replace" to set it, or "append" to add to it.

## Sharing
When the user asks to share the current route plan—e.g., "share this", "send this to my friends", "export a PDF", "upload to Box", or anything similar—use the shareToBox tool to generate a PDF of the current route plan and upload it to Box.
- After the tool returns, tell the user that the PDF was uploaded and share whatever link or share instructions the tool result provides.
- If the tool result does not include a link, ask the user who they want to share it with and offer to generate a shareable link if available.
```

## Tools

### searchNearby

```json
{
  "type": "function",
  "function": {
    "name": "searchNearby",
    "description": "Search for nearby places using the user's current location.",
    "parameters": {
      "type": "object",
      "properties": {
        "query": { "type": "string", "description": "What to search for (e.g. campsites, grocery stores)" }
      },
      "required": ["query"]
    }
  },
  "server": {
    "url": "https://<YOUR_URL>/api/vapi/tools"
  }
}
```

### suggestRoute

```json
{
  "type": "function",
  "function": {
    "name": "suggestRoute",
    "description": "Plot the fastest evacuation route on the map. Automatically picks the closest place from each category currently pinned to minimize total travel distance. The user must stop at one of each type. Always assume urgency — this is an emergency.",
    "parameters": {
      "type": "object",
      "properties": {}
    }
  },
  "server": {
    "url": "https://<YOUR_URL>/api/vapi/tools"
  }
}
```

### getMapStatus

```json
{
  "type": "function",
  "function": {
    "name": "getMapStatus",
    "description": "Check what places are currently pinned on the map and their categories. Use this to know what's available before suggesting a route or answering questions about pinned locations.",
    "parameters": {
      "type": "object",
      "properties": {}
    }
  },
  "server": {
    "url": "https://<YOUR_URL>/api/vapi/tools"
  }
}
```

### clearMap

```json
{
  "type": "function",
  "function": {
    "name": "clearMap",
    "description": "Clear all pins and routes from the map.",
    "parameters": {
      "type": "object",
      "properties": {}
    }
  },
  "server": {
    "url": "https://<YOUR_URL>/api/vapi/tools"
  }
}
```

### shareToBox

```json
{
  "type": "function",
  "function": {
    "name": "shareToBox",
    "description": "Generate a PDF of the current route plan and upload it to Box for sharing with friends.",
    "parameters": {
      "type": "object",
      "properties": {}
    }
  },
  "server": {
    "url": "https://<YOUR_URL>/api/vapi/tools"
  }
}
```

## Environment Variables Required

- `BOX_DEVELOPER_TOKEN` — Box developer token (expires every 60 min, regenerate from Box Dev Console)
- `BOX_FOLDER_ID` — Box folder ID to upload into (use `"0"` for root)
- `GEOAPIFY_API_KEY` — Geoapify API key for static map images (free tier: 3000 credits/day)
