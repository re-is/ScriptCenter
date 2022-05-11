function js_min(js_name) {

	var js_file = (js_name + '.js');
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var opened_text_file = fso.OpenTextFile(js_file, 1);
	var text = opened_text_file.ReadAll(); opened_text_file.Close();
	var ch = text.split('');
	var js_text = '';
	var string = '', string_temp = '';
	var comment = '';

	for (var i = 0; i < ch.length; i++) {

		if (comment === '' && string === '') {
			if (ch[i] === '"' || ch[i] === "'" || (ch[i-1] === '(' && ch[i] === '/')) string_temp = ch[i];
		}

		if (comment === '' && string === '') {
			if (ch[i] === '/' && ch[i+1] === '*') comment = 'block';
			if (ch[i] === '/' && ch[i+1] === '/') comment = 'line';
		}

		// Kommenten kívül:
		if (comment === '') {

			// String-en kívül:
			if (string === '') {
				js_text += ch[i];
			}
			else {
				// /*
				if (ch[i] === '/' && ch[i+1] === '*')			js_text += '@@_COMMENT_@@';
				// *-/
				else if (ch[i] === '*' && ch[i+1] === '/')		js_text += '@@_COMMENT_END_@@';
				// //
				else if (ch[i] === '/' && ch[i+1] === '/')		js_text += '@@_COMMENT_@@';
				// space
				else if (ch[i] === ' ')							js_text += '@@_SPACE_@@';
				// tab
				else if (ch[i] === '	')						js_text += '@@_TABULATOR_@@';
				// ;}
				else if (ch[i] === ';' && ch[i+1] === '}')		js_text += '@@_SEMICOLON_@@';
				// minden más
				else											js_text += ch[i];
			}

		}

		// Kommentek kikapcsolása:
		if (comment === 'block' && ch[i-1] === '*' && ch[i] === '/') comment = '';
		if (comment === 'line' && ch[i+1] === '\n') comment = '';

		// Az aktuális nincs megadva, mert azonnal kikapcsolná:
		// Kikapcsolás, ha a következő ugyanaz, mint a mostani és nincs előtte \ jel:
		if (string === ch[i]) {
			//	(/asaa\/ aaa/g, '')
			//	"dfsfs \"inner\" ffff["]
			if (ch[i-1] !== '\\') {
				string_temp = '';
				string = '';
			}
			//	"HKCR\\htafile\\Shell\\Open\\Command\\["]
			else if (ch[i-2] === '\\') {
				string_temp = '';
				string = '';
			}
		}
		// A következő karakteren kell:
		else string = string_temp;
	}

	// Comment sorok:
	js_text = js_text.replace(/(\/\/.*(?=\*\/))|(\/\/.*)/g, '\r\n');

	// TAB:
	js_text = js_text.replace(/\t/g, '');

	// Sorok:
	js_text = js_text.replace(/\r*\n*/g, '');

	// Comment block:
	js_text = js_text.replace(/(\/\*.*\*\/)/g, '');

	// Szóközök
	js_text = js_text.replace(/(\s\B)|(\B\s)/g, '');

	// ;}
	js_text = js_text.replace(/(\;\})/g, '}');

	// String-en belüliek visszaállítása:
	js_text = js_text.replace(/@@_COMMENT_@@/g, '/');
	js_text = js_text.replace(/@@_COMMENT_END_@@/g, '*');
	js_text = js_text.replace(/@@_SPACE_@@/g, ' ');
	js_text = js_text.replace(/@@_TABULATOR_@@/g, '	');
	js_text = js_text.replace(/@@_SEMICOLON_@@/g, ';');

	var min = fso.CreateTextFile(js_name + '.min.js', true);
	min.WriteLine(js_text);
	min.Close();

	return js_text;

}

js_min('teszt');
