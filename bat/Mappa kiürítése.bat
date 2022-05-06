:: aaa mappa tartalmának törlése:
set targetdir="D:\aaa"
del /q %targetdir%\*
for /d %%x in (%targetdir%\*) do @rd /s /q ^"%%x^"
