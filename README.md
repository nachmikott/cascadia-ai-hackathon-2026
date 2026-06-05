# Cascadia AI Hackathon 2026

Voice-powered interactive evacuation planning support. 
* A VAPI voice assistant lets users search for nearby places (campsites, gas stations, grocery stores)
* Determine an optimized evacuation route
* Inform a neighbor of the plan, create shareable PDFs of the plan and trigger an automated outbound phone call to tell them the plan.

## How It Works

1. User opens the app and clicks the mic button to start a VAPI voice session
2. The assistant helps search nearby places and plot an evacuation route on the map
3. When the user asks to share the route, a PDF and companion text file are uploaded to Box
4. Box fires a webhook to the server, which triggers a VAPI outbound phone call to a neighbor
5. The neighbor receives a call with the evacuation plan read aloud by an AI voice

## Running the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```
VAPI_PRIVATE_KEY=
VAPI_ORG_ID=
VAPI_ASSISTANT_ID=
VAPI_PHONE_NUMBER_ID=
NEIGHBOR_PHONE_NUMBER=
BOX_DEVELOPER_TOKEN=
BOX_FOLDER_ID=
APIFY_API_TOKEN=
```

## VAPI Setup

https://vapi.ai/

See `VAPI_CONFIG.md` for the full assistant configuration, including the system prompt and all tool definitions (`searchNearby`, `suggestRoute`, `getMapStatus`, `clearMap`, `shareToBox`).

The VAPI assistant's tools point to `/api/vapi/tools` on your server — this must be a publicly accessible HTTPS URL (see **Local Development** below).

## Box Setup

https://box.com/

See `BOX_WEBHOOK_CONFIG.md` for step-by-step instructions on:
- Creating a Box app and generating a developer token
- Finding your folder ID
- Registering the `FILE.UPLOADED` webhook pointing to `/api/box/webhook`

## Local Development with ngrok

Box webhooks and VAPI tool calls both require a publicly accessible HTTPS URL. Use [ngrok](https://ngrok.com) to tunnel your local server:

```bash
ngrok http 3000
```

Use the `https://xxxx.ngrok.io` URL as:
- The `address` when registering your Box webhook (see `BOX_WEBHOOK_CONFIG.md`)
- The `server.url` in each tool definition in your VAPI assistant config (see `VAPI_CONFIG.md`)
