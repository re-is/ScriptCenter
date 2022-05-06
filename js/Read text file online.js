var result = '';
var file = elem('file_input_id').files[0];
var reader = new FileReader();
reader.readAsText(file);

// Fájl betöltése:
reader.onload = (function(reader) {
	return function() { result = reader.result };
})(reader);

// ...betöltés után:
reader.onloadend = (function() {
	alert(result);
});
