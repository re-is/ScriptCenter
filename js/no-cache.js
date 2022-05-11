/*
	Source loader without cache
	Coded by István Reich, 2022
*/

(function() {
	// Script tag-ek lekérése:
	let script = document.getElementsByTagName('script'), links = [];
	for (var i = 0; i < script.length; i++) {
		if (script[i].getAttribute('src').indexOf('no-cache.js') > -1) {
			for (var id = 0; id < 10; id++) {
				let n = (id === 0 ? '' : id);
				if (script[i].getAttribute('link' + n) !== null) links.push(script[i].getAttribute('link' + n));
			}
		}
	}
	// Linkek betöltése:
	for (var i = 0; i < links.length; i++) {
		let ext = links[i].split('.').pop(), tag;
		if (ext === 'js') {
			tag = document.createElement('script');
			tag.setAttribute('type', 'text/javascript');
		}
		if (ext === 'css') {
			tag = document.createElement('style');
			tag.setAttribute('type', 'text/css');
		}
		let req = new XMLHttpRequest();
		req.open("GET", (links[i] + '?_=' + new Date().getTime()), false);
		req.onload = (function() {
			if (req.status === 200) {
				tag.textContent = req.responseText;
				document.head.appendChild(tag);
			}
			else {
				window.alert("Az oldal nem található !");
				if (window.location.pathname.split('.').pop() === 'hta') window.close();
			}
		});
		req.send(null);
	}

})();
