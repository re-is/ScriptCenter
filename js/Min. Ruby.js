/*------------------------------
	*** Ruby Minifier ***

	Author: István Reich
	Release date: 2018.02.04
-------------------------------*/

(function() {

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	//-----------------------------------------------------+
	var rb_file = 'original_extension.rb';
	//-----------------------------------------------------+

	var opened_text_file = fso.OpenTextFile(rb_file, 1);
	var opened_text = opened_text_file.ReadAll(); opened_text_file.Close();
	var char = opened_text.split("");
	var text = "";
	var activated = "";
	var string_char = false;
	var string_single = false;
	var string_double = false;
	var string_inter = false;
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
			// Double interpolated " #{ } "
			//		#{
			if ($(char[i], /\{/) && $(char[i-1], /\#/)) {
				if (activated == "double") {
					string_inter = true;
					activated = "";
				}
			}
			//		}
			if (($(char[i], /\}/)) && string_inter) {
				string_double = true;
				activated = "double";
				string_inter = false;
			}
			// Regex
			if ($(char[i], /\//)) {
				if (activated == "") {
					// Ha az előző karakter nyitó zárójel:
					if ($(char[i-1], /\(/)) {
						string_regex = true;
						activated = "regex";
					}
				}
				else if (activated == "regex") activated = "";
			}
			// Block kezdés
			//		=begin
			if ($(char[i], /\=/) && $(char[i+1], /b/) && $(char[i+2], /e/) && $(char[i+3], /g/) && $(char[i+4], /i/) && $(char[i+5], /n/)) {
				if (activated == "") {
					comment_block = true;
					activated = "block";
				}
			}
			// Block vége
			//		=end
			if ($(char[i], /d/) && $(char[i-1], /n/) && $(char[i-2], /e/) && $(char[i-3], /\=/) && (activated == "block")) activated = "";
			// Vonal kezdés
			//		#
			if ($(char[i], /\#/)) {
				if (activated == "") {
					comment_line = true;
					activated = "line";
				}
			}
			// Vonal vége, ha a karakter új sor:
			//		#			¬
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
			// --------------------------------------------+
			// string-en kívül:
			if ((!string_single) && (!string_double) && (!string_regex)) {
				// Pontosvessző beszúrás:
				if ($(char[i], /\r/)) char[i] = ($(char[i-1], /\;|\{|\[|\(|\,/) ? "" : "\;semicolon_for_end_of_row");
				// Szóközök törlése a operátorok elől és mögül:
				if ($(char[i], /\s/)) {
					// Kivéve ? és :
					//			(bool ? "string_1" : "string_2")
					if (!$(char[i-1], /\?|\:/) && !$(char[i+1], /\?|\:/)) {
						if ($(char[i-1], /\B/) || $(char[i+1], /\B/) || ($(char[i-1], /\b/) && $(char[i+1], /\B/)) || ($(char[i-1], /\B/) && $(char[i+1], /\b/))) char[i] = "";
					}
				}
			}
			// string-en belül:
			else {
				// Sor vég törlése:
				if ($(char[i], /\r/)) char[i] = "";
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

	text = text.replace(/\;semicolon_for_end_of_row(?=(\}|\]|\)))/g, "");

	text = text.replace(/semicolon_for_end_of_row/g, "");

	var tf = fso.CreateTextFile('extension.rb', true);
	tf.WriteLine(text);
	tf.Close();

})();
