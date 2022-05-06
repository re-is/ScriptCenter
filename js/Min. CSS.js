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

	// Kommentek törlése: ( HTML, CSS, Js )
	css_text = css_text.replace(/\r\n/g, '').replace(/(\/\*.*?\*\/)/g, '');

	var double = css_text.split('"'), double_text = '';
	for (var i = 0; i < double.length; i++) {
		double_text += (i % 2 ? ('"' + double[i].replace(/\s/g, 'a(------(space)------)a') + '"') : double[i]);
	}

	var simple = double_text.split("'"), new_text = '';
	for (var i = 0; i < simple.length; i++) {
		new_text += (i % 2 ? ("'" + simple[i].replace(/\s/g, 'a(------(space)------)a') + "'") : simple[i]);
	}

	// Szóközök törlése:
	new_text = new_text.replace(/((\s)\B|\B(\s))/g, '');

	// Fontos szóközök visszaállítása:
	new_text = new_text.replace(/a\(------\(space\)------\)a/g, ' ');

	// ;}
	new_text = new_text.replace(/\;\}/g, '}');

	var tf = fso.CreateTextFile(css_file.substring(0, css_file.length - 4) + '.min.css', true);
	tf.WriteLine(new_text);
	tf.Close();

})();
