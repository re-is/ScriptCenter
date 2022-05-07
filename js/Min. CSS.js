/*-------------------------------
	*** CSS Minifier ***

	Author: István Reich
	Release date: 2022.05.06.
-------------------------------*/

(function() {

	//-----------------------------------------------------+
	var css_file = 'shl.css';
	//-----------------------------------------------------+
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var opened_text_file = fso.OpenTextFile(css_file, 1);
	var css_text = opened_text_file.ReadAll(); opened_text_file.Close();

	// Új sor és kommentek törlése:
	css_text = css_text.replace(/\r\n/g, '').replace(/(\/\*.*?\*\/)/g, '');

	// Karakterekre bontás:
	var c = css_text.split(''), block = false, calc = false, quote = '', new_text = '';
	for (var i = 0; i < c.length; i++) {

		// Zárás:
		if (c[i] === '}') block = false;

				// Kettő közt:
				if (block) {

					// Idézőn belül:
					if (quote !== '') {
						new_text += ((c[i] === ' ') ? '--------SPACE--------' : (c[i] === '	') ? '--------TAB--------' : c[i]);
					}
					else {
						new_text += ((calc && c[i] === ' ') ? '--------SPACE--------' : c[i]);
					}

					// calc()
					if (c[i-4] === 'c' && c[i-3] === 'a' && c[i-2] === 'l' && c[i-1] === 'c' && c[i] === '(') calc = true;
					if (calc && c[i] === ')') calc = false;

					// Nyitás:
					if (quote === '') {
						if (c[i] === '"' || c[i] === "'") quote = c[i];
					}
					else if (quote === c[i]) quote = '';
				}
				// SelectorText:
				else new_text += ((c[i] === ' ' || c[i] === '	') ? '--------SPACE--------' : c[i]);

		// Nyitás:
		if (c[i] === '{') block = true;
	}

	// Szóközök törlése:
	new_text = new_text.replace(/(\s\B|\B\s)/g, '');
	new_text = new_text.replace(/--------SPACE--------/g, ' ');
	new_text = new_text.replace(/--------TAB--------/g, '	');

	new_text = new_text.replace(/\;*\}\s*/g, '}');
	new_text = new_text.replace(/\s*\{/g, '{');

	var tf = fso.CreateTextFile(css_file.substring(0, css_file.length - 4) + '.min.css', true);
	tf.WriteLine(new_text);
	tf.Close();

})();
