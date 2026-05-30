# Vapi Assistant Configuration

## System Prompt Addition

Add this to the assistant's system prompt:

> After suggesting a route, ask the user: "Would you like me to share this plan with your friends? I can save it as a PDF to Box." If they say yes, call the shareToBox tool.

## Tool: shareToBox

Add this tool definition in the Vapi assistant dashboard:

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
