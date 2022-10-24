function mq5_nicify(mq5_name) {

	var mq5_file = (mq5_name + '.mq5');
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var opened_text_file = fso.OpenTextFile(mq5_file, 1);
	var text = opened_text_file.ReadAll(); opened_text_file.Close();
	var ch = text.replace(/\r\n\s*/g, '\n').split('');
	var mq5_text = '';
	var string = '', string_temp = '';
	var comment = '';
	var bracket = false;
	var blocks = 1;

	for (var i = 0; i < ch.length; i++) {

		if (comment === '' && string === '') {
			if (ch[i] === '"' || ch[i] === '#' || (ch[i-1] === '(' && ch[i] === '/')) string_temp = ch[i];
		}

		if (comment === '' && string === '') {
			if (ch[i] === '/' && ch[i+1] === '*') comment = 'block';
			if (ch[i] === '/' && ch[i+1] === '/') comment = 'line';
		}

		// Kommenten kívül:
		if (comment === '') {

			// String-en kívül:
			if (string === '') {

				// Zárójel közti újsorok törlése:
				if (ch[i] === '(') bracket = true;
				else if (bracket) {
					if (ch[i] === '\n') ch[i] = '';
					else if (ch[i] === ' ' && ch[i+1] === ' ') ch[i] = '';
					else if (ch[i] === ')') bracket = false;
				}

				// Behúzások:
				if (ch[i] === '{') blocks++;
				if (ch[i+1] === '}') blocks--;
				if (ch[i] === '\n') ch[i] += Array(blocks).join('	');

				if ((ch[i] === '\)') && (ch[i+1] === '\{')) ch[i] = ') ';

				mq5_text += ch[i];
			}
			else {
				// /*
				if (ch[i] === '/' && ch[i+1] === '*')					mq5_text += '@@_COMMENT_@@';
				// *-/
				else if (ch[i] === '*' && ch[i+1] === '/')				mq5_text += '@@_COMMENT_END_@@';
				// //
				else if (ch[i] === '/' && ch[i+1] === '/')				mq5_text += '@@_COMMENT_@@';
				// ;}
				else if (ch[i] === ';' && ch[i+1] === '}')				mq5_text += '@@_SEMICOLON_@@';
				// ,
				else if (ch[i] === ',')									mq5_text += '@@_COLON_@@';
				// \\\n
				else if (ch[i] === '\\' && ch[i+1] === '\n')			mq5_text += '@@_NEWLINE_@@';
				// if
				else if (ch[i] === 'i' && ch[i+1] === 'f')				mq5_text += '@@_IF_@@';
				// else
				else if (ch[i] === 's' && ch[i+1] === 'e')				mq5_text += '@@_ELSE_@@';
				// operators
				else if ('\+\-\*\/\%\<\>\=\!\?\:'.indexOf(ch[i]) > -1)	mq5_text += (ch[i] + '@@_OPERATORS_@@');
				// minden más
				else													mq5_text += ch[i];
			}

		}

		// Kommentek kikapcsolása:
		if (comment === 'block' && ch[i-1] === '*' && ch[i] === '/') comment = '';
		if (comment === 'line' && ch[i+1] === '\n') comment = '';

		// Az aktuális nincs megadva, mert azonnal kikapcsolná:
		// Kikapcsolás, ha a következő ugyanaz, mint a mostani és nincs előtte \ jel vagy ha \\ van előtte:
		// # sor
		if (string === '#') {
			if (ch[i] === '\n') {
				string_temp = '';
				string = '';
			}
		}
		else if (string === ch[i]) {
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

	// Utolsó szóközök:
	mq5_text = mq5_text.replace(/( |	)*(?=\n)/g, '');
	// ;}
	mq5_text = mq5_text.replace(/(\;\})/g, '}');
	// Vessző után szóköz:
	mq5_text = mq5_text.replace(/(\,|\;)(?!\s)/g, '$1 ');
	// Nyitókapocs:
	mq5_text = mq5_text.replace(/(\n*\s*\{)/g, ' {');
	// if()
	mq5_text = mq5_text.replace(/\b(if|for|while|return)(?=\()/g, '$1 ');
	// if () újsor:
	mq5_text = mq5_text.replace(/(\))\s*\n+\s*/g, ') ');
	// else újsor:
	mq5_text = mq5_text.replace(/(\belse\b)\s*\n+\s*/g, 'else ');
	// operators:
	var operators = '([?:]|[!][=]|[&][&]|[|][|]|[=][=]?|[+\\-*/<>%][=]?(?![/-]))(?!@@_OPERATORS_@@)';
	mq5_text = mq5_text.replace(new RegExp(operators, 'g'), ' $1 ').replace(/ ([+-])  ([+-]) /g, '$1$2').replace(new RegExp('[ ][ ]' + operators + '(?:\\s\\s)', 'g'), ' $1 ');

	// String-en belüliek visszaállítása:
	mq5_text = mq5_text.replace(/@@_COMMENT_@@/g, '/');
	mq5_text = mq5_text.replace(/@@_COMMENT_END_@@/g, '*');
	mq5_text = mq5_text.replace(/@@_SPACE_@@/g, ' ');
	mq5_text = mq5_text.replace(/@@_TABULATOR_@@/g, '	');
	mq5_text = mq5_text.replace(/@@_SEMICOLON_@@/g, ';');
	mq5_text = mq5_text.replace(/@@_COLON_@@/g, ',');
	mq5_text = mq5_text.replace(/@@_NEWLINE_@@\s*/g, '\\n');
	mq5_text = mq5_text.replace(/@@_IF_@@/g, 'i');
	mq5_text = mq5_text.replace(/@@_ELSE_@@/g, 's');
	mq5_text = mq5_text.replace(/(.)(@@_OPERATORS_@@)/g, '$1');

	var min = fso.CreateTextFile(mq5_name + '.nice.mq5', true);
	min.WriteLine(mq5_text);
	min.Close();

	return mq5_text;
}

mq5_nicify('BB');
