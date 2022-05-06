@echo off
if exist %USERPROFILE%\AppData\Local\install_info.ini (
	findstr /m "keresett" %USERPROFILE%\AppData\Local\install_info.ini
	if not errorlevel == 1 (
		echo Van a "keresett" szó
	)
)
