// Service worker mínimo: solo hace falta para que Chrome en Android permita instalar la app.
// No guarda nada en caché: las actualizaciones llegan siempre desde la red, como hasta ahora.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.mode!=='navigate')return;
  e.respondWith(fetch(e.request).catch(()=>new Response('Sin conexión. Vuelve a intentarlo cuando tengas internet.',{status:503,headers:{'content-type':'text/plain;charset=utf-8'}})));
});
