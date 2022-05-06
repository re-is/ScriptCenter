/*------------------------------
	*** mq5 Minifier ***

	Creator: István Reich
	Release date: 2019.02.13
-------------------------------*/

(function() {

	//-------------------------------+
	var mq5_file = 'Trender EURUSD';
	var mqh_file = 'Trender Strategy';
	//-------------------------------+

	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var mq5_text_file = fso.OpenTextFile(mq5_file + '.mq5', 1);
	var mq5_text = mq5_text_file.ReadAll(); mq5_text_file.Close();
	var new_mq5 = "";
	var rows = mq5_text.split('\n');
	var comment = false;
	var inputs = {};

	for (var i = 0; i < rows.length; i++) {
		var row = rows[i].split('\;')[0];

		// Komment blokk bekapcsolása:
		if (row.indexOf('/*') > -1) comment = true;

		if (!comment) {
			var words = row.split('\=')[0].split(' ');
			var input_row = (row.indexOf('\=') > -1);
			var name = (input_row ? ((row.indexOf('balance_per_lot') == -1) ? words[words.length - 2] : false) : false);
			var value = (input_row ? row.split(/\=(\s?)/)[1].split(';')[0] : false);

			if (name && value) inputs[name] = value;
			else if ((row.indexOf('//') == -1) && (row.indexOf('#include') == -1)) new_mq5 += rows[i] + '\n';
		}

		// Komment blokk kikapcsolása:
		if (row.indexOf('*/') > -1) comment = false;
	}

	// Inputok lecserélése:
	for (var name in inputs) {
		new_mq5 = new_mq5.replace(new RegExp(name, 'g'), inputs[name]);
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////

	var mqh_text_file = fso.OpenTextFile(mqh_file + '.mqh', 1);
	var mqh_text = mqh_text_file.ReadAll(); mqh_text_file.Close();
	var char = (mqh_text + new_mq5).split("");
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

	// Pontosvessző beillesztése:
	// Ha nincs utána:
	text = text.replace(/\}semicolon_after_bracket(?!(else|catch|\;|\,|\)|\}))/g, "\}\;");
	// Ha van:
	text = text.replace(/\}semicolon_after_bracket(?=(else|catch|\;|\,|\)|\}))/g, "\}");

	// Nem lehet egysorban az #include-dal:
	text = text.replace(/\bCTrade\b/g, '\nCTrade');

	var tf = fso.CreateTextFile(mq5_file + '.min.mq5', true);
	tf.WriteLine(text);
	tf.Close();

})();
