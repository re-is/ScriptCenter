:: DLL fájl átnevezése:
set dll="%SystemRoot%\System32\wuaueng.dll.bak"
if exist %dll% (rename %dll% "wuaueng.dll")
:: Keresés automatikus:
sc config wuauserv start= auto
:: Windows Update indítása:
net start wuauserv
exit
