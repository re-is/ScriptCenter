#NoTrayIcon
; Ikon az .exe fájlhoz:
#Pragma compile(Icon, 'icon.ico')
; Hosts fájl megnyitása olvasáshoz:
$hosts = FileOpen("C:\Windows\System32\drivers\etc\hosts", 0)
; Szöveg keresése:
$pos = StringInStr(FileRead($hosts), "license.piriform.com")
; Bezárás:
FileClose($hosts)
; Hosts fájl megnyitása íráshoz:
$hosts = FileOpen("C:\Windows\System32\drivers\etc\hosts", 1)
; Ha nincs benne a fenti szöveg, akkor beleírás:
If $pos == 0 Then FileWriteLine($hosts, @lf & "127.0.0.1 license.piriform.com")
; Bezárás:
FileClose($hosts)
; CCleaner indítása:
Run('"CCleaner64.exe"')
