# Setting up the Trip Planner (AI itinerary)

The planner page (`planner.html`) builds a custom trip with AI. The AI is called by a small
serverless function (`netlify/functions/plan.js`) so your **API key stays secret** — it is never
visible in the website source, unlike the Ticketmaster key.

You need two things: a deploy that includes the function, and your Anthropic API key set as an
environment variable. About 10 minutes the first time.

## Why drag-and-drop alone isn't enough here
Serverless functions and secret environment variables work best when Netlify builds your site from
a code repository. The easiest reliable path is GitHub → Netlify. (Plain Netlify Drop can serve the
static pages, but wiring up the function + secret key is fiddly.)

## Step 1 — Get an Anthropic API key
1. Go to **https://console.anthropic.com**, sign in, and open **API Keys**.
2. Create a key and copy it (starts with `sk-ant-...`). Keep it private — treat it like a password.
3. Add a few dollars of credit if prompted; each itinerary costs a fraction of a cent.

## Step 2 — Put the project on GitHub
1. Create a free account at **https://github.com** and make a new repository.
2. Upload the whole **Global TICKET finder** folder (drag-and-drop in the browser works), including
   the `netlify` folder and `netlify.toml`.

## Step 3 — Connect it to Netlify
1. At **https://app.netlify.com**, click **Add new site → Import an existing project**.
2. Pick GitHub and choose your repo. Leave the build settings as default and deploy.

## Step 4 — Add your secret key
1. In Netlify: **Site settings → Environment variables → Add a variable**.
2. Key: `ANTHROPIC_API_KEY`  ·  Value: your `sk-ant-...` key. Save.
3. Go to **Deploys → Trigger deploy → Deploy site** so the new key is picked up.

## Step 5 — Test it
- Open your site, click **"Plan a whole trip with a budget"** (or go to `/planner.html`).
- Enter: From **Calgary, Canada**, Destination **Paris, France**, 5 days, budget **2000 CAD**,
  2 travellers, interests like "art museums, food, live music" → **Plan my trip**.
- After ~15 seconds you get a day-by-day plan with a budget bar and **Book** buttons that open
  Google Flights, Booking.com, Ticketmaster, etc.

## Changing the AI model
In `netlify/functions/plan.js`, the `MODEL` line near the top controls which Claude model is used.
A smaller model (e.g. a Haiku model) is cheaper and faster; a larger one writes richer plans.

## Costs & safety
- The key lives only on Netlify's servers, never in the page — that's the point of the function.
- Each plan is a tiny amount of credit. If you ever expose a key by accident, delete it in the
  Anthropic console and make a new one.
