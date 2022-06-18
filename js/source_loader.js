(function() {
	// Script tag-ek lekérése:
	let script = document.getElementsByTagName('script'), links = [];
	for (var i = 0; i < script.length; i++) {
		let linkAttr = script[i].getAttribute('link');
		if ((script[i].getAttribute('src').indexOf('source_loader.js') > -1) && (linkAttr !== null)) {
			let link = ((linkAttr.indexOf(';') > -1) ? linkAttr.split(/\s*;\s*/) : [linkAttr]);
			for (var l = 0; l < link.length; l++) {
				links.push(link[l]);
			}
		}
	}
	// Linkek lekérése:
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
		let notFound = function() {
			window.alert("Az oldal nem található !");
			if (window.location.pathname.split('.').pop() === 'hta') window.close();
		};
		try {
			req.open("GET", (links[i] + '?_=' + new Date().getTime()), false);
			req.onload = (function() {
				if (req.status === 200) {
					tag.textContent = req.responseText;
					document.head.appendChild(tag);
				}
				else notFound();
			});
			try { req.send(null) } catch(e) { notFound() }
		}
		catch(e) { notFound() }
	}

})();
