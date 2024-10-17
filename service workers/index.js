const check = () => {
	if(!('serviceWorker' in navigator)) {
		throw new Error('No service Worker support<!');
	}
	if(!('PushManager' in window)) {
		throw new Error('No Push API support!');
	}
}

const registerServiceWorker = async () => {
	try {
		const swRegistration = await navigator.serviceWorker.register('serviceworker.js');
		if (swRegistration.installing) {
			console.log("Service worker installing");
		} else if (swRegistration.waiting) {
			console.log("Service worker installed");
		} else if (swRegistration.active) {
			console.log("Service worker active");
		}
		return swRegistration;
	} catch (error) {
		console.error(`Registration failed with ${error}`);
	}
}

const requestNotificationPermission = async () => {
	const permission = await window.Notification.requestPermission();
	// value of permission can be 'granted', 'default', 'denied'
	// granted: user has accepted the request
	// default: user has dismissed the notification permission popup by clicking on x
	// denied: user has denied the request.
	if(permission !== 'granted'){
		throw new Error('Permission not granted for Notification');
	}
	return permission;
}

const showLocalNotification = (title, body, swRegistration) => {
	const options = {
		body,
		"image": "images/mangagirl_bw.jpg"
	};
	swRegistration.showNotification(title, options);
}

const main = async () => {
	check();
	const swRegistration = await registerServiceWorker();
	const permission = await requestNotificationPermission();
	//showLocalNotification('Notification from local website', 'Manga girl in b/w', swRegistration);
}

//main();