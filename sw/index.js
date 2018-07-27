let staticCacheName = 'restaurantReviewsApp-v1'
let arrayOfUrls = [
    "../",
    '/register.js',
    '../index.html',
    '../restaurant.html',
    '../data/restaurants.json',
    '../js/dbhelper.js',
    '../js/main.js',
    '../js/restaurant_info.js',
    '../css/styles.css',
    '../css/responsive.css',
    '../img/*',
    '//normalize-css.googlecode.com/svn/trunk/normalize.css',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500'
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(staticCacheName)
            .then(cache => cache.addAll(arrayOfUrls))
            .then(self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(cacheNames.map(cache => {
            if (cache !== staticCacheName) {
                console.log("[ServiceWorker] removing cached files from ", cache);
                return caches.delete(cache);
            }
        })))
    )
})

self.addEventListener("fetch", event => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
        );
    }
});