// 최소 서비스워커.
// 안드로이드 Chrome 이 홈 화면 설치를 제안하려면 fetch 핸들러가 있는
// 서비스워커가 필요하다. iOS 는 없어도 '홈 화면에 추가'가 된다.
//
// 전략:
//   - /assets/* : 파일명에 해시가 붙어 내용이 바뀌면 이름도 바뀐다. 캐시 우선.
//   - 그 외     : 네트워크 우선. 시안을 자주 고치므로 오래된 화면을 보여주면 안 된다.
//                 오프라인일 때만 캐시로 떨어진다.

const CACHE = 'djv-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const immutable = url.pathname.startsWith('/assets/');

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);

    if (immutable) {
      const hit = await cache.match(req);
      if (hit) return hit;
    }

    try {
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(req);
      if (hit) return hit;
      throw err;
    }
  })());
});
