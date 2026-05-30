# Phase 1: Vapi Voice AI Web App (Private Key Backend)

## Overview
Minimal NextJS app with a play button at the bottom of the page. Clicking it initiates a Vapi voice AI conversation. The private key stays server-side — a NextJS API route generates a short-lived JWT token that the frontend uses to connect.

## Flow
```
User clicks Play
  → Frontend POSTs /api/vapi/token
  → API route signs JWT with VAPI_PRIVATE_KEY
  → Returns { token }
  → Frontend: new Vapi(token) → vapi.start(assistantId)
  → Voice call active
User clicks Stop
  → vapi.stop()
```

## Architecture
```
app/
├── api/vapi/token/route.ts   ← Signs JWT (server-only)
├── page.tsx                   ← Renders VapiButton
├── layout.tsx
└── globals.css
components/
└── VapiButton.tsx             ← "use client", Vapi SDK + call state
```

## Environment Variables (server-only)
- `VAPI_PRIVATE_KEY` — Vapi private key from dashboard
- `VAPI_ORG_ID` — Vapi organization ID
- `VAPI_ASSISTANT_ID` — Vapi assistant ID

## Dependencies
- `@vapi-ai/web` — Client-side Vapi SDK
- `jsonwebtoken` — Server-side JWT signing

## Acceptance Criteria
1. Play button fixed at bottom center of viewport
2. Clicking play fetches token from backend, starts voice call
3. Button shows idle/connecting/active/error states
4. Clicking stop ends the call
5. Private key never exposed to client
6. `npm run build` succeeds
