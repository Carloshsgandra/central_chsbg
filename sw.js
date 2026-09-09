const CACHE = 'javaflow-v9-nexo';
const CORE = ['./', './index.html', './assets/css/app.css','./assets/css/nexo.css','./assets/css/academy-layout.css', './assets/js/app.js', './assets/js/auth.js','./assets/js/academy.js','./assets/js/academy-core.js','./assets/js/academy-data.js','./assets/js/progress-merge.js', './assets/vendor/netlify-identity.js', './assets/js/english.js', './assets/js/english-resources.js', './assets/js/network.js', './assets/js/views.js', './assets/js/store.js', './assets/js/services.js', './assets/js/utils.js', './assets/js/data.js'];
const paths = new Set(CORE.map(path=>new URL(path,self.location.href).pathname));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('javaflow-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 // Auth, progress, snapshots and third-party requests never enter the asset cache.
 if(event.request.method!=='GET' || url.origin!==self.location.origin || !paths.has(url.pathname) || url.search) return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
  return response;
 }).catch(async()=>await caches.match(event.request) || new Response('Recurso indisponível offline',{status:503})));
});

