function css_min(css_name) {

	var css_file = (css_name + '.css');
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var opened_text_file = fso.OpenTextFile(css_file, 1);
	var text = opened_text_file.ReadAll(); opened_text_file.Close();
	var ch = text.split('');
	var css_text = '';
	var string = '', string_temp = '';
	var comment = '';
	var selector = true;

	for (var i = 0; i < ch.length; i++) {

		if (comment === '' && string === '') {
			if (ch[i] === '"' || ch[i] === "'") string_temp = ch[i];
		}

		if (comment === '' && string === '') {
			if (ch[i] === '/' && ch[i+1] === '*') comment = 'block';
		}

		if (comment === '' && string === '') {
			if (selector && ch[i] === '{') selector = false;
			if (!selector && ch[i] === '}') selector = true;
		}

		// Kommenten kívül:
		if (comment === '') {

			// String-en kívül:
			if (string === '') {
				css_text += ((selector && ch[i] === ' ' && ch[i+1] !== '{') ? '@@_SPACE_@@' : ch[i]);
			}
			else {
				// /*
				if (ch[i] === '/' && ch[i+1] === '*')			css_text += '@@_COMMENT_@@';
				// *-/
				else if (ch[i] === '*' && ch[i+1] === '/')		css_text += '@@_COMMENT_END_@@';
				// space
				else if (ch[i] === ' ')							css_text += '@@_SPACE_@@';
				// tab
				else if (ch[i] === '	')						css_text += '@@_TABULATOR_@@';
				// ;}
				else if (ch[i] === ';' && ch[i+1] === '}')		css_text += '@@_SEMICOLON_@@';
				// minden más
				else											css_text += ch[i];
			}

		}

		// Kommentek kikapcsolása:
		if (comment === 'block' && ch[i-1] === '*' && ch[i] === '/') comment = '';

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

	// calc(100px[ ]-[ ]20px)
	css_text = css_text.replace(/(\s+)\B(?=[-+/*]\s).(\s+)/g, function(operator){
		return ('@@_SPACE_@@' + operator + '@@_SPACE_@@');
	});

	// TAB:
	css_text = css_text.replace(/\t/g, '');

	// Sorok:
	css_text = css_text.replace(/\r*\n*/g, '');

	// Szóközök
	css_text = css_text.replace(/(\s\B)|(\B\s)/g, '');

	// ;}
	css_text = css_text.replace(/(\;\})/g, '}');

	// String-en belüliek visszaállítása:
	css_text = css_text.replace(/@@_COMMENT_@@/g, '/');
	css_text = css_text.replace(/@@_COMMENT_END_@@/g, '*');
	css_text = css_text.replace(/@@_SPACE_@@/g, ' ');
	css_text = css_text.replace(/@@_TABULATOR_@@/g, '	');
	css_text = css_text.replace(/@@_SEMICOLON_@@/g, ';');

	var min = fso.CreateTextFile(css_name + '.min.css', true);
	min.WriteLine(css_text);
	min.Close();

	return css_text;

}

css_min('teszt');
