// Aether Mobile : service des notifications du téléphone (Web Push).
// La base envoie { titre, texte, tag, type: 'message' | 'ami' | 'appel', de?, appel? }.
// Pas de gestion du cache ici : l'appli se charge toujours depuis le réseau.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

const base = () => self.registration.scope;
const icone = () => new URL("icone-192.png", base()).href;

// écran à ouvrir dans l'appli quand on touche la notification
function hashOf(d) {
  if (d.type === "message" && d.de) return "#dm=" + d.de;
  if (d.type === "appel" && d.appel != null) return "#appel=" + d.appel;
  if (d.type === "ami") return "#amis";
  return "";
}

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { texte: e.data ? e.data.text() : "" }; }
  if (!d || typeof d !== "object") d = {};
  e.waitUntil((async () => {
    const fenetres = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    // l'appli est ouverte devant les yeux : elle affiche déjà l'appel / le message, on la prévient seulement
    const devant = fenetres.find((w) => w.visibilityState === "visible" && w.focused);
    if (devant) { devant.postMessage({ type: "push", data: d }); return; }
    const appel = d.type === "appel";
    const opt = {
      body: String(d.texte || ""),
      icon: icone(),
      badge: icone(),
      data: { type: d.type || "", de: d.de || null, appel: d.appel == null ? null : d.appel, hash: hashOf(d) },
      vibrate: appel ? [500, 250, 500, 250, 900] : [150, 80, 150],
      requireInteraction: appel,
      lang: "fr",
      timestamp: Date.now(),
    };
    if (d.tag) { opt.tag = String(d.tag); opt.renotify = true; }
    await self.registration.showNotification(String(d.titre || "Aether"), opt);
  })());
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const d = e.notification.data || {};
  const hash = d.hash || "";
  e.waitUntil((async () => {
    const fenetres = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const w = fenetres.find((x) => x.url.startsWith(base())) || fenetres[0];
    if (w) {
      try { await w.focus(); } catch (x) { /* déjà au premier plan */ }
      w.postMessage({ type: "aller", hash });
      return;
    }
    await self.clients.openWindow(new URL("./" + hash, base()).href);
  })());
});
