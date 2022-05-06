/*-------------------------------
	*** HTML-HTA Minifier ***

	Author: István Reich
	Release date: 2018.06.27.
-------------------------------*/

(function() {

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	//-----------------------------------------------------+
	var ht_file = 'HTA Update Maker.hta';
	//-----------------------------------------------------+

	var opened_text_file = fso.OpenTextFile(ht_file, 1);
	var opened_text = opened_text_file.ReadAll(); opened_text_file.Close();
	var char = opened_text.split("");
	var text = "";
	var activated = "";
	var string_char = false;
	var string_single = false;
	var string_double = false;
	var string_regex = false;
	var bracket_block = false;
	var comment_block = false;
	var comment_line = false;
	var new_line = true;

	var stylesheet = false;
	var cs_started = false;
	var javascript = false;
	var js_started = false;

	function $(c, r) {
		if (c === undefined) return false;
		return (c.search(r) == 0);
	}

	// Karakterekre bontás:
	for (var i = 0; i < char.length; i++) {
		/////////////////////////////////////////////////////////////////////////////

		//------- StyleSheet

		/////////////////////////////////////////////////////////////////////////////
		if (!cs_started) {
			// <style
			if ($(char[i], /\</) && $(char[i+1], /s/) && $(char[i+2], /t/) && $(char[i+3], /y/) && $(char[i+4], /l/) && $(char[i+5], /e/)) stylesheet = true;
			// >
			if ($(char[i], /\>/) && stylesheet) cs_started = true;
		}
		//---------------
		if (stylesheet && !javascript) {
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
				if (cs_started) {
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
				}
				// StyleSheet írása:
				text += char[i];
			}
		}
		/////////////////////////////////////////////////////////////////////////////

		//------- JavaScript

		/////////////////////////////////////////////////////////////////////////////
		if (!js_started) {
			// <script
			if ($(char[i], /\</) && $(char[i+1], /s/) && $(char[i+2], /c/) && $(char[i+3], /r/) && $(char[i+4], /i/) && $(char[i+5], /p/) && $(char[i+6], /t/)) javascript = true;
			// >
			if ($(char[i], /\>/) && javascript) js_started = true;
		}
		//---------------
		if (javascript && !stylesheet) {
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
			if (!comment_block && !comment_line) {
				if (js_started) {
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
				}
				// JavaScript írása:
				text += char[i];
			}
		}
		/////////////////////////////////////////////////////////////////////////////

		//------- HTML

		/////////////////////////////////////////////////////////////////////////////
		if (!stylesheet && !javascript) {
			// Block kezdés:
			//		<!--
			if ($(char[i], /\</) && $(char[i+1], /\!/) && $(char[i+2], /-/) && $(char[i+3], /-/)) {
				if (activated == "") {
					comment_block = true;
					activated = "block";
				}
			}
			// Block vége:
			//		-->
			if ($(char[i-2], /-/) && $(char[i-1], /-/) && $(char[i], /\>/) && (activated == "block")) activated = "";
			// Műveletek kommenten kívül:
			if (!comment_block) {
				// Új sor:
				if ($(char[i], /\n/)) new_line = true;
				// Amíg a szóköz van:
				if ($(char[i], /\S/)) new_line = false;
				// Sor eleji szóközök törlése:
				if (new_line) char[i] = "";
				// HTML írása:
				text += char[i];
			}
		}
		//------------------------------------------------------------------+

		// CSS: </style>
		if (cs_started && !$(char[i-8], /\\/) && $(char[i-7], /\</) && $(char[i-6], /\//) && $(char[i-5], /s/) && $(char[i-4], /t/) && $(char[i-3], /y/) && $(char[i-2], /l/) && $(char[i-1], /e/) && $(char[i], /\>/)) {
			stylesheet = false;
			cs_started = false;
		}

		// JS: </script>
		if (js_started && !$(char[i-9], /\\/) && $(char[i-8], /\</) && $(char[i-7], /\//) && $(char[i-6], /s/) && $(char[i-5], /c/) && $(char[i-4], /r/) && $(char[i-3], /i/) && $(char[i-2], /p/) && $(char[i-1], /t/) && $(char[i], /\>/)) {
			javascript = false;
			js_started = false;
		}

		// Reset:
		if (activated == "") {
			if (string_single) string_single = false;
			if (string_double) string_double = false;
			if (string_regex) string_regex = false;
			if (comment_block) comment_block = false;
			if (comment_line) comment_line = false;
		}
	}

	// CSS -------------------------------------------------------------+

		// ;} cseréje:
		text = text.replace(/\;semicolon_before_bracket\}/g, "\}");

	// JS --------------------------------------------------------------+

		// ;} cseréje:
		text = text.replace(/\;\}semicolon_after_bracket/g, "\}semicolon_after_bracket");

		// Pontosvessző beillesztése, ha nincs utána:
		text = text.replace(/\}semicolon_after_bracket(?!(else|catch|\;|\,|\)|\}))/g, "\}\;");
		// Ha van:
		text = text.replace(/\}semicolon_after_bracket(?=(else|catch|\;|\,|\)|\}))/g, "\}");

	var tf = fso.CreateTextFile(ht_file.substring(0, ht_file.length - 4) + '.min.hta', true);
	tf.WriteLine(text);
	tf.Close();

})();
