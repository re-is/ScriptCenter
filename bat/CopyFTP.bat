@echo off
::------------------------------------------------------------------------->
:: Minimized restart
::------------------------------------------------------------------------->
if "%1" == "" start "" /min "%~dpnx0" /flag && exit
::------------------------------------------------------------------------->
:: Variables
::------------------------------------------------------------------------->
set "data=%TEMP%\data.txt"
set "asset=C:\Users\Admin\AndroidStudioProjects\Banker\app\src\main\assets"
set "files=Android/data/com.example.banker/files"
::------------------------------------------------------------------------->
:: Write FTP commands into data.txt
::------------------------------------------------------------------------->
echo open 192.168.43.1 2221> %data%
echo put %asset%\index.html %files%/index.html>> %data%
echo put %asset%\components.js %files%/components.js>> %data%
echo disconnect>> %data%
:: Other device and ip-adress:
::------------------------------->
:: echo open 192.168.43.215 2221>> %data%
:: echo put %asset%\index.html %files%/index.html>> %data%
:: echo put %asset%\components.js %files%/components.js>> %data%
:: echo disconnect>> %data%
::------------------------------->
echo quit>> %data%
::------------------------------------------------------------------------->
:: Run FTP with data.txt and delete
::------------------------------------------------------------------------->
ftp -n -s:%data% -A
del %data% & exit
