#NoTrayicon
; #pragma compile(Icon, 'icon.ico')
; #pragma compile(FileVersion, '3.7.21')
; #pragma compile(CompanyName, 'Reich István')

; Return C: D: E: F:
Func DriveByName($name)
	Local $i, $drive = DriveGetDrive("all"), $letter = ""
	For $i = 1 To $drive[0]
		If (DriveGetLabel($drive[$i]) = $name) Then $letter = StringUpper($drive[$i])
	Next
	Return $letter
EndFunc

Run('explorer.exe ' & DriveByName("Helyi lemez") & '\VMware\')
