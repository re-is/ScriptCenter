@echo off
:: Temp file készítés:
set file="%temp%\temp.ps1"
> %file% echo $client = new-object System.Net.WebClient
>> %file% echo $client.DownloadFile("https://...","$env:userprofile\Desktop\file.exe")
:: PowerShell futtatása:
powershell -executionpolicy bypass %file%
:: Temp file törlés:
del %file%
