/*------------------------------
	*** JavaScript Minifier ***

	Author: István Reich
	Release date: 2018.03.10
-------------------------------*/

(function() {

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	//-----------------------------------------------------+
	var js_file = 'Shl.js';
	//-----------------------------------------------------+

	var opened_text_file = fso.OpenTextFile(js_file, 1);
	var opened_text = opened_text_file.ReadAll(); opened_text_file.Close();
	var char = opened_text.split("");
	var text = "";
	var activated = "";
	var string_char = false;
	var string_single = false;
	var string_double = false;
	var string_regex = false;
	var comment_block = false;
	var comment_line = false;
	var new_line = true;

	function $(c, r) {
		if (c === undefined) return false;
		return (c.search(r) == 0);
	}

	// Karakterekre bontás:
	for (var i = 0; i < char.length; i++) {
		// Ha nincs előtte \ jel:
		if (!string_char) {
			// Single
			if ($(char[i], /\'/)) {
				if (activated == "") {
					string_single = true;
					activated = "single";
				}
				else if (activated == "single") activated = "";
			}
			// Double
			if ($(char[i], /\"/)) {
				if (activated == "") {
					string_double = true;
					activated = "double";
				}
				else if (activated == "double") activated = "";
			}
			//		/ jel után:
			if ($(char[i], /\//)) {
				// Regex, ha nincs előtte és utána / vagy * jel:
				// pl:  hello (/regex/) end
				if (!$(char[i-1], /\/|\*/) && !$(char[i+1], /\/|\*/)) {
					if (activated == "") {
						// Ha az előző karakter nyitó zárójel:
						if ($(char[i-1], /\(/)) {
							string_regex = true;
							activated = "regex";
						}
					}
					else if (activated == "regex") activated = "";
				}
				// Block kezdés, ha a következő karakter *
				//		/*
				if ($(char[i+1], /\*/)) {
					if (activated == "") {
						comment_block = true;
						activated = "block";
					}
				}
				// Block vége, ha az előző karakter *
				//		*/
				if ($(char[i-1], /\*/) && (activated == "block")) activated = "";
				// Vonal kezdés, ha a következő karakter /
				//		//
				if ($(char[i+1], /\//)) {
					if (activated == "") {
						comment_line = true;
						activated = "line";
					}
				}
			}
			// Vonal vége, ha a következő karakter új sor:
			//		// 	¬
			if ($(char[i], /\n/) && (activated == "line")) activated = "";
		}
		//------------------------------------------------------------------+
		// Műveletek kommenten kívül:
		if ((!comment_block) && (!comment_line)) {
			// Új sor:
			if ($(char[i], /\n/)) new_line = true;
			// Amíg a szóköz van:
			if ($(char[i], /\S/)) new_line = false;
			// Sor eleji szóközök törlése:
			if (new_line) char[i] = "";
			// Egysorba rakás:
			if ($(char[i], /\r/)) char[i] = "";
			// --------------------------------------------+
			// string-en kívül:
			if ((!string_single) && (!string_double) && (!string_regex)) {
				// Temp a pontosvesszőhöz:
				if ($(char[i], /\}/)) char[i] = "\}semicolon_after_bracket";
				// Szóközök törlése a operátorok elől és mögül:
				if ($(char[i], /\s/)) {
					if ($(char[i-1], /\B/) || $(char[i+1], /\B/) || ($(char[i-1], /\b/) && $(char[i+1], /\B/)) || ($(char[i-1], /\B/) && $(char[i+1], /\b/))) char[i] = "";
				}
			}
			// string-en belül:
			else {
				// Sor végi per jelek törlése:
				if ($(char[i], /\\/) && $(char[i+1], /\r/)) char[i] = "";
				// Reguláris karakter indítása:
				if ($(char[i], /\\/) && !string_char) string_char = true;
				// Befejezése:
				else if (string_char) string_char = false;
			}
			// text írása:
			text += char[i];
		}
		//------------------------------------------------------------------+
		// Reset:
		if (activated == "") {
			if (string_single) string_single = false;
			if (string_double) string_double = false;
			if (string_regex) string_regex = false;
			if (comment_block) comment_block = false;
			if (comment_line) comment_line = false;
		}
	}

	// ;} cseréje:
	text = text.replace(/\;\}semicolon_after_bracket/g, "\}semicolon_after_bracket");

	// Pontosvessző beillesztése:
	// Ha nincs utána:
	text = text.replace(/\}semicolon_after_bracket(?!(else|catch|\;|\,|\)|\}))/g, "\}\;");
	// Ha van:
	text = text.replace(/\}semicolon_after_bracket(?=(else|catch|\;|\,|\)|\}))/g, "\}");

	var date = new Date();

	text = "//   Super HTA Library   |   Author: István Reich   |   Build date: " + date.getFullYear() + "." + String("0" + (date.getMonth() + 1)).slice(-2) + "." + String("0" + date.getDate()).slice(-2) + "\r\n" + text;

	var tf = fso.CreateTextFile('shl.181125.min.js', true);
	tf.WriteLine(text);
	tf.Close();

})();
