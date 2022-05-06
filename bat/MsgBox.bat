@echo off

if not "%minimized%"=="" goto :minimized
set "minimized=true"
start /min cmd /C "%~dpnx0"
exit

:: Futtatás cmd ablak nélkül
:minimized
	:: Gombok:
	:: Ok | Mégse:							1
	:: Leállítás | Ismét | Kihagyás	2
	:: Igen | Nem | Mégse				3
	:: Igen | Nem 							4
	:: Ismét | Mégse						5

	:: Eredmények:
	:: OK:			1
	:: Mégse:		2
	::	Leállítás:	3
	::	Ismét:		4
	:: Kihagyás:	5
	:: Igen:			6
	:: Nem:			7

	:: Message Box: 	"Szöveg" 		"Gombok" 		"Ablak cím"
	call :MsgBox "Igen vagy nem ?" "4 + vbQuestion" "Title"
		if errorlevel 7 (
			call :MsgBox "	Nem	"
		) else if errorlevel 6 (
			call :MsgBox "	Igen	"
		)

	exit

:: Kiegészítés!
:MsgBox
	setlocal enableextensions
		set "tempFile=%temp%\message_box.vbs"
		> "%tempFile%" echo WScript.Quit MsgBox("%~1",%~2,"%~3") & cscript //nologo //e:vbscript "%tempFile%"
		set "exitCode=%errorlevel%" & del "%tempFile%" >nul 2>nul
	endlocal & exit /b %exitCode%
