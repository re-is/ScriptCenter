(function() {

	//-----------------------------------------------------+
	var js_name = 'teszt';
	var js_file = (js_name + '.js');
	//-----------------------------------------------------+

	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var opened_text_file = fso.OpenTextFile(js_file, 1);
	var text = opened_text_file.ReadAll(); opened_text_file.Close();
	var ch = text.split('');
	var js_text = '';
	var string = '';

	for (var i = 0; i < ch.length; i++) {

		// String-en kívül:
		if (string === '') {
			js_text += ch[i];
		}
		else {
			// /*
			if (ch[i] === '/' && ch[i+1] === '*')			js_text += '@@_COMMENT_@@';
			// */
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

		if (string === '' && (ch[i] === '"' || ch[i] === "'" || (ch[i-1] === '(' && ch[i] === '/'))) string = ch[i];
		else if (string === ch[i]) string = '';
	}

	// Comment sorok:
	js_text = js_text.replace(/([/][/].*(?=\*\/))|([/][/].*)/g, '\r\n');

	// TAB:
	js_text = js_text.replace(/\t/g, '');

	// Sorok:
	js_text = js_text.replace(/\r*\n*/g, '');

	// Comment block:
	js_text = js_text.replace(/([/][*].*[*][/])/g, '');

	// Szóközök
	js_text = js_text.replace(/(\s\B)|(\B\s)/g, '');

	// ;}
	js_text = js_text.replace(/[;][}]/g, '}');

	// String-en belüliek visszaállítása:
	js_text = js_text.replace(/@@_COMMENT_@@/g, '/');
	js_text = js_text.replace(/@@_COMMENT_END_@@/g, '*');
	js_text = js_text.replace(/@@_SPACE_@@/g, ' ');
	js_text = js_text.replace(/@@_TABULATOR_@@/g, '	');
	js_text = js_text.replace(/@@_SEMICOLON_@@/g, ';');

	var min = fso.CreateTextFile(js_name + '.min.js', true);
	min.WriteLine(js_text);
	min.Close();

})();
