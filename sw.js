// Minimal service worker — required for the app to be "installable".
// It caches the app shell so the icon/page open instantly, but always
// fetches live Ticketmaster data from the network (never caches API calls).
var CACHE = "gtf-v1";
var SHELL = ["./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  var url = e.request.url;
  // Never cache API or external calls — always go to the network for live data.
  if (url.indexOf("ticketmaster.com") > -1 || url.indexOf("nominatim") > -1 ||
      url.indexOf("ipapi") > -1 || e.request.method !== "GET") {
    return; // let the browser handle it normally
  }
  // App shell: serve from cache first, fall back to network.
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
