/*-------------------------------
	*** CSS Minifier ***

	Author: István Reich
	Release date: 2018.06.27.
-------------------------------*/

(function() {

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	//-----------------------------------------------------+
	var css_file = 'Red Line YouTube.css';
	//-----------------------------------------------------+

	var opened_text_file = fso.OpenTextFile(css_file, 1);
	var opened_text = opened_text_file.ReadAll(); opened_text_file.Close();
	var char = opened_text.split("");
	var text = "";
	var activated = "";
	var string_char = false;
	var string_single = false;
	var string_double = false;
	var string_regex = false;
	var comment_block = false;
	var bracket_block = false;
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
			}
		}
		// Műveletek kommenten kívül:
		if (!comment_block) {
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
			if ((!string_single) && (!string_double)) {
				// Kapocs nyitás:
				if ($(char[i], /\{/)) bracket_block = true;
				// Kapocs zárás:
				if ($(char[i], /\}/)) {
					bracket_block = false;
					char[i] = "semicolon_before_bracket\}";
				}
				// Szóközök törlése a operátorok elől és mögül:
				if ($(char[i], /\s/) && bracket_block) {
					if (!$(char[i+1], /\#/) && ($(char[i-1], /\B/) || $(char[i+1], /\B/) || ($(char[i-1], /\b/) && $(char[i+1], /\B/)) || ($(char[i-1], /\B/) && $(char[i+1], /\b/)))) char[i] = "";
					// : # => :#
					if ($(char[i-1], /\:/) && $(char[i+1], /\#/)) char[i] = "";
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
			// StyleSheet írása:
			text += char[i];
		}

		// Reset:
		if (activated == "") {
			if (string_single) string_single = false;
			if (string_double) string_double = false;
			if (string_regex) string_regex = false;
			if (comment_block) comment_block = false;
		}
	}

	// ;} cseréje:
	text = text.replace(/\;semicolon_before_bracket\}/g, "\}");

	var tf = fso.CreateTextFile(css_file.substring(0, css_file.length - 4) + '.min.css', true);
	tf.WriteLine(text);
	tf.Close();

})();
