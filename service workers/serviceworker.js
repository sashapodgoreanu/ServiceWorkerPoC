'use strict';

// Licensed under a CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
// http://creativecommons.org/publicdomain/zero/1.0/

(function() {

	// Update 'version' if you need to refresh the cache
	var staticCacheName = 'static';
	var version = 'v14::';

	// Store core files in a cache (including a page to display when offline)
	function updateStaticCache() {
		return caches.open(version + staticCacheName)
			.then(function (cache) {
				cache.addAll([
					'/images/mangagirl.jpg',
				]);
				return cache.addAll([
					'/sm3p.html',
					'/offline.html',
					'/'
				]);
			});
	};

	self.addEventListener('install', function (event) {
		event.waitUntil(updateStaticCache());
		console.log('Service worker installed');
	});

	self.addEventListener('activate', async (event) => {
		event.waitUntil(
			caches.keys()
				.then(function (keys) {
					// Remove caches whose name is no longer valid
					return Promise.all(keys
						.filter(function (key) {
						  return key.indexOf(version) !== 0;
						})
						.map(function (key) {
						  return caches.delete(key);
						})
					);
				})
		);
		//----------------------------------------------------------------
		try {
			/*const applicationServerKey = "BJb2rkUT0A1kfH0b_6UTU3Td7y_jXioOw5wyok0m50rj6UWdV4K9eXhIOxhA8Ozv0yM8ayGux9Afbjq03KplwWs";
			const options = { applicationServerKey, userVisibleOnly: true };
			const subscription = await self.registration.pushManager.subscribe(options);
			
			const js = JSON.stringify(subscription);
			console.log(js);

			fetch("http://localhost:15001/pn/savesubscription", {
				method: 'post',
				headers: {
					'Content-type': 'application/json'
				},
				body: js)
			});*/
		} catch (err) {
			console.error(err);
		}
		//----------------------------------------------------------------
		console.log('Service worker activated');
	});
	
	self.addEventListener('push', function(event) {
		if (event.data) {
			console.log('Push event!! ', event.data.text())
		} else {
			console.log('Push event but no data')
	}
	})

	self.addEventListener('fetch', function (event) {
		var request = event.request;
		// Always fetch non-GET requests from the network
		if (request.method !== 'GET') {
			event.respondWith(
				fetch(request)
					.catch(function () {
						return caches.match('/offline.html');
					})
			);
			return;
		}
		
/*		if(request.headers.get('simo').indexOf('ko') !== -1 && request.headers.get('Accept').indexOf('text/html') !== -1) {
			var fallbackResponse = { items: 
				[{
					snippet: {title: 'Fallback Title 1'}
				}, {
					snippet: {title: 'Fallback Title 2'}
				}, {
					snippet: {title: 'Fallback Title 3'}
				}]
			};
			return new Response(JSON.stringify(fallbackResponse), { type: 'application/json', headers: { 'resp': 'simoresp' } });
		}*/

		// For HTML requests, try the network first, fall back to the cache, finally the offline page
		if (request.headers.get('Accept').indexOf('text/html') !== -1) {
			// Fix for Chrome bug: https://code.google.com/p/chromium/issues/detail?id=573937
			if (request.mode != 'navigate') {
				request = new Request(request.url, {
					method: 'GET',
					headers: request.headers,
					mode: request.mode,
					credentials: request.credentials,
					redirect: request.redirect
				});
			}
			event.respondWith(
				fetch(request)
					.then(function (response) {
						// Stash a copy of this page in the cache
						var copy = response.clone();
						caches.open(version + staticCacheName)
							.then(function (cache) {
								cache.put(request, copy);
							});
						return response;
					})
					.catch(function () {
						return caches.match(request)
							.then(function (response) {
								return response || caches.match('/offline.html');
							})
					})
			);
			return;
		}

		// For non-HTML requests, look in the cache first, fall back to the network
		event.respondWith(
			caches.match(request)
				.then(function (response) {
					return response || fetch(request)
						.catch(function () {
							// If the request is for an image, show an offline placeholder
							if (request.headers.get('Accept').indexOf('image') !== -1) {
								return new Response('<svg width="400" height="300" role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
							}
						});
				})
		);
	});
	
	const urlB64ToUint8Array = base64String => {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
		const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
		const rawData = atob(base64)
		const outputArray = new Uint8Array(rawData.length)
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i)
		}
		return outputArray
	}

})();