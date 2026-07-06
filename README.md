# post-mate

Welcome to the **post-mate**. This document provides instructions on how to set up the project locally using Docker, as well as how to configure the environment when using ngrok for local development (which is essential for testing webhooks and external platform callbacks like Google Auth and Instagram).

## Local Setup with Docker

1. **Prerequisites**: Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
2. **Environment Variables**: 
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the required environment variables.
3. **Start the Database and Application**:
   - You can start both the PostgreSQL database and the Next.js app using Docker Compose:
     ```bash
     docker-compose up --build
     ```
   - The app will be available at `http://localhost:3000`.

## Local Setup with Ngrok

When developing locally, you will often need to expose your local server to the internet using a tool like [ngrok](https://ngrok.com/) (e.g., `ngrok http 3000`). This provides you with a public HTTPS URL (like `https://<your-ngrok-id>.ngrok-free.app`) that is required for external services to communicate with your local app.

Once you have your ngrok URL running, **you must update the following configurations** to ensure everything works correctly:

### 1. Update Environment Variables
In your `.env` file, update the `NEXT_PUBLIC_APP_URL` (and any other relevant base URLs) to your new ngrok URL:
```env
NEXT_PUBLIC_APP_URL=https://<your-ngrok-id>.ngrok-free.app
```

### 2. Update Next.js Config
In `next.config.js`, you need to allow your ngrok domain in the `allowedDevOrigins` array so that Next.js doesn't block the requests:
```javascript
// next.config.js
const config = {
  // ...
  allowedDevOrigins: ["localhost:3000", "<your-ngrok-id>.ngrok-free.app"],
};
```

### 3. Update Google Auth
Go to your [Google Cloud Console](https://console.cloud.google.com/) and navigate to your OAuth 2.0 Client IDs.
- Add your ngrok URL to the **Authorized JavaScript origins** (e.g., `https://<your-ngrok-id>.ngrok-free.app`).
- Add your ngrok callback URL to the **Authorized redirect URIs** (e.g., `https://<your-ngrok-id>.ngrok-free.app/api/auth/callback/google`).

### 4. Update Cloudflare R2 Allowed Hosts
If you are using Cloudflare R2 for storage, you must update the CORS configuration in the Cloudflare Dashboard to allow requests from your ngrok URL:
- Go to your R2 bucket settings > CORS configuration.
- Add `https://<your-ngrok-id>.ngrok-free.app` to the `AllowedOrigins`.

### 5. Update Instagram Callback URL
To receive webhooks or authenticate with Instagram locally, update the callback URL in your Facebook/Meta Developer Dashboard:
- Go to your App Dashboard > Product Settings.
- Update the valid OAuth Redirect URIs and Webhook callback URLs to point to your ngrok URL.

## API Tokens & Credentials

To enable social media integrations, you will need to obtain API credentials from each respective platform's developer portal:

- **LinkedIn**: Go to the [LinkedIn Developer Portal](https://developer.linkedin.com/), create an application, and navigate to the "Auth" tab to find your **Client ID** and **Client Secret**. Make sure to request access to the necessary marketing or Share on LinkedIn products.
- **Facebook & Instagram**: Go to [Meta for Developers](https://developers.facebook.com/). Create an app, add the **Instagram Graph API** and **Facebook Login** products. You can find your **App ID** and **App Secret** in the App Settings > Basic.
- **Threads**: Also managed through [Meta for Developers](https://developers.facebook.com/). Under your Meta App, you can enable the Threads API by requesting the specific Threads use cases to get the required credentials for publishing.

## Future Features

- **Analytics Feature**: Advanced tracking and insights.
- **Auto-Reply / Comments**: Add comments to main posts and support automated replies.

