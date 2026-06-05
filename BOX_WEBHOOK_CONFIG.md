# Box Webhook Configuration

This webhook causes Box to notify your server whenever a file is uploaded, which triggers the outbound VAPI evacuation call to the neighbor.

## Prerequisites

- A Box developer account at [developer.box.com](https://developer.box.com)
- Your app must be authorized in the Box Admin Console (or be a standalone JWT/OAuth2 app)
- Your server must be publicly reachable (e.g. deployed on Vercel, or use a tunnel like ngrok for local dev)

---

## Steps

### 1. Create a Box App (if you haven't already)

1. Go to [developer.box.com](https://developer.box.com) → **My Apps** → **Create New App**
2. Choose **Custom App** → **User Authentication (OAuth 2.0)** or **Server Authentication (JWT)**
3. Note your **Client ID** and **Client Secret**

### 2. Get a Developer Token

1. Open your app in the Box Developer Console
2. Go to the **Configuration** tab
3. Under **Developer Token**, click **Generate Developer Token**
4. Copy the token — this is your `BOX_DEVELOPER_TOKEN` env var (expires every 60 minutes)

### 3. Find or Create the Target Folder

1. Go to [app.box.com](https://app.box.com) and navigate to the folder where uploads should land
2. The folder ID is in the URL: `https://app.box.com/folder/123456789` → ID is `123456789`
3. Use `"0"` for the root folder
4. Set this as your `BOX_FOLDER_ID` env var

### 4. Create the Webhook

Box webhooks must be created via API. Run this `curl` command, substituting your values:

```bash
curl -X POST https://api.box.com/2.0/webhooks \
  -H "Authorization: Bearer <BOX_DEVELOPER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "target": {
      "id": "<BOX_FOLDER_ID>",
      "type": "folder"
    },
    "address": "https://<YOUR_DOMAIN>/api/box/webhook",
    "triggers": ["FILE.UPLOADED"]
  }'
```

- `target.id` — the folder ID from Step 3
- `address` — your publicly accessible webhook URL
- `triggers` — only `FILE.UPLOADED` is needed

A successful response returns a webhook object with an `id`. Save it if you need to delete or inspect the webhook later.

### 5. Verify the Webhook Exists

```bash
curl https://api.box.com/2.0/webhooks \
  -H "Authorization: Bearer <BOX_DEVELOPER_TOKEN>"
```

This lists all webhooks on the account. Confirm your entry appears with the correct address and trigger.

---

## Local Development (ngrok)

Box requires an HTTPS URL. For local testing:

```bash
ngrok http 3000
```

Use the `https://xxxx.ngrok.io` URL as the `address` in Step 4. Re-create the webhook each time the ngrok URL changes.

---

## Deleting a Webhook

```bash
curl -X DELETE https://api.box.com/2.0/webhooks/<WEBHOOK_ID> \
  -H "Authorization: Bearer <BOX_DEVELOPER_TOKEN>"
```

---

## Environment Variables Summary

| Variable | Description |
|---|---|
| `BOX_DEVELOPER_TOKEN` | Short-lived token from Box Dev Console (regenerate every 60 min) |
| `BOX_FOLDER_ID` | ID of the Box folder to upload into (`"0"` for root) |
