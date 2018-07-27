let staticCacheName = 'restaurantReviewsApp-v1'

self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
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
            ]);
        })
    );
});



self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurantReviewsApp-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondwith(
        caches.match(event.request).then(function(response) {
            if (response !== null) {
                return response;
            }else {
                return fetch(event.request).then(function(response) {
                    let responseClone = response.clone();
                    caches.open(staticCacheName).then(function(cache) {
                        cache.put(event.request, responseClone);
                    })
                    return response;
                });
            }
        })
    )
});