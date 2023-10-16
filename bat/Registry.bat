@echo off

reg add "HKCU\Software\my key" /ve /d "My Default Data" /f
pause
reg add "HKCU\Software\my key" /v "1. value" /t REG_SZ /d "My Data 1." /f
pause

reg query "HKCU\Software\my key" /v "1. value"
echo %errorlevel%
pause

reg add "HKCU\Software\my key" /v "2. value" /t REG_DWORD /d 1 /f
pause
reg delete "HKCU\Software\my key" /v "1. value" /f
pause
reg delete "HKCU\Software\my key" /f
pause
