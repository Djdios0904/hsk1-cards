const C='hsk1-v2';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
const put=(req,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp))}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  // pages: network first so updates show immediately; offline falls back to cache
  if(r.mode==='navigate'||r.url.endsWith('.html')||r.url.endsWith('/')){e.respondWith(fetch(r).then(res=>put(r,res)).catch(()=>caches.match(r).then(h=>h||caches.match('index.html'))));return}
  // everything else (audio, fonts, icons): cache first, fill on first use
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>put(r,res))))});
