# How to put your app online (so the tickets actually work)

The #1 reason everything kept failing before: you were running the app **inside the claude.ai artifact sandbox**, which blocks calls to ticket APIs. Once the app is a **real website**, the Ticketmaster API works and you get real events, real prices, and real buy links.

Deploying is free and takes about 3 minutes. Pick one option.

## Option A — Netlify Drop (easiest, no account needed to test)

1. Go to **https://app.netlify.com/drop**
2. Drag the whole **Global TICKET finder** folder onto the page.
3. Wait a few seconds — Netlify gives you a live link like `https://your-app.netlify.app`.
4. Open it on your phone or laptop. Search a city → real tickets load.

That link is shareable — send it to anyone, it works on mobile.

## Option B — GitHub Pages (good if you want it permanent + free)

1. Make a free account at **https://github.com**.
2. Create a new repository (e.g. `global-ticket-finder`).
3. Upload `index.html`, `logbook.html` (drag-and-drop in the browser works).
4. Repo → **Settings → Pages → Source: main branch → Save**.
5. After a minute your site is live at `https://yourname.github.io/global-ticket-finder/`.

## Install it as an app (Add to Home Screen)

Once it's deployed and you have the live link, you can put it on your phone like a real app:

**iPhone (Safari):** open the link → tap the Share button → **Add to Home Screen** → Add. An icon appears on your home screen; tapping it opens the app fullscreen, no browser bar.

**Android (Chrome):** open the link → tap the ⋮ menu → **Install app** (or **Add to Home Screen**).

This works because the folder now includes `manifest.webmanifest`, `sw.js` and the icon files — they tell the phone "this is an installable app." Nothing else to set up.

## How to test it works

- Search **Calgary** or **New York** with the **Sports** or **Concerts** category → you should see real upcoming events with prices and a working "Buy on Ticketmaster" button.
- Search **Paris** or **Tokyo** → events from those regions; attractions link out to GetYourGuide/Viator/Klook.

## A note on your API key

Your Ticketmaster key is in `index.html`. That's fine for a school project. If you ever make this public for real, move the key to a small backend so it isn't visible in the page source. The free Ticketmaster tier allows 5,000 calls/day, which is plenty.

## Files in this folder

- **index.html** — the Global Ticket Finder app.
- **logbook.html** — your editable 4-day project logbook (days 5–7 open).
- **manifest.webmanifest, sw.js, icon-192.png, icon-512.png, apple-touch-icon.png** — make the app installable to your home screen. Keep them in the same folder as index.html.
- **HOW-TO-DEPLOY.md** — this guide.

Important: when you deploy, drag the **whole folder** (so all these files go up together) — not just index.html on its own, or the app icon and install feature won't work.
