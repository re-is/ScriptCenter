(function() {

	var file = 'C:\\temp.txt', fso = new ActiveXObject('Scripting.FileSystemObject'), wss = new ActiveXObject('WScript.Shell');
	// Get IP:
	wss.Run('cmd.exe /c ipconfig > "' + file + '"', 0, true);
	// Open temp file:
	var opened_text_file = fso.OpenTextFile(file, 1);
	// Get Wi-fi DNS address:
	var rows = opened_text_file.ReadAll().split('\n'), dns = rows[rows.length-2].replace(/\s*/g, '');
	// Close temp file:
	opened_text_file.Close();
	// Delete:
	fso.DeleteFile(file);
	// Copy to clipboard:
	var clipboard = wss.Exec("clip").stdIn;
	clipboard.WriteLine(dns);
	clipboard.Close();

})();
