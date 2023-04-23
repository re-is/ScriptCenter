//-------------------------------------------//
// 2023.04.23.
//-------------------------------------------//

window.graph_listeners = {};

function createLineGraph(param) {

	if (!param['elem']) return window.alert('createGraph({\n\n   elem :   HTMLElement   is not found!\n\n});\n');
	if (!param['items']) return window.alert('createGraph({\n\n   items :   Array[...]   is not defined!\n\n});\n');

	let chart    = { class: param['elem'], elem: document.getElementsByClassName(param['elem'])[0], html: '' },
		items    = param['items'],
		lineOk   = (items.length > 1),
		summary  = 0,
		step     = { x: 0, y: 0, top: 0, left: 0, value: 0 },
		highest  = { value: items[0], index: 0 },
		lowest   = { value: 0, line: items[0], index: 0 },
		largest  = { item: items[0], index: 0 },
		smallest = { item: items[0], index: 0 },
		main     = { css: false, width: 2, half: 1, points: '' },
		trnd     = { css: false, width: 2, half: 1, points: '' },
		zero     = { css: false, width: 2, half: 1, points: '', top: 0 },
		sheets   = document.styleSheets, sheet;


	// CSS bontása:
	for (sheet in sheets) {
		if (!sheets.hasOwnProperty(sheet)) continue;
		let rules = sheets[sheet].cssRules, rule, selector;
		for (rule in rules) {
			if (!rules.hasOwnProperty(rule)) continue;
			selector = String(rules[rule].selectorText);
			// Main Line ------------------------------->
			if (selector.indexOf(chart.class + '-main') > -1) {
				let w = rules[rule].style['stroke-width'];
				main.width = ((w !== '') ? parseInt(w) : 2);
				main.half = (main.width * 0.5);
				main.css = true;
			}
			// Trend Line ------------------------------>
			if (selector.indexOf(chart.class + '-trend') > -1) {
				let w = rules[rule].style['stroke-width'];
				trnd.width = ((w !== '') ? parseInt(w) : 2);
				trnd.half = (trnd.width * 0.5);
				trnd.css = true;
			}
			// Zero Line ------------------------------->
			if (selector.indexOf(chart.class + '-zero') > -1) {
				let w = rules[rule].style['stroke-width'];
				zero.width = ((w !== '') ? parseInt(w) : 2);
				zero.half = (zero.width * 0.5);
				zero.css = true;
			}
		}
	}


			// Egyenleg összeállítása:
			let balance = items.map(function(item, index) {
				// Értéknövelés:
				let value = (summary += item);
				// Magas, alacsony értékek:
				if (value >= highest.value) {
					highest.index = index;
					highest.value = value;
				}
				if (value <= lowest.value) lowest.value = value;
				// Legalacsonyabb vonal-index:
				if (value <= lowest.line) {
					lowest.index = index;
					lowest.line = value;
				}
				// Legkisebb, legnagyobb tételek:
				if (item >= largest.item) {
					largest.index = index;
					largest.item = item;
				}
				if (item <= smallest.item) {
					smallest.index = index;
					smallest.item = item;
				}
				return value;
			});


	// Méretek ----------------------------------------------------------------------->
	chart.offset		= (function() { let r = chart.elem.getBoundingClientRect(); return { top: Math.round(r.top + chart.elem.clientTop), left: Math.round(r.left + chart.elem.clientLeft) } });
	chart.rect			= chart.elem.getBoundingClientRect();
	chart.float			= { top: (Math.round(chart.rect.top) - chart.rect.top), left: (Math.round(chart.rect.left) - chart.rect.left) };
	chart.top			= (chart.elem.offsetTop + chart.elem.clientTop);
	chart.left			= (chart.elem.offsetLeft + chart.elem.clientLeft);
	chart.width			= chart.elem.clientWidth;
	chart.height		= chart.elem.clientHeight;
	chart.innerTop		= Math.round(chart.top + main.width);
	chart.innerHeight	= Math.round(chart.height - (main.width * 2));
	// Léptetések -------------------------------------------------------------------->
	step.left			= ((chart.width - main.width) / (balance.length - 1));
	step.top			= (chart.innerHeight / (highest.value - lowest.value));
	step.value			= ((highest.value - lowest.value) / chart.innerHeight);
	step.x				= main.half;
	zero.top			= Math.round(chart.innerHeight + (lowest.value * step.top));

	// Ha csak egy nulla item van:
	if (step.top === Infinity) zero.top = chart.innerHeight;

	let x, y, relatives = { main: [], trend: [], zero: [], highest: [], lowest: [], largest: [], smallest: [] };


			// Egyenleg bontása:
			balance.map(function(value, index) {
				step.y = ((step.top === Infinity) ? chart.innerHeight : (chart.innerHeight - ((value - lowest.value) * step.top)));
				// Vonal-grafikonhoz minimum 2 tétel kell:
				if (lineOk) {
					// Kezdőpont:
					if (index === 0) {
						main.points = ((-main.width) + ',' + (chart.innerHeight + main.width) + ' ' + (-main.width) + ',' + step.y + ' ' + main.half + ',' + step.y + ' ');
						trnd.points = ((-trnd.width) + ',' + step.y + ' ' + main.half + ',' + step.y + ' ');
					}
					// Végpont:
					else if (index === (balance.length - 1)) {
						main.points += ((chart.width - main.half) + ',' + step.y + ' ' + (chart.width + main.width) + ',' + step.y + ' ' + (chart.width + main.width) + ',' + (chart.innerHeight + main.width));
						trnd.points += ((chart.width - main.half) + ',' + step.y + ' ' + (chart.width + trnd.width) + ',' + step.y);
						zero.points = ((-zero.width) + ',' + (chart.innerHeight + main.width) + ' ' + (-zero.width) + ',' + zero.top + ' ' + (chart.width + zero.width) + ',' + zero.top + ' ' + (chart.width + zero.width) + ',' + (chart.innerHeight + main.width));
					}
					else {
						step.x += step.left;
						main.points += (step.x + ',' + step.y + ' ');
					}
					// Nem szabad kerekíteni !
					x = ((index === 0) ? main.half : (index === (balance.length - 1)) ? (chart.width - main.half) : step.x);
					y = (step.y + main.width);
					// Minden main pont:
					relatives.main.push([x, y]);
					// Legmagasabb, legalacsonyabb pontok:
					relatives.highest.push((index === highest.index) ? [x, y] : [0, 0]);
					relatives.lowest.push((index === lowest.index) ? [x, y] : [0, 0]);
					// Legnagyobb, legkisebb tételek:
					relatives.largest.push((index === largest.index) ? [x, y] : [0, 0]);
					relatives.smallest.push((index === smallest.index) ? [x, y] : [0, 0]);
					// Trend pontok:
					if (index === 0) relatives.trend.push([x, y]);
					if (index === (balance.length - 1)) relatives.trend.push([x, y]);
					// Zero pontok:
					if (index === 0) relatives.zero = [[zero.half, (zero.top + main.width)], [(chart.width - zero.half), (zero.top + main.width)]];
				}
			});


	// HTML összeállítása:
	if (main.css) chart.html += ('<svg style="position:absolute;width:' + chart.width + 'px;height:' + chart.innerHeight + 'px;margin-top:' + (main.width + chart.float.top) + 'px;margin-left:' + chart.float.left + 'px;overflow:visible;z-index:1;"><polyline points="' + main.points + '" class="' + chart.class + '-main"></svg>');
	if (trnd.css) chart.html += ('<svg style="position:absolute;width:' + chart.width + 'px;height:' + chart.innerHeight + 'px;margin-top:' + (main.width + chart.float.top) + 'px;margin-left:' + chart.float.left + 'px;overflow:visible;z-index:1;"><polyline points="' + trnd.points + '" class="' + chart.class + '-trend" style="fill:none;"></svg>');
	if (zero.css) chart.html += ('<svg style="position:absolute;width:' + chart.width + 'px;height:' + chart.innerHeight + 'px;margin-top:' + (main.width + chart.float.top) + 'px;margin-left:' + chart.float.left + 'px;overflow:visible;z-index:1;"><polyline points="' + zero.points + '" class="' + chart.class + '-zero"></svg>');
	// Integrálás:
	chart.elem.style.position = 'relative';
	chart.elem.style.overflow = 'hidden';
	chart.elem.innerHTML = chart.html;

	// Adatok a kurzorból:
	function dataByCursorPos(x, y, magnetY, func) {
		let cursor = {}, coord = [false, false], offset = chart.offset(), y_value = 0, magnetX = Number(magnetY);
		// Abs to Rel:
		x -= offset.left;
		y -= offset.top;
		// Kurzor pozició:
		cursor.hover = ((x > 0) && (x < chart.width) && (y > zero.half) && (y < chart.height - zero.half));
		cursor.left = (x <= 0);
		cursor.right = (x >= chart.width);
		cursor.top = (y <= zero.half);
		cursor.bottom = (y >= chart.height - zero.half);
		// Ha minimum 2 item van:
		if (lineOk) {
			let xdis = ((relatives.main[1][0] - relatives.main[0][0]) * 0.5);
			if (xdis < magnetX) magnetX = xdis;
			relatives.main.map(function(p, i) {
				coord[0] = ((x > (p[0]-magnetX)) && (x <= (p[0]+magnetX)));
				coord[1] = ((y > (p[1]-magnetY)) && (y <= (p[1]+magnetY)));
				if (coord[0]) {
					cursor.valueX = balance[i];
					cursor.pointX = p[0];
					cursor.pointY = p[1];
					cursor.iX = i;
				}
				if (cursor.i === undefined && coord[0] && coord[1]) cursor.i = i;
			});
			y_value = (y - chart.float.top - main.width);
			if (y_value >= chart.innerHeight) cursor.valueY = lowest.value;
			else if (y_value <= 0) cursor.valueY = highest.value;
			else cursor.valueY = (((chart.innerHeight - y_value) * step.value) + lowest.value);
		}
		func(cursor);
	}

	return {
		elem	: chart.elem,
		top		: chart.top,
		left	: chart.left,
		width	: chart.width,
		height	: chart.height,
		inner	: {
			top		: chart.innerTop,
			left	: chart.left,
			bottom	: (chart.innerTop + chart.innerHeight),
			right	: (chart.left + chart.width),
			width	: chart.width,
			height	: chart.innerHeight
		},
		index	: {
			highest	 : highest.index,
			lowest	 : lowest.index,
			largest	 : largest.index,
			smallest : smallest.index
		},
		values	: {
			highest	 : highest.value,
			lowest	 : lowest.line,
			largest	 : largest.item,
			smallest : smallest.item,
			summary	 : balance,
			items	 : items
		},
		thickness: {
			main	: main.width,
			trend	: trnd.width,
			zero	: zero.width
		},
		points: relatives,
		offset: chart.offset,
		dataByCursorPos: dataByCursorPos,
		dataByCursor: function(magnetY, func) {
			// Ha már van, akkor törlés:
			window.removeEventListener('mousemove', window.graph_listeners[chart.class]);
			// Újradefiniálás:
			window.graph_listeners[chart.class] = (function(event) {
				let x = event.clientX, y = event.clientY;
				dataByCursorPos(x, y, magnetY, func);
			});
			// Hozzáadás:
			window.addEventListener('mousemove', window.graph_listeners[chart.class]);
		}
	}
}

function createColumnGraph(param) {

	if (!param['elem']) return window.alert('createGraph({\n\n   elem :   HTMLElement   is not found!\n\n});\n');
	if (!param['items']) return window.alert('createGraph({\n\n   items :   Array[...]   is not defined!\n\n});\n');

	let chart    = { class: param['elem'], elem: document.getElementsByClassName(param['elem'])[0], html: '' },
		items    = param['items'],
		columnOk = (items.length > 0),
		summary  = 0,
		balance  = [],
		step     = { x: 0, y: 0, top: 0, width: 0 },
		largest  = { item: 0, index: 0 },
		smallest = { item: 0, index: 0 },
		clmn     = { css: false, width: 1, border: 0 },
		avrg     = { css: false, width: 2, half: 1, points: '', top: 0, value: 0 },
		zero     = { css: false, width: 2, half: 1, points: '', top: 0, bottom: 0 },
		sheets   = document.styleSheets, sheet;


	// CSS bontása:
	for (sheet in sheets) {
		if (!sheets.hasOwnProperty(sheet)) continue;
		let rules = sheets[sheet].cssRules, rule, selector;
		for (rule in rules) {
			if (!rules.hasOwnProperty(rule)) continue;
			selector = String(rules[rule].selectorText);
			// Main Column ----------------------------->
			if (selector.indexOf(chart.class + '-main') > -1) {
				clmn.width = ((parseInt(rules[rule].style['max-width']) * 0.01) || 1);
				clmn.border = (parseInt(rules[rule].style['border'].split('px')[0]) || 0);
				clmn.css = true;
			}
			// Average Line ---------------------------->
			if (selector.indexOf(chart.class + '-avg') > -1) {
				let w = rules[rule].style['stroke-width'];
				avrg.width = ((w !== '') ? parseInt(w) : 2);
				avrg.half = (avrg.width * 0.5);
				avrg.css = true;
			}
			// Zero Line ------------------------------->
			if (selector.indexOf(chart.class + '-zero') > -1) {
				let w = rules[rule].style['stroke-width'];
				zero.width = ((w !== '') ? parseInt(w) : 2);
				zero.half = (zero.width * 0.5);
				zero.css = true;
			}
		}
	}


			// Tételek bontása:
			items.map(function(item, index) {
				if (item >= largest.item) {
					largest.index = index;
					largest.item = item;
				}
				if (item <= smallest.item) {
					smallest.index = index;
					smallest.item = item;
				}
				summary += item;
				balance.push(summary);
			});


	// Méretek ----------------------------------------------------------------------->
	chart.offset		= (function() { let r = chart.elem.getBoundingClientRect(); return { top: Math.round(r.top + chart.elem.clientTop), left: Math.round(r.left + chart.elem.clientLeft) } });
	chart.rect			= chart.elem.getBoundingClientRect();
	chart.float			= { top: (Math.round(chart.rect.top) - chart.rect.top), left: (Math.round(chart.rect.left) - chart.rect.left) };
	chart.top			= (chart.elem.offsetTop + chart.elem.clientTop);
	chart.left			= (chart.elem.offsetLeft + chart.elem.clientLeft);
	chart.width			= chart.elem.clientWidth;
	chart.height		= chart.elem.clientHeight;																// 100
	chart.innerTop		= Math.round(chart.top + zero.half);
	chart.innerHeight	= Math.round(chart.height - zero.width);												// 98
	// Léptetések -------------------------------------------------------------------->
	step.width			= (chart.width / items.length);
	step.top			= (chart.innerHeight / (largest.item - smallest.item));
	step.value			= ((largest.item - smallest.item) / chart.innerHeight);
	zero.top			= Math.round(chart.innerHeight + zero.half + (smallest.item * step.top));				// 99
	zero.bottom			= (chart.height - zero.top);															// 1
	avrg.value			= (summary / items.length);
	avrg.top			= Math.round(chart.height - (((avrg.value - smallest.item) * step.top) + zero.half));	// 50
	clmn.width			= Math.round(step.width * clmn.width);

	// Ha csak egy nulla item van:
	if (step.top === Infinity) {
		avrg.top = (chart.innerHeight + zero.half);
		zero.top = (chart.innerHeight + zero.half);
	}

	let x, y, b, h, relatives = { main: [], trend: [], zero: [], largest: [], smallest: [], step: [] };


			// Tételek bontása:
			items.map(function(item, index) {
				if (columnOk) {
					// Negatív az oszlop:
					let native = (item <= 0), absItem = Math.abs(item);
					// Left érték, az oszlop fele:
					x = Math.round(step.x + (step.width * 0.5));
					// Top érték zéró-vonal vagy az oszlop teteje:
					y = Math.round((step.top === Infinity) ? (chart.innerHeight + zero.half) : (native ? zero.top : (((largest.item - absItem) * step.top) + zero.half)));
					// Bottom érték az oszlop alja vagy a zéró-vonal:
					b = Math.round((step.top === Infinity) ? 0 : (native ? (zero.bottom - (absItem * step.top)) : zero.bottom));
					// Magasság:
					h = Math.round((step.top === Infinity) ? zero.half : (native ? (zero.bottom - b) : (zero.top - y)));
					// HTML összeállítás:
					chart.html += ('<div class="' + chart.class + '-main" style="position:absolute;');
					chart.html += ('width:' + clmn.width + 'px;height:auto;');
					chart.html += ('top:' + y + 'px;');
					chart.html += ('bottom:' + b + 'px;');
					chart.html += ('left:' + x + 'px;');
					chart.html += ((h < clmn.border) ? ('border-width:' + h + 'px;') : '');
					chart.html += ('border' + (native ? '-top' : '-bottom') + ':none;');
					chart.html += (native ? 'border-top-right-radius: 0px; border-top-left-radius: 0px;' : 'border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;');
					chart.html += ('transform:translate(-50%,0);box-sizing:border-box;"></div>');
					// Negatív oszlopnál a bottom érték megadása:
					if (native) y = ((chart.innerHeight - b) + zero.width);
					// Pontok megadása:
					relatives.step.push(step.x);
					relatives.main.push([x, y]);
					// Legnagyobb, legkisebb tételek:
					relatives.largest.push((index === largest.index) ? [x, y] : [0, 0]);
					relatives.smallest.push((index === smallest.index) ? [x, y] : [0, 0]);
					// Első index:
					if (index === 0) {
						// Átlag vonal:
						avrg.points = ((-avrg.width) + ',' + avrg.top + ' ' + (chart.width + avrg.width) + ',' + avrg.top);
						// Átlag pontok:
						relatives.avg = [[avrg.half, avrg.top], [(chart.width - avrg.half), avrg.top]];
						// Zéro vonal:
						zero.points = ((-zero.width) + ',' + (chart.height + zero.width) + ' ' + (-zero.width) + ',' + zero.top +  ' ' + (chart.width + zero.width) + ',' + zero.top + ' ' + (chart.width + zero.width) + ',' + (chart.height + zero.width));
						// Zero pontok:
						relatives.zero = [[zero.half, zero.top], [(chart.width - zero.half), zero.top]];
					}
					//----------------->
					step.x += step.width;
				}
			});


	// HTML összeállítás:
	if (avrg.css) chart.html += ('<svg style="position:absolute;width:' + chart.width + 'px;height:' + chart.height + 'px;margin-top:' + chart.float.top + 'px;margin-left:' + chart.float.left + 'px;overflow:visible;z-index:1;"><polyline points="' + avrg.points + '" class="' + chart.class + '-avg" style="fill:none;"></svg>');
	if (zero.css) chart.html += ('<svg style="position:absolute;width:' + chart.width + 'px;height:' + chart.height + 'px;margin-top:' + chart.float.top + 'px;margin-left:' + chart.float.left + 'px;overflow:visible;z-index:1;"><polyline points="' + zero.points + '" class="' + chart.class + '-zero"></svg>');
	// Integrálás:
	chart.elem.style.position = 'relative';
	chart.elem.style.overflow = 'hidden';
	chart.elem.innerHTML = chart.html;

	// Adatok a kurzorból:
	function dataByCursorPos(x, y, magnetY, func) {
		let cursor = {}, coord = [false, false], offset = chart.offset(), y_value = 0, magnetX = Number(magnetY);
		// Abs to Rel:
		x -= offset.left;
		y -= offset.top;
		// Kurzor pozició:
		cursor.hover = ((x > 0) && (x < chart.width) && (y > zero.half) && (y < chart.height - zero.half));
		cursor.left = (x <= 0);
		cursor.right = (x >= chart.width);
		cursor.top = (y <= zero.half);
		cursor.bottom = (y >= chart.height - zero.half);
		// Ha minimum 1 item van:
		if (columnOk) {
			if (relatives.main.length > 1) {
				let xdis = ((relatives.main[1][0] - relatives.main[0][0]) * 0.5);
				if (xdis < magnetX) magnetX = xdis;
			}
			relatives.main.map(function(p, i) {
				coord[0] = ((x > (p[0]-magnetX)) && (x <= (p[0]+magnetX)));
				coord[1] = ((y > (p[1]-magnetY)) && (y <= (p[1]+magnetY)));
				if (coord[0]) {
					cursor.valueX = items[i];
					cursor.pointX = p[0];
					cursor.pointY = p[1];
					cursor.iX = i;
				}
				if (cursor.i === undefined && coord[0] && coord[1]) cursor.i = i;
			});
			y_value = (y - chart.float.top - zero.half);
			if (y_value >= chart.innerHeight) cursor.valueY = smallest.item;
			else if (y_value <= 0) cursor.valueY = largest.item;
			else cursor.valueY = (((chart.innerHeight - y_value) * step.value) + smallest.item);
		}
		func(cursor);
	}

	return {
		elem	: chart.elem,
		top		: chart.top,
		left	: chart.left,
		width	: chart.width,
		height	: chart.height,
		inner	: {
			top		: chart.innerTop,
			left	: chart.left,
			bottom	: (chart.innerTop + chart.innerHeight),
			right	: (chart.left + chart.width),
			width	: chart.width,
			height	: chart.innerHeight
		},
		index	: {
			largest	 : largest.index,
			smallest : smallest.index
		},
		values	: {
			largest	 : largest.item,
			smallest : smallest.item,
			summary	 : balance,
			items	 : items,
			avg		 : avrg.value
		},
		thickness: {
			column	: { min: clmn.width, max: step.width },
			avg		: avrg.width,
			zero	: zero.width
		},
		points: relatives,
		offset: chart.offset,
		dataByCursorPos: dataByCursorPos,
		dataByCursor: function(magnetY, func) {
			// Ha már van, akkor törlés:
			window.removeEventListener('mousemove', window.graph_listeners[chart.class]);
			// Újradefiniálás:
			window.graph_listeners[chart.class] = (function(event) {
				let x = event.clientX, y = event.clientY;
				dataByCursorPos(x, y, magnetY, func);
			});
			// Hozzáadás:
			window.addEventListener('mousemove', window.graph_listeners[chart.class]);
		}
	}
}
