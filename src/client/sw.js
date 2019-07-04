var DOMAIN_NAME = self.location.origin;
const url = new URL(location.href);
const debug = url.searchParams.has('debug');
var API_CACHE = 'api-cache';
var RUNTIME_CACHE = 'runtime-cache';
var IMAGE_CACHE = 'image-cache';
//var CSS_CACHE = 'css-cache';

if (workbox) {
	(function () {
		//console.log('Yay! Workbox is loaded 🎉 at', DOMAIN_NAME);
		workbox.setConfig({debug});
		workbox.core.clientsClaim();
		self.__precacheManifest = [].concat(self.__precacheManifest || []);
		self.__precacheManifest.unshift({
			url: '/offline.html'
		});

		workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
		
		var apiHandler = workbox.strategies.staleWhileRevalidate({
			cacheName: API_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 24 * 60 * 60 // 1day
			}), new workbox.cacheableResponse.Plugin({
				statuses: [200]
			})]
		});

		workbox.routing.registerRoute(/(http|https):\/\/(data|idiva-frontend-api-navik|idiva-frontend-api-cs.idiva.com).(idiva.com)(.*?)/, function (args) {
			return apiHandler.handle(args).then(function (response) {
				if (response.status > 400) {
					return caches.match('400.json');
				} else {
					return response;
				}
			}).catch(function (ex) {
				return caches.match('500.json');
			});
		}, 'GET');

		workbox.routing.registerRoute(/(.*)\/images\//, workbox.strategies.cacheFirst({
			cacheName: IMAGE_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 31536000 // 1 year
			})]
		}), 'GET');

		workbox.routing.registerRoute(/(.*)\/fonts\//, workbox.strategies.cacheFirst({
			cacheName: IMAGE_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 31536000 // 1 year
			})]
		}), 'GET');

		workbox.routing.registerRoute(/(.*)/, new workbox.strategies.NetworkFirst({
			cacheName: RUNTIME_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 30 * 60 // 30 min
			})]
		}), 'GET');

		workbox.routing.registerRoute(/.*/, new workbox.strategies.NetworkFirst(), 'GET');
		
		// workbox.routing.registerRoute(/(.*)\/css\//, workbox.strategies.cacheFirst({
		// 	cacheName: CSS_CACHE,
		// 	plugins: [new workbox.expiration.Plugin({
		// 		maxEntries: 3,
		// 		maxAgeSeconds: 31536000 // 1 year
		// 	})]
		// }));

		self.addEventListener('install', function (event) {
			// var urls = ['/hindi'];
			// var cacheName = HTML_CACHE; //workbox.core.cacheNames.runtime
			// event.waitUntil(caches.open(cacheName).then(function (cache) {
			// 	return cache.addAll(urls).then(function (data) {}).catch(function (error) {
			// 		self.skipWaiting();
			// 	});
			// }));
			return event.waitUntil(self.skipWaiting());
		});

		self.addEventListener('activate', function (event) {
			event.waitUntil(
				caches.keys().then(function (cacheNames) {
					return Promise.all(
						cacheNames.map(function (cacheName) {
							if (cacheName.indexOf('runtime') != -1) {
								console.log('Deleting out of date cache:', cacheName);
								return caches.delete(cacheName);
							}
						})
					);
				})
			);
		});

		self.addEventListener('message', function (event) {
			if (event.data && event.data.type === 'SKIP_WAITING') {
				self.skipWaiting();
			}
			var jsArray = event.data.map(function (js) {
				fetch(js);
			});
			Promise.all(jsArray).then(function (data) {
				return event.ports[0].postMessage("SW Says 'Hello back!'");
			}, function (error) {
				return event.ports[0].postMessage("SW Says 'Hello back Error!'");
			});
		});
	})();
} else {
	//console.log('Boo! Workbox didn\'t load 😬');
}