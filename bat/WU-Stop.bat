:: Windows Update leállítása:
net stop wuauserv
:: Keresés tiltása:
sc config wuauserv start= disabled
:: DLL fájl átnevezése:
set dll="%SystemRoot%\System32\wuaueng.dll"
if exist %dll% (rename %dll% "wuaueng.dll.bak")
exit
