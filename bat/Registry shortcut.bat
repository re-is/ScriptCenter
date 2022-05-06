@echo off
:: Újranyitás kicsiben:
if "%1" == "" start "" /min "%~dpnx0" /flag && exit
:: Kulcs:
set "key=HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run"
::--------------------------------------------------------------------------------------------------
taskkill /f /im "regedit.exe"
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Applets\Regedit" /v "LastKey" /d "%key%" /f
echo WScript.CreateObject("WScript.Shell").Exec("regedit.exe") > %temp%\t.vbs
cscript //nologo %temp%\t.vbs
del %temp%\t.vbs
::--------------------------------------------------------------------------------------------------
exit
