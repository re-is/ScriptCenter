@echo off

::  Windows 10-11 Pro

cd /d "C:\Windows\System32"

cscript //nologo slmgr.vbs /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
cscript //nologo slmgr.vbs /skms kms.digiboy.ir
cscript //nologo slmgr.vbs /ato

timeout /t 2


::  Ha nincs Office 2021 Pro, akkor kilépés:
if not exist "C:\Program Files\Microsoft Office\Office16\OSPP.vbs" (exit)

cd /d "%ProgramFiles%\Microsoft Office\Office16"

for /f %%x in ('dir /b ..\root\Licenses16\ProPlus2021VL_KMS*.xrm-ms') do cscript //nologo OSPP.vbs /inslic:"..\root\Licenses16\%%x"

cscript //nologo OSPP.vbs /setprt:1688
cscript //nologo OSPP.vbs /unpkey:6F7TH>nul
cscript //nologo OSPP.vbs /inpkey:FXYTK-NJJ8C-GB6DW-3DYQT-6F7TH
cscript //nologo OSPP.vbs /sethst:e8.us.to
cscript //nologo OSPP.vbs /act
