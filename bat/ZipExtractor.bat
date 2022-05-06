:: ----- Zip extractor --------
:: Creator: István Reich, 2020
:: ----------------------------
@echo off
:: %1 zip file
:: %2 target folder
if not exist %1 exit
if not exist %2 mkdir %2
:: Create temporary vbs file:
set "vbscript=%temp%\extractor.vbs"
echo Set sapp = CreateObject("Shell.Application"):sapp.NameSpace(%2).CopyHere(sapp.NameSpace(%1).items)> %vbscript%
cscript %vbscript%
del %vbscript%
